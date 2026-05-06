import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Where our MDX files live
const root = process.cwd();
const insightsDir = path.join(root, 'content/insights');

export type PostMetadata = {
    title: string;
    excerpt: string;
    date: string;
    readingTime: string;
    slug: string;
};

export type Post = {
    metadata: PostMetadata;
    content: string;
};

// 1. Get all post slugs
export function getPostSlugs() {
    try {
        if (!fs.existsSync(insightsDir)) {
            fs.mkdirSync(insightsDir, { recursive: true });
        }
        return fs.readdirSync(insightsDir).filter(file => file.endsWith('.mdx'));
    } catch (e) {
        console.error("Failed to read insights directory", e);
        return [];
    }
}

// 2. Read a single post by slug
export function getPostBySlug(slug: string): Post | null {
    try {
        const realSlug = slug.replace(/\.mdx$/, '');
        const fullPath = path.join(insightsDir, `${realSlug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const { data, content } = matter(fileContents);

        return {
            metadata: {
                ...data,
                slug: realSlug,
            } as PostMetadata,
            content,
        };
    } catch (e) {
        console.error("Error in getPostBySlug:", e);
        return null;
    }
}

// 3. Get all posts sorted by date
export function getAllPosts(): PostMetadata[] {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug))
        .filter((post): post is Post => post !== null)
        .map((post) => post.metadata)
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
}
