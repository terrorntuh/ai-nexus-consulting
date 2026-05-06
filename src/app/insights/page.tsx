import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
    title: 'Insights & Methodology | AI Nexus Consulting',
    description: 'Thought leadership and Afro-futurist strategies for enterprise AI deployment in emerging markets.',
};

export default function InsightsPage() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-charcoal text-white selection:bg-gold/30">
            <Navbar />

            <main className="pt-32 pb-24 px-6 relative z-10 max-w-7xl mx-auto">
                <div className="mb-16 max-w-2xl">
                    <Badge variant="outline" className="border-gold text-gold bg-gold/5 mb-4 uppercase tracking-widest text-[10px]">
                        Thought Leadership
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
                        Insights & <span className="text-gradient-gold">Methodology</span>
                    </h1>
                    <p className="text-white/60 text-lg leading-relaxed">
                        Explore our engineering deep-dives, Afro-futurist design principles, and strategies for deploying compliant, human-centric AI systems.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link href={`/insights/${post.slug}`} key={post.slug}>
                            <Card className="glass border-white/5 h-full hover:border-gold/30 transition-all duration-300 group overflow-hidden">
                                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                                    <div className="flex items-center gap-4 text-xs text-white/40 mb-6 font-mono">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(post.date).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                        <span className="flex items-center gap-1.5 text-gold/80"><BookOpen className="w-3.5 h-3.5" />{post.readingTime}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold font-heading mb-4 group-hover:text-gold transition-colors leading-tight">
                                        {post.title}
                                    </h2>
                                    <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center text-xs font-bold text-gold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                        Read Article <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-24 glass border-white/5 rounded-2xl">
                        <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white/60">No insights published yet.</h3>
                        <p className="text-white/40 mt-2">Check back soon for engineering deep-dives.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
