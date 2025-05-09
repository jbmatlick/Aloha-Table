import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Salt and Serenity',
  description: 'Explore Hawaiian cuisine, recipes, and culinary experiences with Salt and Serenity',
};

const blogPosts = [
  {
    id: 1,
    title: 'The Art of Hawaiian Fusion Cuisine',
    excerpt: 'Discover how traditional Hawaiian flavors blend with modern culinary techniques...',
    date: '2024-03-20',
    slug: 'hawaiian-fusion-cuisine',
  },
  {
    id: 2,
    title: 'Wine Pairing Guide for Island Dishes',
    excerpt: 'Learn the perfect wine pairings for your favorite Hawaiian dishes...',
    date: '2024-03-15',
    slug: 'wine-pairing-guide',
  },
  {
    id: 3,
    title: 'Farm-to-Table: Kauai\'s Local Ingredients',
    excerpt: 'Explore the fresh, local ingredients that make Kauai cuisine special...',
    date: '2024-03-10',
    slug: 'kauai-local-ingredients',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-playfair mb-8">Blog</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden">
              <div className="p-6">
                <time className="text-sm text-gray-400">{post.date}</time>
                <h2 className="text-xl font-playfair mt-2 mb-4">{post.title}</h2>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <a
                  href={`/blog/${post.slug}`}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Read more →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
} 