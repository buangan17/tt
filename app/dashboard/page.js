'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  BarChart3,
  Zap,
  Clock,
  Target,
  Award,
  AlertCircle,
  Settings,
  User,
  Bell,
  Search,
  Filter,
  Calendar,
  Eye,
  EyeOff,
  RefreshCw,
  Play,
  Pause,
  Stop,
  Plus,
  Edit,
  Trash2,
  Star,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle,
  Info
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { supabase } from '@/lib/supabase'

// Mock data - in real app this would come from API
const equityData = [
  { date: '2024-01-01', balance: 10000 },
  { date: '2024-01-02', balance: 10150 },
  { date: '2024-01-03', balance: 10080 },
  { date: '2024-01-04', balance: 10320 },
  { date: '2024-01-05', balance: 10290 },
  { date: '2024-01-06', balance: 10450 },
  { date: '2024-01-07', balance: 10380 },
  { date: '2024-01-08', balance: 10520 },
  { date: '2024-01-09', balance: 10680 },
  { date: '2024-01-10', balance: 10750 }
]

const strategyPerformance = [
  { name: 'RSI Extremes', value: 35, color: '#3B82F6' },
  { name: 'Heikin-Ashi Pullback', value: 25, color: '#10B981' },
  { name: 'Stochastic Signal', value: 20, color: '#F59E0B' },
  { name: 'Bollinger RSI ADX', value: 20, color: '#EF4444' }
]

const recentTrades = [
  {
    id: 1,
    pair: 'EUR/USD',
    type: 'BUY',
    entry: 1.0845,
    exit: 1.0867,
    pips: 22,
    profit: 220,
    time: '10:30',
    strategy: 'RSI Extremes',
    status: 'closed'
  },
  {
    id: 2,
    pair: 'GBP/USD',
    type: 'SELL',
    entry: 1.2634,
    exit: 1.2615,
    pips: 19,
    profit: 190,
    time: '09:45',
    strategy: 'Bollinger RSI ADX',
    status: 'closed'
  },
  {
    id: 3,
    pair: 'USD/JPY',
    type: 'BUY',
    entry: 149.85,
    exit: 149.62,
    pips: -23,
    profit: -230,
    time: '08:20',
    strategy: 'Stochastic Signal',
    status: 'closed'
  },
  {
    id: 4,
    pair: 'EUR/GBP',
    type: 'SELL',
    entry: 0.8580,
    exit: null,
    pips: null,
    profit: null,
    time: '14:15',
    strategy: 'RSI Extremes',
    status: 'open'
  }
]

const activeBots = [
  {
    id: 1,
    name: 'RSI Scalper Pro',
    pair: 'EUR/USD',
    status: 'running',
    profit: 450,
    trades: 12,
    winRate: 75
  },
  {
    id: 2,
    name: 'Bollinger Breakout',
    pair: 'GBP/USD',
    status: 'paused',
    profit: -120,
    trades: 8,
    winRate: 62
  },
  {
    id: 3,
    name: 'Stochastic Master',
    pair: 'USD/JPY',
    status: 'stopped',
    profit: 0,
    trades: 0,
    winRate: 0
  }
]

const notifications = [
  {
    id: 1,
    type: 'success',
    message: 'Trade closed: EUR/USD +22 pips',
    time: '2 minutes ago'
  },
  {
    id: 2,
    type: 'warning',
    message: 'Bot "RSI Scalper Pro" reached daily limit',
    time: '15 minutes ago'
  },
  {
    id: 3,
    type: 'info',
    message: 'New strategy "MACD Crossover" available',
    time: '1 hour ago'
  }
]

function StatCard({ title, value, change, changePercent, icon: Icon, trend, loading = false }) {
  const isPositive = change >= 0

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change} ({isPositive ? '+' : ''}{changePercent}%)
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
          <Icon className={`h-6 w-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>
    </div>
  )
}

function TradeRow({ trade }) {
  const isPositive = trade.pips > 0
  const isOpen = trade.status === 'open'

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-500' : isOpen ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{trade.pair}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              trade.type === 'BUY' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {trade.type}
            </span>
            {isOpen && (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                OPEN
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {trade.strategy} • {trade.time}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-medium text-gray-900">
          {trade.entry} {trade.exit && `→ ${trade.exit}`}
        </div>
        <div className={`text-sm font-medium ${
          isPositive ? 'text-green-600' : isOpen ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {trade.pips ? `${trade.pips > 0 ? '+' : ''}${trade.pips} pips` : 'Open'}
        </div>
        {trade.profit !== null && (
          <div className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            ${trade.profit}
          </div>
        )}
      </div>
    </div>
  )
}

function BotCard({ bot }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'stopped': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4" />
      case 'paused': return <Pause className="w-4 h-4" />
      case 'stopped': return <Stop className="w-4 h-4" />
      default: return <Stop className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{bot.name}</h3>
          <p className="text-sm text-gray-500">{bot.pair}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bot.status)}`}>
            {getStatusIcon(bot.status)}
            <span className="ml-1">{bot.status}</span>
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Profit</p>
          <p className={`text-sm font-semibold ${bot.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${bot.profit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Trades</p>
          <p className="text-sm font-semibold text-gray-900">{bot.trades}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Win Rate</p>
          <p className="text-sm font-semibold text-gray-900">{bot.winRate}%</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          {bot.status === 'running' ? 'Pause' : bot.status === 'paused' ? 'Resume' : 'Start'}
        </button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function NotificationItem({ notification }) {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'info': return <Info className="w-4 h-4 text-blue-500" />
      default: return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      {getIcon(notification.type)}
      <div className="flex-1">
        <p className="text-sm text-gray-900">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (isLoaded && user) {
      loadUserData()
    }
  }, [isLoaded, user])

  const loadUserData = async () => {
    try {
      setLoading(true)
      // Load user data from Supabase
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', user.id)
        .single()
      
      setUserData(data)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">ForexBot Pro</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{userData?.subscription_status || 'Free'} Plan</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {user?.firstName?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'bots', name: 'Trading Bots', icon: Zap },
              { id: 'trades', name: 'Trade History', icon: Activity },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Account Balance"
                value="$10,750"
                change="750"
                changePercent="7.5"
                icon={DollarSign}
                trend="up"
              />
              <StatCard
                title="Total Profit"
                value="$2,450"
                change="180"
                changePercent="7.9"
                icon={TrendingUp}
                trend="up"
              />
              <StatCard
                title="Win Rate"
                value="68.5%"
                change="2.3"
                changePercent="3.5"
                icon={Target}
                trend="up"
              />
              <StatCard
                title="Active Bots"
                value="2"
                change="0"
                changePercent="0"
                icon={Zap}
                trend="neutral"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Equity Curve */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Equity Curve</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>7D</option>
                      <option>30D</option>
                      <option>90D</option>
                    </select>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={equityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="balance" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Strategy Performance */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategy Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={strategyPerformance}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {strategyPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Trades</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {recentTrades.map((trade) => (
                  <TradeRow key={trade.id} trade={trade} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trading Bots Tab */}
        {activeTab === 'bots' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Trading Bots</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Bot</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBots.map((bot) => (
                <BotCard key={bot.id} bot={bot} />
              ))}
            </div>
          </div>
        )}

        {/* Trade History Tab */}
        {activeTab === 'trades' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Trade History</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <select className="text-sm border border-gray-300 rounded px-3 py-1">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Filter className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentTrades.map((trade) => (
                  <TradeRow key={trade.id} trade={trade} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={equityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Win/Loss Distribution */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Win/Loss Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Wins', value: 68, color: '#10B981' },
                    { name: 'Losses', value: 32, color: '#EF4444' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Profile Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.firstName}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.lastName}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Trading Preferences</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Lot Size
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Percentage
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue="2"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}