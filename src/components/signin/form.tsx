"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input";
import Muted from "../typography/Muted";
import Small from "../typography/Small";
import { signIn, getProviders, LiteralUnion, ClientSafeProvider, } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index"
import { useEffect, useMemo, useState } from "react"

type Providers = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default function SignInForm() {
  const [providers, setProviders] = useState<Providers | null>(null)
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    (async () => {
      await getProviders()
        .then((providers) => setProviders(providers))
    }
    )()
  }, [])

  async function signInWithOauth(id: string) {
    signIn(id, { callbackUrl: '/' })
  }

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    await signIn('credentials', {
      email: values.email,
      password: values.password,
      callbackUrl: '/console',
    })
  }

  const oauthProviders = useMemo(() => {
    return providers && Object.values(providers).filter((provider) => provider.type !== 'credentials')
  }, [providers])

  return (
    <Form {...form}>
      <Muted>Sign in with your email & password</Muted>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button className="w-full" type="submit">Continue with email</Button>
        <div className="flex gap-2 items-center h-12">
          <div className="w-full h-[1px] bg-muted" />
          <div><Small>or</Small></div>
          <div className="w-full h-[1px] bg-muted" />
        </div>
        {oauthProviders && oauthProviders.map(provider => (
          <Button key={provider.name} onClick={() => signInWithOauth(provider.id)} className="w-full" type="button">Sign in with {provider.name}</Button>
        ))}
      </form>
    </Form>
  )
}
