import { getPostBySlug, getPostSlugs, getAllPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Generate static params for fast edge delivery
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

// MDX Components mapping for custom styling
const components = {
    h1: (props: any) => <h1 className="text-4xl md:text-5xl font-bold font-heading mt-12 mb-6 text-white" {...props} />,
    h2: (props: any) => <h2 className="text-3xl font-bold font-heading mt-10 mb-4 text-white" {...props} />,
    h3: (props: any) => <h3 className="text-2xl font-bold font-heading mt-8 mb-4 text-white" {...props} />,
    p: (props: any) => <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside space-y-2 text-white/70 mb-6 text-base md:text-lg marker:text-gold" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-inside space-y-2 text-white/70 mb-6 text-base md:text-lg marker:text-gold" {...props} />,
    a: (props: any) => <a className="text-gold hover:underline underline-offset-4 decoration-white/20" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-gold bg-gold/5 p-6 rounded-r-xl italic text-white/80 my-8" {...props} />,
    pre: (props: any) => <pre className="p-4 md:p-6 rounded-xl bg-[#0d1117] border border-white/10 overflow-x-auto my-8 font-mono text-sm leading-relaxed shadow-2xl" {...props} />,
    code: (props: any) => <code className="bg-white/10 rounded px-1.5 py-0.5 text-pink/90 font-mono text-[0.9em]" {...props} />,
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // rehype-pretty-code options for beautiful syntax highlighting
    const options = {
        mdxOptions: {
            rehypePlugins: [
                [
                    rehypePrettyCode,
                    {
                        theme: 'aurora-x', // Vercel-like sleek theme
                        keepBackground: false,
                    },
                ],
            ],
        },
    };

    return (
        <div className="min-h-screen bg-charcoal text-white selection:bg-gold/30">
            <Navbar />

            <main className="pt-32 pb-24 px-6 relative z-10 max-w-4xl mx-auto">
                <Link href="/insights" className="inline-flex items-center text-xs font-bold text-white/40 hover:text-gold uppercase tracking-widest transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
                </Link>

                <header className="mb-16">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-6 font-mono">
                        <Badge variant="outline" className="border-gold text-gold bg-gold/5 uppercase tracking-widest text-[10px] rounded">
                            Article
                        </Badge>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(post.metadata.date).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="flex items-center gap-1.5 text-gold/80"><BookOpen className="w-3.5 h-3.5" />{post.metadata.readingTime}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 tracking-tight leading-tight">
                        {post.metadata.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-light">
                        {post.metadata.excerpt}
                    </p>
                </header>

                <article className="prose prose-invert prose-lg max-w-none">
                    <MDXRemote source={post.content} components={components} options={options as any} />
                </article>
            </main>

            <Footer />
        </div>
    );
}
