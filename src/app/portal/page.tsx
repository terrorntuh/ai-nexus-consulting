import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ShieldCheck, FileText, Download, Clock, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
    title: 'Client Portal | AI Nexus Consulting',
    description: 'Secure access to your custom AI roadmaps and enterprise documents.',
};

export default async function PortalDashboard() {
    const supabase = await createClient();

    // 1. Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/portal/login');
    }

    // 2. Fetch their client profile
    const { data: clientProfile } = await supabase
        .from('clients')
        .select('*')
        .eq('id', user.id)
        .single();

    // 3. Fetch their assigned documents
    const { data: documents } = await supabase
        .from('client_documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

    return (
        <main className="min-h-screen bg-charcoal text-white pt-24 pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
                                Secure Connection
                            </Badge>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mt-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Welcome back, {clientProfile?.company_name || 'Enterprise Client'}
                        </h1>
                        <p className="text-white/50 max-w-2xl text-lg">
                            Access your bespoke AI roadmaps, compliance documentation, and deployed architecture blueprints.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px] items-end">
                        <div className="glass p-4 rounded-xl border border-white/5 flex items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-gold" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Status</p>
                                <p className="text-sm font-medium text-white capitalize">{clientProfile?.setup_status || 'Pending Setup'}</p>
                            </div>
                        </div>
                        <form action="/auth/logout" method="post" className="w-full">
                            <button type="submit" className="w-full py-2.5 text-xs text-white/40 hover:text-white bg-white/5 hover:bg-white/10 hover:border-white/10 rounded-lg border border-white/5 transition-all uppercase tracking-widest font-bold flex justify-center items-center gap-2">
                                Disconnect Session
                            </button>
                        </form>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Your Documents</h2>
                        <span className="text-sm text-white/40">{documents?.length || 0} files available</span>
                    </div>

                    {(!documents || documents.length === 0) ? (
                        <Card className="glass border-white/5 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                                    <FileText className="w-8 h-8 text-white/20" />
                                </div>
                                <h3 className="text-xl font-bold text-white">No documents yet</h3>
                                <p className="text-white/40 max-w-sm">
                                    Your dedicated AI Consultant will upload your NDAs, Roadmaps, and Strategy PDFs here once they are finalized.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map((doc) => (
                                <Card key={doc.id} className="glass border-white/5 hover:border-gold/30 transition-all duration-300 group">
                                    <CardHeader className="pb-4 border-b border-white/5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-white/5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                                <FileText className="w-6 h-6 text-gold" />
                                            </div>
                                            <Badge variant="outline" className="text-[10px] text-white/50 border-white/10 uppercase">
                                                {doc.file_type.split('/')[1] || 'FILE'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-white mb-2 leading-tight group-hover:text-gold transition-colors">{doc.title}</CardTitle>
                                            <CardDescription className="text-white/50 text-sm line-clamp-2">
                                                {doc.description}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(doc.uploaded_at).toLocaleDateString()}
                                        </div>
                                        <a
                                            href={`/api/portal/documents/${doc.id}/download`}
                                            className="flex items-center gap-2 text-sm text-gold hover:text-white font-bold transition-colors bg-gold/10 hover:bg-gold/20 px-3 py-1.5 rounded-md"
                                        >
                                            Download
                                            <Download className="w-4 h-4" />
                                        </a>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
