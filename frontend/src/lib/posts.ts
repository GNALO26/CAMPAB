// src/lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'public/blog')

export interface Post {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  content: string
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return []
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fn) => fn.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      return {
        slug,
        title: data.title || 'Sans titre',
        date: data.date || new Date().toISOString(),
        category: data.category || 'Non catégorisé',
        excerpt: data.excerpt || content.slice(0, 160) + '...',
        content,
      }
    })
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    return {
      slug,
      title: data.title || 'Sans titre',
      date: data.date || new Date().toISOString(),
      category: data.category || 'Non catégorisé',
      excerpt: data.excerpt || content.slice(0, 160) + '...',
      content,
    }
  } catch {
    return null
  }
}