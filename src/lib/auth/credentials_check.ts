import * as bcrypt from "bcrypt"
import db from "@/db/index";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

type Credentials = Record<'email' | 'password', string> | undefined

export async function credentialsCheck(credentials: Credentials) {

  if (!credentials || !credentials.email && !credentials.password) return null

  try {
    const response = await db
      .select()
      .from(users)
      .where(eq(users.email, credentials.email))

    const user = response[0]

    if (!user || !user.hashedPassword) return null

    const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)

    if (!passwordMatch) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    }
  } catch (error: any) {
    console.error(error.message)
    return null
  }

}
