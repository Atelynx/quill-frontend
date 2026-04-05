import PagesBar from '../components/Links.component'

function Home() {
  return (
    <div className="bg-background w-full min-h-screen">
      <header>
        <PagesBar />
      </header>
      <section className="px-6 py-2">
        <h1 className="text-3xl font-bold text-text mb-4">Welcome to Quill</h1>

      </section>
    </div>
  )
}

export default Home
