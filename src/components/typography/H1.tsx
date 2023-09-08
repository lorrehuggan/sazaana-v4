import { cn } from "@/lib/utils"

export default function H1({ children, classes }: { children: React.ReactNode, classes?: string }) {
  return (
    <h1 className={cn("text-4xl font-extrabold tracking-tight lg:text-5xl scroll-m-20", classes)}>
      {children}
    </h1>
  )
}
