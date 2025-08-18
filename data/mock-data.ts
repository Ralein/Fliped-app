export interface Article {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  readTime: string
  domain: string
  link: string
  category: string
  dateAdded: string
  isRead: boolean
  isSaved: boolean
}

export interface Collection {
  id: string
  title: string
  description: string
  coverImage?: string
  itemCount: number
  articles: Article[]
  dateCreated: string
  lastUpdated: string
}

export interface Podcast {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  duration: string
  host: string
  link: string
  category: string
  dateAdded: string
  isPlayed: boolean
}

export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  duration: string
  channel: string
  link: string
  category: string
  dateAdded: string
  isWatched: boolean
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  dateCreated: string
  lastUpdated: string
  linkedArticles?: string[]
}

// Mock Articles
export const mockArticles: Article[] = [
  {
    id: "1",
    title: "The Future of Web Development: What's Coming in 2024",
    description:
      "Exploring the latest trends and technologies that will shape web development in the coming year, from AI integration to new frameworks and tools.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=Web+Dev",
    readTime: "5 min read",
    domain: "techcrunch.com",
    link: "https://techcrunch.com/future-web-dev-2024",
    category: "Technology",
    dateAdded: "2024-01-15",
    isRead: false,
    isSaved: true,
  },
  {
    id: "2",
    title: "Minimalist Design Principles for Modern Applications",
    description:
      "How to create clean, user-friendly interfaces that prioritize functionality while maintaining visual appeal and accessibility.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=Design",
    readTime: "8 min read",
    domain: "medium.com",
    link: "https://medium.com/minimalist-design-principles",
    category: "Design",
    dateAdded: "2024-01-14",
    isRead: true,
    isSaved: true,
  },
  {
    id: "3",
    title: "AI-Powered Content Creation: Tools and Techniques",
    description:
      "A comprehensive guide to leveraging artificial intelligence for creating engaging content across different platforms and mediums.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=AI+Content",
    readTime: "12 min read",
    domain: "wired.com",
    link: "https://wired.com/ai-content-creation-guide",
    category: "AI",
    dateAdded: "2024-01-13",
    isRead: false,
    isSaved: false,
  },
  {
    id: "4",
    title: "Building a Successful Startup in the Digital Age",
    description:
      "Key strategies and insights for entrepreneurs looking to launch and scale their digital ventures in today's competitive market.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=Startup",
    readTime: "15 min read",
    domain: "entrepreneur.com",
    link: "https://entrepreneur.com/digital-startup-guide",
    category: "Business",
    dateAdded: "2024-01-12",
    isRead: true,
    isSaved: true,
  },
  {
    id: "5",
    title: "The Psychology of User Experience Design",
    description: "Understanding how users think and behave to create more intuitive and engaging digital experiences.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=UX+Psychology",
    readTime: "10 min read",
    domain: "uxdesign.cc",
    link: "https://uxdesign.cc/psychology-of-ux",
    category: "Design",
    dateAdded: "2024-01-11",
    isRead: false,
    isSaved: true,
  },
  {
    id: "6",
    title: "Sustainable Technology: Green Computing Practices",
    description:
      "How the tech industry is adapting to environmental challenges and implementing sustainable practices.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=Green+Tech",
    readTime: "7 min read",
    domain: "nature.com",
    link: "https://nature.com/sustainable-technology",
    category: "Technology",
    dateAdded: "2024-01-10",
    isRead: true,
    isSaved: false,
  },
]

// Mock Collections
export const mockCollections: Collection[] = [
  {
    id: "1",
    title: "Web Development Resources",
    description:
      "A curated collection of the best web development tutorials, tools, and frameworks for modern developers.",
    coverImage: "/placeholder.svg?height=144&width=300&text=Web+Dev+Collection",
    itemCount: 12,
    articles: mockArticles.slice(0, 3),
    dateCreated: "2024-01-01",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    title: "Design Inspiration",
    description: "Beautiful design examples and creative inspiration from top designers and agencies around the world.",
    coverImage: "/placeholder.svg?height=144&width=300&text=Design+Collection",
    itemCount: 8,
    articles: mockArticles.filter((a) => a.category === "Design"),
    dateCreated: "2024-01-02",
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    title: "AI & Machine Learning",
    description:
      "Latest research papers, tutorials, and practical applications of artificial intelligence and machine learning.",
    coverImage: "/placeholder.svg?height=144&width=300&text=AI+Collection",
    itemCount: 15,
    articles: mockArticles.filter((a) => a.category === "AI"),
    dateCreated: "2024-01-03",
    lastUpdated: "2024-01-13",
  },
  {
    id: "4",
    title: "Startup Insights",
    description:
      "Essential reading for entrepreneurs, including funding guides, growth strategies, and success stories.",
    coverImage: "/placeholder.svg?height=144&width=300&text=Startup+Collection",
    itemCount: 6,
    articles: mockArticles.filter((a) => a.category === "Business"),
    dateCreated: "2024-01-04",
    lastUpdated: "2024-01-12",
  },
]

// Mock Podcasts
export const mockPodcasts: Podcast[] = [
  {
    id: "1",
    title: "The Future of JavaScript with Ryan Dahl",
    description: "Creator of Node.js discusses the evolution of JavaScript and his new runtime Deno.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=JS+Podcast",
    duration: "45 min",
    host: "Tech Talks",
    link: "https://example.com/podcast/1",
    category: "Technology",
    dateAdded: "2024-01-15",
    isPlayed: false,
  },
  {
    id: "2",
    title: "Design Systems at Scale",
    description: "How large companies build and maintain design systems across multiple products and teams.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=Design+Podcast",
    duration: "38 min",
    host: "Design Weekly",
    link: "https://example.com/podcast/2",
    category: "Design",
    dateAdded: "2024-01-14",
    isPlayed: true,
  },
  {
    id: "3",
    title: "AI Ethics and the Future of Work",
    description: "Exploring the ethical implications of AI and how it will reshape the job market.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=AI+Ethics",
    duration: "52 min",
    host: "Future Forward",
    link: "https://example.com/podcast/3",
    category: "AI",
    dateAdded: "2024-01-13",
    isPlayed: false,
  },
]

// Mock Videos
export const mockVideos: Video[] = [
  {
    id: "1",
    title: "React 18 New Features Deep Dive",
    description:
      "Comprehensive overview of React 18's new features including concurrent rendering and automatic batching.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=React+18",
    duration: "28 min",
    channel: "React Conference",
    link: "https://youtube.com/watch?v=react18",
    category: "Technology",
    dateAdded: "2024-01-15",
    isWatched: false,
  },
  {
    id: "2",
    title: "Figma to Code: Best Practices",
    description: "How to efficiently translate Figma designs into clean, maintainable code.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=Figma+Code",
    duration: "22 min",
    channel: "Design Dev",
    link: "https://youtube.com/watch?v=figma-code",
    category: "Design",
    dateAdded: "2024-01-14",
    isWatched: true,
  },
  {
    id: "3",
    title: "Building GPT Applications with OpenAI API",
    description: "Step-by-step guide to building AI-powered applications using OpenAI's GPT models.",
    thumbnailUrl: "/placeholder.svg?height=96&width=128&text=GPT+API",
    duration: "35 min",
    channel: "AI Builders",
    link: "https://youtube.com/watch?v=gpt-api",
    category: "AI",
    dateAdded: "2024-01-13",
    isWatched: false,
  },
]

// Mock Notes
export const mockNotes: Note[] = [
  {
    id: "1",
    title: "React Performance Optimization",
    content:
      "Key strategies for optimizing React applications:\n\n1. Use React.memo for component memoization\n2. Implement useMemo and useCallback hooks\n3. Code splitting with React.lazy\n4. Optimize bundle size with tree shaking\n5. Use React DevTools Profiler",
    tags: ["react", "performance", "optimization"],
    dateCreated: "2024-01-15",
    lastUpdated: "2024-01-15",
    linkedArticles: ["1"],
  },
  {
    id: "2",
    title: "Design System Principles",
    content:
      "Core principles for building scalable design systems:\n\n• Consistency - Maintain visual and functional consistency\n• Accessibility - Ensure components meet WCAG guidelines\n• Flexibility - Allow for customization while maintaining brand\n• Documentation - Provide clear usage guidelines\n• Governance - Establish processes for updates and contributions",
    tags: ["design-system", "ui", "ux"],
    dateCreated: "2024-01-14",
    lastUpdated: "2024-01-14",
    linkedArticles: ["2", "5"],
  },
  {
    id: "3",
    title: "AI Integration Ideas",
    content:
      "Potential AI features for Flipd:\n\n- Smart content categorization\n- Automatic article summarization\n- Personalized content recommendations\n- Intelligent search with semantic understanding\n- Content quality scoring\n- Reading time estimation improvements",
    tags: ["ai", "features", "flipd"],
    dateCreated: "2024-01-13",
    lastUpdated: "2024-01-13",
    linkedArticles: ["3"],
  },
]

// Helper functions
export const getSavedArticles = () => mockArticles.filter((article) => article.isSaved)
export const getReadArticles = () => mockArticles.filter((article) => article.isRead)
export const getUnreadArticles = () => mockArticles.filter((article) => !article.isRead)
export const getArticlesByCategory = (category: string) =>
  mockArticles.filter((article) => article.category === category)

export const getCollectionById = (id: string) => mockCollections.find((collection) => collection.id === id)
export const getArticleById = (id: string) => mockArticles.find((article) => article.id === id)

// Stats
export const getStats = () => ({
  totalArticles: mockArticles.length,
  savedArticles: getSavedArticles().length,
  readArticles: getReadArticles().length,
  totalCollections: mockCollections.length,
  totalPodcasts: mockPodcasts.length,
  totalVideos: mockVideos.length,
  totalNotes: mockNotes.length,
  readingProgress: Math.round((getReadArticles().length / mockArticles.length) * 100),
})
