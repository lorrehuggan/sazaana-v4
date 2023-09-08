import SpotifyProvider from "next-auth/providers/spotify"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { credentialsCheck } from "@/lib/auth/credentials_check";
import "dotenv/config"

const scope = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-follow-modify',
  'user-follow-read',
  'user-top-read',
  'user-read-recently-played',
  'user-library-modify',
  'user-read-email',
  'user-read-private',
].join(' ').trim()

export const providers = [
  SpotifyProvider({
    clientId: process.env.SPOTIFY_ID ?? '',
    clientSecret: process.env.SPOTIFY_SECRET ?? '',
    authorization: {
      params: {
        scope,
      }
    }
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_ID ?? '',
    clientSecret: process.env.GOOGLE_SECRET ?? '',
  }),
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      return await credentialsCheck(credentials)
    }
  })
]
