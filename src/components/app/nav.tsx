import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/options";

import { Ghost, Menu } from "lucide-react";
import MainMenu from "./menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserMenu from "./userMenu";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import SignOutButton from "../signout/button";


export default async function Nav() {
  const session = await getServerSession(authOptions)

  return (
    <nav className="flex justify-between items-center h-14">
      <div className="container flex justify-between items-center">
        <div>
          <MainMenu />
        </div>
        <div className="flex gap-2 items-center">
          <div>
            {!session ?
              <a href='/signin' className="text-xs font-bold text-primary">Sign In </a>
              :
              <UserMenu session={session} />
            }
          </div>
          {session && <SignOutButton />}
        </div>
      </div>
    </nav>
  )
}
