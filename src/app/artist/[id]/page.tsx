import Tracklist from "@/components/app/tracklist";

type Props = {
  params: {
    id: string
  }
}
export default function Artist({ params }: Props) {
  return (
    <section className="dark">
      <Tracklist />
    </section>
  )
}
