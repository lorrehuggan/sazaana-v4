"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"
import clsx from "clsx"
import {
  Form,
} from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader, Search } from "lucide-react"
import { Spinner } from "@nextui-org/react";
import { debounce } from "@/lib/utils"
import { useCurrentArtists } from "@/lib/stores/currentArtists"
import { useCurrentQuery } from "@/lib/stores/query"
import { ScrollShadow } from "@nextui-org/react";

const schema = z.object({
  query: z.string()
    .nonempty("Please enter a valid search term")
    .min(2, "Please enter at least 2 characters")
    .max(25, "Please enter at most 25 characters"),
})

type SearchFormValues = z.infer<typeof schema>

export default function Query() {
  const [data, setData] = useState<Spotify.ArtistSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [queryValue, setQueryValue] = useState<string>('')
  const [currentArtistName, setCurrentArtistName] = useState<string | null>(null)
  const results = useRef<HTMLDivElement | null>(null)
  const CURRENT_ARTIST = useCurrentArtists((state) => state)
  const SET_QUERY = useCurrentQuery((state) => state.set)

  const onSubmit: SubmitHandler<SearchFormValues> = async (values) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/artist/q?artist=${values.query}`)
      const artist: Spotify.ArtistSearchResponse = await response.json()
      if (!artist) return console.log("No artist found")
      setData(artist)
      setLoading(false)
    } catch (error) {
      form.reset()
      setLoading(false)
      console.log(error)
    }
  }

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      query: "",
    }
  })

  useEffect(() => {
    if (queryValue.length === 0) {
      SET_QUERY(false)
    }
    else {
      SET_QUERY(true)
    }

  }, [SET_QUERY, queryValue])


  const debouncedSearch = debounce(onSubmit, 600);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length < 2) return
    if (e.target.value.length > 25) return
    if (e.target.value.length === 0) return setData(null)
    setQueryValue(e.target.value)
    // debouncedSearch({ query: e.target.value })
  }

  function handleOnClick(artist: Spotify.ArtistObjectFull) {
    let current = CURRENT_ARTIST.artists
    if (current.length === 5) {
      current.shift()
      current.push(artist)
      CURRENT_ARTIST.set(current)
      CURRENT_ARTIST.setID(current[4].id)
      CURRENT_ARTIST.setName(current[4].name)
    } else {
      CURRENT_ARTIST.add(artist)
      CURRENT_ARTIST.setID(artist.id)
      CURRENT_ARTIST.setName(artist.name)
    }
    setQueryValue('')
    setData(null)
    form.reset()
  }

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const ref = results.current
    document.addEventListener('click', (e) => {
      if (ref && !ref.contains(e.target as Node)) {
        setData(null)
        setQueryValue('')
        SET_QUERY(false)
        form.reset()
      }
    })
    return () => document.removeEventListener('click', (e) => {
      if (ref && !ref.contains(e.target as Node)) {
        setData(null)
        setQueryValue('')
        SET_QUERY(false)
        form.reset()
      }
    })
  })

  useEffect(() => {
    const unsub = useCurrentArtists.subscribe((state) => {
      setCurrentArtistName(state.artistName)
    })
    return () => unsub()
  }, [])


  return (
    <div className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center">
          <label htmlFor="query" className="sr-only">Search</label>
          <input {...form.register('query')}
            onChange={handleOnChange}
            autoComplete="off"
            name="query"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setData(null)
                setQueryValue('')
                SET_QUERY(false)
                form.reset()
              }
              if (e.key === "Enter" && e.shiftKey === false) {
                e.preventDefault()
                if (queryValue.length === 0 || queryValue.length < 2 || queryValue.length > 25) {
                  return form.trigger()
                }
                onSubmit({ query: queryValue })
                return
              }
            }}
            placeholder={currentArtistName ? `${currentArtistName}` : "Search for an artist"}
            className="flex py-2 pr-3 w-full h-10 text-base rounded-md border-b lg:text-xl focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-background placeholder:text-muted-foreground" />
          <Button disabled={loading} className="border-b" type="submit" size='icon' variant='ghost'>
            {loading ? <Spinner /> : <Search />}
          </Button>
        </form>
        {form.formState.errors.query &&
          <p className='flex gap-1 items-center mt-1 text-sm text-rose-600'>
            <span><AlertCircle className="stroke-rose-600" size={16} /></span>
            {form.formState.errors.query.message}
          </p>}
      </Form>
      {data && data.artists.items.length > 0 && queryValue.length > 1 &&
        <ScrollShadow ref={results} hideScrollBar className="pb-2 w-full h-52">
          {data.artists.items.map((artist, i) => (
            <div onClick={() => handleOnClick(artist)} key={artist.id}>
              <div className={clsx("flex justify-between group items-center p-2 rounded cursor-pointer hover:bg-neutral-800 color-fade", {
                "bg-muted/10": i % 2 === 0,
              })}>
                {/* eslint-disable */}
                <div className="flex gap-4 items-center">
                  <img src={artist.images[0]?.url ?? 'https://placehold.co/300'} alt={artist.name} className="object-cover w-12 h-12 rounded" />
                  {/* eslint-enable */}
                  <div className="h-full">
                    <h4 className="font-bold">{artist.name}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollShadow>
      }
    </div>
  )
} 
