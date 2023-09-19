export default function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-semibold tracking-tight transition-colors first:mt-0 scroll-m-20">
      {children}
    </h2>
  )
}
