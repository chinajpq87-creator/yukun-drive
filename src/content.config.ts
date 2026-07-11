import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ===== Products Collection =====
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string(),
    meta_description: z.string(),
    slug: z.string(),
    category: z.string(),
    sub_category: z.string(),
    product_code: z.string(),
    related_solutions: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    status: z.string().default('draft'),
    image: z.string().optional(),
    // GEO fields
    ai_summary: z.string().optional(),
    last_modified: z.date().optional(),
    sku: z.string().optional(),
    brand: z.string().default('Yukun'),
    price: z.string().optional(),
    price_currency: z.string().default('USD'),
    availability: z.string().default('https://schema.org/InStock'),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
  }),
});

// ===== Solutions Collection =====
const solutions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/solutions' }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string(),
    meta_description: z.string(),
    slug: z.string(),
    target_industries: z.array(z.string()).default([]),
    status: z.string().default('draft'),
    image: z.string().optional(),
    // GEO fields
    ai_summary: z.string().optional(),
    last_modified: z.date().optional(),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
  }),
});

// ===== Resources Collection =====
const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string(),
    meta_description: z.string(),
    slug: z.string(),
    resource_type: z.string(),
    related_products: z.array(z.string()).default([]),
    status: z.string().default('draft'),
    // GEO fields
    ai_summary: z.string().optional(),
    last_modified: z.date().optional(),
  }),
});

// ===== Blog Collection =====
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string(),
    meta_description: z.string(),
    slug: z.string(),
    category: z.string().default('Technical'),
    date: z.date().default(() => new Date()),
    status: z.string().default('draft'),
    image: z.string().optional(),
    // GEO fields
    ai_summary: z.string().optional(),
    last_modified: z.date().optional(),
    author: z.string().default('Yukun Engineering Team'),
    author_url: z.string().optional(),
    tags: z.array(z.string()).default([]),
    og_image: z.string().optional(),
  }),
});

// ===== Pages Collection =====
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string(),
    meta_description: z.string(),
    slug: z.string(),
    status: z.string().default('draft'),
    // GEO fields
    ai_summary: z.string().optional(),
    last_modified: z.date().optional(),
  }),
});

export const collections = { products, solutions, resources, blog, pages };
