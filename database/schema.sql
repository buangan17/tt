-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'premium', 'admin')),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'enterprise')),
  subscription_expires_at TIMESTAMPTZ,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trading pairs table
CREATE TABLE trading_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT UNIQUE NOT NULL, -- e.g., 'EUR/USD', 'GBP/USD'
  base_currency TEXT NOT NULL,
  quote_currency TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  min_lot_size DECIMAL(10,5) DEFAULT 0.01,
  max_lot_size DECIMAL(10,2) DEFAULT 100.00,
  pip_size DECIMAL(10,8) DEFAULT 0.0001,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trading strategies table
CREATE TABLE trading_strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  strategy_type TEXT NOT NULL CHECK (strategy_type IN ('scalping', 'day_trading', 'swing', 'position')),
  parameters JSONB NOT NULL DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  win_rate DECIMAL(5,2),
  profit_factor DECIMAL(8,2),
  max_drawdown DECIMAL(5,2),
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backtest sessions table
CREATE TABLE backtest_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  strategy_id UUID REFERENCES trading_strategies(id) NOT NULL,
  trading_pair_id UUID REFERENCES trading_pairs(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  initial_balance DECIMAL(15,2) NOT NULL DEFAULT 10000.00,
  final_balance DECIMAL(15,2),
  total_trades INTEGER DEFAULT 0,
  winning_trades INTEGER DEFAULT 0,
  losing_trades INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2),
  profit_loss DECIMAL(15,2),
  profit_factor DECIMAL(8,2),
  max_drawdown DECIMAL(5,2),
  sharpe_ratio DECIMAL(8,4),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual trades from backtests
CREATE TABLE backtest_trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  backtest_session_id UUID REFERENCES backtest_sessions(id) NOT NULL,
  trade_number INTEGER NOT NULL,
  entry_time TIMESTAMPTZ NOT NULL,
  exit_time TIMESTAMPTZ,
  trade_type TEXT NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  entry_price DECIMAL(12,6) NOT NULL,
  exit_price DECIMAL(12,6),
  lot_size DECIMAL(10,5) NOT NULL,
  stop_loss DECIMAL(12,6),
  take_profit DECIMAL(12,6),
  profit_loss DECIMAL(15,2),
  pips DECIMAL(8,2),
  commission DECIMAL(10,2) DEFAULT 0,
  swap DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  exit_reason TEXT, -- 'take_profit', 'stop_loss', 'manual', 'strategy_signal'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live trading sessions (for future implementation)
CREATE TABLE live_trading_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  strategy_id UUID REFERENCES trading_strategies(id) NOT NULL,
  trading_pair_id UUID REFERENCES trading_pairs(id) NOT NULL,
  name TEXT NOT NULL,
  broker_account TEXT,
  initial_balance DECIMAL(15,2) NOT NULL,
  current_balance DECIMAL(15,2),
  is_active BOOLEAN DEFAULT false,
  risk_per_trade DECIMAL(5,2) DEFAULT 2.00, -- percentage
  max_daily_loss DECIMAL(5,2) DEFAULT 5.00, -- percentage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market data cache (for Polygon API data)
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trading_pair_id UUID REFERENCES trading_pairs(id) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  timeframe TEXT NOT NULL, -- '1m', '5m', '15m', '1h', '4h', '1d'
  open_price DECIMAL(12,6) NOT NULL,
  high_price DECIMAL(12,6) NOT NULL,
  low_price DECIMAL(12,6) NOT NULL,
  close_price DECIMAL(12,6) NOT NULL,
  volume BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trading_pair_id, timestamp, timeframe)
);

-- User activity logs
CREATE TABLE user_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  features JSONB NOT NULL DEFAULT '{}',
  max_backtests INTEGER,
  max_strategies INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_backtest_sessions_user_id ON backtest_sessions(user_id);
CREATE INDEX idx_backtest_trades_session_id ON backtest_trades(backtest_session_id);
CREATE INDEX idx_market_data_pair_timestamp ON market_data(trading_pair_id, timestamp);
CREATE INDEX idx_market_data_timeframe ON market_data(timeframe);
CREATE INDEX idx_user_activity_user_id ON user_activity_logs(user_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE backtest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE backtest_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_trading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view own backtest sessions" ON backtest_sessions FOR SELECT USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'));
CREATE POLICY "Users can create own backtest sessions" ON backtest_sessions FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'));
CREATE POLICY "Users can update own backtest sessions" ON backtest_sessions FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- Insert default trading pairs
INSERT INTO trading_pairs (symbol, base_currency, quote_currency) VALUES
('EUR/USD', 'EUR', 'USD'),
('GBP/USD', 'GBP', 'USD'),
('USD/JPY', 'USD', 'JPY'),
('USD/CHF', 'USD', 'CHF'),
('AUD/USD', 'AUD', 'USD'),
('USD/CAD', 'USD', 'CAD'),
('NZD/USD', 'NZD', 'USD'),
('EUR/GBP', 'EUR', 'GBP'),
('EUR/JPY', 'EUR', 'JPY'),
('GBP/JPY', 'GBP', 'JPY');

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, billing_cycle, features, max_backtests, max_strategies) VALUES
('Free', 'Plan gratis dengan fitur terbatas', 0.00, 'monthly', '{"basic_backtests": true, "basic_strategies": 3}', 10, 3),
('Premium', 'Plan premium dengan fitur lengkap', 29.99, 'monthly', '{"unlimited_backtests": true, "advanced_strategies": true, "real_time_data": true, "premium_support": true}', -1, -1),
('Enterprise', 'Plan enterprise untuk trader profesional', 99.99, 'monthly', '{"everything": true, "priority_support": true, "custom_strategies": true, "api_access": true}', -1, -1);