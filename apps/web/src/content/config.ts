import { defineCollection, z } from "astro:content";

const works = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    role: z.string(),
    period: z.object({
      from: z.string(),
      to: z.string().optional(),
    }),
    tech: z.array(z.string()).min(1),
    domain: z.string().optional(),
    category: z.string().optional(),
    team_size: z.number().int().positive().optional(),
    position: z.string().optional(),
    involvement: z.enum(["lead", "core", "member", "advisor"]).optional(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const skills = defineCollection({
  type: "content",
  schema: z.object({
    category: z.enum(["Backend", "Frontend", "Infrastructure", "Practice"]),
    name: z.string(),
    since: z.number().int().min(1990).max(2100),
    status: z.enum(["current", "past"]).default("current"),
    level: z.number().int().min(1).max(5).optional(),
    works: z.array(z.string()).optional(),
    order: z.number().int().optional(),
  }),
});

export const collections = { works, skills };
