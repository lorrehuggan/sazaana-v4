"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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




const schema = z.object({
  query: z.string()
    .nonempty("Please enter a valid search term")
    .min(2, "Please enter at least 2 characters")
    .max(25, "Please enter at most 25 characters"),
})

type SearchFormValues = z.infer<typeof schema>

export default function Query() {
  const router = useRouter()
  const [data, setData] = useState<Spotify.ArtistSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [queryValue, setQueryValue] = useState<string>('')
  const results = useRef<HTMLDivElement | null>(null)
  const currentArtist = useCurrentArtists((state) => state)
  const setCurrentArtistID = useCurrentArtists((state) => state.setID)
  const setCurrentArtistName = useCurrentArtists((state) => state.setName)
  const [lastSearch, setLastSearch] = useState<string | null>(null)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      query: "",
    }
  })

  async function onSubmit(values: SearchFormValues) {
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

  const debouncedSearch = debounce(onSubmit, 600);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQueryValue(e.target.value)
    if (e.target.value.length < 2) return
    if (e.target.value.length > 25) return
    if (e.target.value.length === 0) return setData(null)
    debouncedSearch({ query: e.target.value })
  }

  function handleOnClick(artist: Spotify.ArtistObjectFull) {
    currentArtist.add(artist)
    setCurrentArtistID(artist.id)
    setCurrentArtistName(artist.name)
    setQueryValue('')
    setData(null)
    form.reset()
    router.push(`/artist/${artist.id}`)
  }

  useEffect(() => {
    const ref = results.current
    document.addEventListener('click', (e) => {
      if (ref && !ref.contains(e.target as Node)) {
        setData(null)
        setQueryValue('')
        form.reset()
      }
    })
    return () => document.removeEventListener('click', (e) => {
      if (ref && !ref.contains(e.target as Node)) {
        setData(null)
        setQueryValue('')
        form.reset()
      }
    })
  })

  useEffect(() => {
    const artist: string = JSON.parse(localStorage.getItem('currentArtists')!).state.artistName
    if (artist.length === 0) return
    setLastSearch(artist)
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
            placeholder={lastSearch ? `${lastSearch}` : "Search for an artist"}
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
        <ScrollArea className="py-2 w-full h-52 border-b" ref={results}>
          {data.artists.items.map((artist, i) => (
            <div onClick={() => handleOnClick(artist)} key={artist.id}>
              <a className={clsx("flex justify-between group items-center p-2 rounded cursor-pointer", {
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
              </a>
            </div>
          ))}
        </ScrollArea>
      }
    </div>
  )
} 
