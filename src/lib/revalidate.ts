import { revalidatePath } from 'next/cache';

/** Refresh every page that shows articles. */
export function revalidateBlog(...slugs: Array<string | null | undefined>) {
  ['/', '/blog', '/blog/rss.xml', '/sitemap.xml'].forEach((path) => revalidatePath(path));
  slugs.forEach((slug) => slug && revalidatePath(`/blog/${slug}`));
}
