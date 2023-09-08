"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { AlertCircle, Loader, Search } from "lucide-react"
import H4 from "../typography/H4"
import clsx from "clsx"
import { debounce } from "@/lib/utils"


const schema = z.object({
  query: z.string()
    .nonempty("Please enter a valid search term")
    .min(2, "Please enter at least 2 characters")
    .max(50, "Please enter at most 50 characters"),
})

type SearchFormValues = z.infer<typeof schema>

export default function Query() {
  const [data, setData] = useState<Spotify.ArtistSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      query: "",
    }
  })



  async function onSubmit(values: SearchFormValues) {
    try {
      setLoading(true)
      const response = await fetch(`/api/artist/search?artist=${values.query}`)
      const artist: Spotify.ArtistSearchResponse = await response.json()
      if (!artist) return console.log("No artist found")
      setData(artist)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const debouncedSearch = debounce(onSubmit, 300);


  return (
    <div className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center">
          <label htmlFor="query" className="sr-only">Search</label>
          <input {...form.register('query')}
            onChange={(e) => debouncedSearch({ query: e.target.value })}
            autoComplete="off"
            name="query"
            placeholder="Taylor Swift"
            className="flex py-2 pr-3 w-full h-10 text-xl rounded-md border-b focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-background placeholder:text-muted-foreground" />
          <Button disabled={loading} className="border-b" type="submit" size='icon' variant='ghost'>
            {loading ? <Loader className="animate-spin" /> : <Search />}
          </Button>
        </form>
        {form.formState.errors.query &&
          <p className='flex gap-1 items-center mt-1 text-sm text-rose-600'>
            <span><AlertCircle className="stroke-rose-600" size={16} /></span>
            {form.formState.errors.query.message}
          </p>}
      </Form>
      {data && data.artists.items.length > 0 &&
        <ScrollArea className="py-2 w-full h-52 border-b">
          {data.artists.items.map((artist, i) => (
            <a href={`/artist/${artist.id}`} key={artist.id} className={clsx("flex justify-between group items-center p-2 rounded cursor-pointer", {
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
          ))}
        </ScrollArea>
      }
    </div>
  )
} 
