import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch comments for a post
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const parentId = searchParams.get('parentId') || null

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('blog_comments')
      .select(`
        *,
        users(full_name, email)
      `)
      .eq('post_id', postId)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true })

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ comments: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new comment
export async function POST(request) {
  try {
    const body = await request.json()
    const { postId, content, parentId = null, userId } = body

    // Validate required fields
    if (!postId || !content || !userId) {
      return NextResponse.json(
        { error: 'Post ID, content, and user ID are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .insert([{
        post_id: postId,
        content,
        parent_id: parentId,
        user_id: userId
      }])
      .select(`
        *,
        users(full_name, email)
      `)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ comment: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}