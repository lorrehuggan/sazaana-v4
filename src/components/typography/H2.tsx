export default function TypographyH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="pb-2 text-3xl font-semibold tracking-tight border-b transition-colors first:mt-0 scroll-m-20">
      {children}
    </h2>
  )
}
