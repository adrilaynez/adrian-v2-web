import { getNoteBySlug, getNoteSlugs } from "@/lib/mdx"
import { MDXContent } from "@/components/mdx-content"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Force static generation for all notes
export async function generateStaticParams() {
    const slugs = getNoteSlugs()
    return slugs.map((slug) => ({
        slug: slug.replace(/\.mdx$/, ""),
    }))
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const note = getNoteBySlug(slug)
    if (!note) {
        return {
            title: "Note Not Found",
        }
    }
    return {
        title: `${note.title} | Adrian Laynez`,
        description: note.description,
    }
}

export default async function NotePage({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const note = getNoteBySlug(slug)

    if (!note) {
        notFound()
    }

    return (
        <article className="container max-w-3xl py-6 lg:py-10 mx-auto px-4 md:px-8">
            <Link
                href="/notes"
                className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Notes
            </Link>
            <div className="space-y-4">
                <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
                    {note.title}
                </h1>
                {note.date && (
                    <time
                        dateTime={note.date}
                        className="block text-sm text-muted-foreground"
                    >
                        {new Date(note.date).toLocaleDateString()}
                    </time>
                )}
            </div>
            <hr className="my-8 border-muted" />
            <div className="prose dark:prose-invert max-w-none">
                <MDXContent source={note.content} />
            </div>
        </article>
    )
}
