import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { ArrowRight, BookOpen, Calendar } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Insights & Methodology | AI Nexus Consulting',
  description:
    'Practical notes on POPIA-aware AI workflows, human approval, and automation strategy for South African businesses.',
};

export default function InsightsPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Field Notes</p>
          <h1 className="mt-4 text-5xl font-semibold leading-none md:text-7xl">
            Insights & Methodology
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/64">
            Practical writing on POPIA-aware AI workflows, human approval, data readiness,
            and the operating discipline needed before automation touches clients.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/insights/${post.slug}`} key={post.slug} className="group">
              <article className="flex min-h-[320px] flex-col rounded-md border border-ink/12 bg-white p-7 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blueprint/40 group-hover:shadow-xl group-hover:shadow-ink/8">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-ink/42">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-ink/20" />
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {post.readingTime}
                  </span>
                </div>
                <h2 className="mt-12 text-2xl font-semibold leading-tight text-ink transition-colors group-hover:text-blueprint">
                  {post.title}
                </h2>
                <p className="mt-4 flex-1 text-sm leading-7 text-ink/62">{post.excerpt}</p>
                <div className="mt-8 flex items-center text-xs font-black uppercase tracking-[0.16em] text-coral transition-transform group-hover:translate-x-1">
                  Read article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="mt-16 rounded-md border border-ink/12 bg-white py-20 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-ink/22" />
            <h3 className="text-xl font-semibold text-ink">No insights published yet.</h3>
            <p className="mt-2 text-ink/54">Check back soon for practical AI workflow notes.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
