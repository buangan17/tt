'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  Clock, 
  User,
  Search,
  Filter,
  Calendar,
  Tag,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Send,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  Star,
  X
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: 'Strategi RSI Extremes: Cara Trading Forex yang Efektif',
    excerpt: 'Pelajari cara menggunakan RSI Extremes untuk trading forex yang lebih menguntungkan. Strategi ini telah terbukti memberikan hasil yang konsisten.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    author: {
      name: 'Ahmad Rahman',
      avatar: '/avatars/ahmad.jpg',
      role: 'Senior Trader'
    },
    category: 'Strategi Trading',
    tags: ['RSI', 'Forex', 'Technical Analysis'],
    publishedAt: '2024-01-15T10:30:00Z',
    readTime: '5 min read',
    views: 1247,
    likes: 89,
    comments: 23,
    shares: 12,
    featured: true,
    image: '/blog/rsi-strategy.jpg'
  },
  {
    id: 2,
    title: 'Panduan Lengkap Bollinger Bands untuk Scalping',
    excerpt: 'Bollinger Bands adalah indikator teknikal yang sangat efektif untuk strategi scalping. Pelajari cara menggunakannya dengan benar.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      role: 'Technical Analyst'
    },
    category: 'Technical Analysis',
    tags: ['Bollinger Bands', 'Scalping', 'Indicators'],
    publishedAt: '2024-01-14T14:20:00Z',
    readTime: '8 min read',
    views: 892,
    likes: 67,
    comments: 18,
    shares: 8,
    featured: false,
    image: '/blog/bollinger-bands.jpg'
  },
  {
    id: 3,
    title: 'Risk Management: Kunci Sukses Trading Forex',
    excerpt: 'Tanpa risk management yang baik, trading forex akan berisiko tinggi. Pelajari prinsip-prinsip dasar risk management.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: {
      name: 'Michael Chen',
      avatar: '/avatars/michael.jpg',
      role: 'Risk Manager'
    },
    category: 'Risk Management',
    tags: ['Risk Management', 'Psychology', 'Money Management'],
    publishedAt: '2024-01-13T09:15:00Z',
    readTime: '6 min read',
    views: 1563,
    likes: 124,
    comments: 31,
    shares: 19,
    featured: true,
    image: '/blog/risk-management.jpg'
  }
]

const categories = [
  'All',
  'Strategi Trading',
  'Technical Analysis',
  'Risk Management',
  'Psychology',
  'Market News',
  'Tutorial'
]

const comments = [
  {
    id: 1,
    author: 'John Doe',
    avatar: '/avatars/john.jpg',
    content: 'Artikel yang sangat informatif! Saya sudah mencoba strategi RSI ini dan hasilnya cukup bagus.',
    createdAt: '2024-01-15T11:30:00Z',
    likes: 5,
    replies: [
      {
        id: 2,
        author: 'Ahmad Rahman',
        avatar: '/avatars/ahmad.jpg',
        content: 'Terima kasih! Senang bisa membantu. Ada pertanyaan lain?',
        createdAt: '2024-01-15T12:00:00Z',
        likes: 3
      }
    ]
  },
  {
    id: 3,
    author: 'Jane Smith',
    avatar: '/avatars/jane.jpg',
    content: 'Bagaimana dengan timeframe yang direkomendasikan untuk strategi ini?',
    createdAt: '2024-01-15T13:45:00Z',
    likes: 2,
    replies: []
  }
]

function BlogCard({ post, onLike, onComment, onShare, onBookmark }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike(post.id, !isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark(post.id, !isBookmarked)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Featured
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmark
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              <p className="text-xs text-gray-500">{post.author.role}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{formatDate(post.publishedAt)}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="w-4 h-4" />
              <span>{post.shares}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
            </button>
            
            <button
              onClick={() => onComment(post.id)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Comment</span>
            </button>
            
            <button
              onClick={() => onShare(post.id)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
          
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  )
}

function CommentItem({ comment, onReply, onLike }) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText)
      setReplyText('')
      setShowReply(false)
    }
  }

  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <div className="flex space-x-3">
        <img
          src={comment.avatar}
          alt={comment.author}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-900">{comment.author}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600"
            >
              <ThumbsUp className="w-3 h-3" />
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600"
            >
              <Reply className="w-3 h-3" />
              <span>Reply</span>
            </button>
          </div>
          
          {showReply && (
            <div className="mt-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleReply}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-3 ml-6 space-y-3">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex space-x-3">
                  <img
                    src={reply.avatar}
                    alt={reply.author}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{reply.author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Blog() {
  const { user } = useUser()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [showComments, setShowComments] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [commentText, setCommentText] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleLike = (postId, isLiked) => {
    // Handle like logic
    console.log(`Post ${postId} ${isLiked ? 'liked' : 'unliked'}`)
  }

  const handleComment = (postId) => {
    setSelectedPost(blogPosts.find(p => p.id === postId))
    setShowComments(true)
  }

  const handleShare = (postId) => {
    // Handle share logic
    console.log(`Sharing post ${postId}`)
  }

  const handleBookmark = (postId, isBookmarked) => {
    // Handle bookmark logic
    console.log(`Post ${postId} ${isBookmarked ? 'bookmarked' : 'unbookmarked'}`)
  }

  const handleAddComment = () => {
    if (commentText.trim() && selectedPost) {
      // Add comment logic
      console.log(`Adding comment to post ${selectedPost.id}: ${commentText}`)
      setCommentText('')
    }
  }

  const handleReply = (commentId, replyText) => {
    // Handle reply logic
    console.log(`Replying to comment ${commentId}: ${replyText}`)
  }

  const handleLikeComment = (commentId) => {
    // Handle comment like logic
    console.log(`Liking comment ${commentId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bookmark className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Blog</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onBookmark={handleBookmark}
            />
          ))}
        </div>

        {/* Comments Modal */}
        {showComments && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Comments ({comments.length})
                  </h3>
                  <button
                    onClick={() => setShowComments(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Add Comment */}
                {user && (
                  <div className="mb-6">
                    <div className="flex space-x-3">
                      <img
                        src={user.imageUrl}
                        alt={user.firstName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a comment..."
                          rows={3}
                          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleAddComment}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onReply={handleReply}
                      onLike={handleLikeComment}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}