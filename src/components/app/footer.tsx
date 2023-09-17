import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center w-full h-14 border-t">
      <div className="container text-sm text-muted">
        <div className="flex gap-1 items-center">Made With <span> <Heart size={12} /></span> By Lorre</div>
      </div>
    </footer>
  )
}
