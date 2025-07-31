import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch all blog posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'latest'
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name),
        users(full_name, email)
      `)
      .eq('status', 'published')

    // Apply filters
    if (category && category !== 'All') {
      query = query.eq('category_id', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    // Apply sorting
    switch (sortBy) {
      case 'latest':
        query = query.order('published_at', { ascending: false })
        break
      case 'popular':
        query = query.order('views', { ascending: false })
        break
      case 'trending':
        query = query.order('likes', { ascending: false })
        break
      default:
        query = query.order('published_at', { ascending: false })
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      posts: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new blog post
export async function POST(request) {
  try {
    const body = await request.json()
    const { title, content, excerpt, category_id, status = 'draft', author_id } = body

    // Validate required fields
    if (!title || !content || !author_id) {
      return NextResponse.json(
        { error: 'Title, content, and author_id are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title,
        content,
        excerpt,
        category_id,
        status,
        author_id,
        published_at: status === 'published' ? new Date().toISOString() : null
      }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}