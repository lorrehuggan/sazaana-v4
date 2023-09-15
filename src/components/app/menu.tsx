import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"


export default function MainMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu size={20} className="cursor-pointer stroke-primary" />
      </SheetTrigger>
      <SheetContent side='top' className="h-2/5 bg-secondary">
        <SheetHeader>
          <SheetTitle>Are you sure absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
