import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    published: z.boolean().default(false),
    // SEO fields (optional so legacy posts keep building)
    description: z.string().optional(),
    canonical: z.string().optional(),
    readingTime: z.number().int().positive().optional(),
  }),
});

export const collections = { blog };
