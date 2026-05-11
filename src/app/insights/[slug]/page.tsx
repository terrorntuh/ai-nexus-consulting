import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

type TextProps = ComponentPropsWithoutRef<'p'>;
type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;
type QuoteProps = ComponentPropsWithoutRef<'blockquote'>;
type PreProps = ComponentPropsWithoutRef<'pre'>;
type CodeProps = ComponentPropsWithoutRef<'code'>;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: 'Not Found' };

  return {
    title: `${post.metadata.title} | AI Nexus Consulting`,
    description: post.metadata.excerpt,
  };
}

const components = {
  h1: (props: HeadingProps) => (
    <h1 className="mb-6 mt-12 text-4xl font-semibold leading-tight text-ink md:text-5xl" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mb-4 mt-10 text-3xl font-semibold leading-tight text-ink" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mb-4 mt-8 text-2xl font-semibold leading-tight text-ink" {...props} />
  ),
  p: (props: TextProps) => <p className="mb-6 text-base leading-8 text-ink/70 md:text-lg" {...props} />,
  ul: (props: ListProps) => (
    <ul className="mb-6 list-disc space-y-2 pl-5 text-base leading-8 text-ink/70 marker:text-coral md:text-lg" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mb-6 list-decimal space-y-2 pl-5 text-base leading-8 text-ink/70 marker:text-coral md:text-lg" {...props} />
  ),
  a: (props: AnchorProps) => (
    <a className="font-semibold text-blueprint underline-offset-4 hover:underline" {...props} />
  ),
  blockquote: (props: QuoteProps) => (
    <blockquote className="my-8 rounded-r-md border-l-4 border-coral bg-stone p-6 text-ink/78" {...props} />
  ),
  pre: (props: PreProps) => (
    <pre className="my-8 overflow-x-auto rounded-md border border-ink/12 bg-ink p-4 text-sm leading-relaxed text-white shadow-xl md:p-6" {...props} />
  ),
  code: (props: CodeProps) => (
    <code className="rounded bg-stone px-1.5 py-0.5 font-mono text-[0.9em] text-ink" {...props} />
  ),
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <Link
          href="/insights"
          className="mb-12 inline-flex items-center text-xs font-black uppercase tracking-[0.16em] text-ink/42 transition-colors hover:text-coral"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to insights
        </Link>

        <header className="mb-16 border-b border-ink/10 pb-12">
          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.12em] text-ink/44">
            <span className="rounded-full border border-coral/30 px-3 py-1 text-coral">Article</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.metadata.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {post.metadata.readingTime}
            </span>
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-ink md:text-6xl">
            {post.metadata.title}
          </h1>

          <p className="mt-6 text-xl leading-8 text-ink/58 md:text-2xl">
            {post.metadata.excerpt}
          </p>
        </header>

        <article>
          <MDXRemote source={post.content} components={components} />
        </article>
      </main>

      <Footer />
    </div>
  );
}
