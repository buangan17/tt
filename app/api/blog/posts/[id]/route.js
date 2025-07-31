import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch single blog post
export async function GET(request, { params }) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name),
        users(full_name, email),
        blog_comments(
          *,
          users(full_name, email)
        )
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Increment view count
    await supabase
      .from('blog_posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id)

    return NextResponse.json({ post: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update blog post
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, content, excerpt, category_id, status } = body

    const updateData = {
      title,
      content,
      excerpt,
      category_id,
      status,
      updated_at: new Date().toISOString()
    }

    // If status is being changed to published, set published_at
    if (status === 'published') {
      updateData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete blog post
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}