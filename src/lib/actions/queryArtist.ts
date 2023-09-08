export async function queryArtist(formData: FormData) {
  "use server"
  const query = formData.get("query")
  console.log(query)
}
