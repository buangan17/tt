# ForexBot Pro - Platform Trading Bot Forex Terdepan

Platform trading bot forex terdepan di Indonesia dengan fitur backtest, live trading, dan analisis real-time.

## 🚀 Fitur Utama

### 👥 User Dashboard
- **Overview Dashboard** - Statistik trading real-time
- **Trading Bots** - Manajemen bot trading otomatis
- **Trade History** - Riwayat lengkap trading
- **Analytics** - Analisis performa mendalam
- **Settings** - Konfigurasi akun dan preferensi

### 🔧 Admin Dashboard
- **User Management** - Kelola user dan role
- **Blog Management** - Buat dan edit artikel blog
- **Trading Settings** - Konfigurasi pairs dan strategies
- **System Settings** - Pengaturan sistem

### 📝 Blog System
- **Like & Comment** - Interaksi user dengan artikel
- **Share** - Bagikan artikel ke social media
- **Bookmark** - Simpan artikel favorit
- **Categories** - Filter artikel berdasarkan kategori
- **Search** - Cari artikel berdasarkan keyword

## 🛠️ Teknologi

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Supabase account
- Clerk account

## 🚀 Setup Instruksi

### 1. Clone Repository
```bash
git clone <repository-url>
cd forexbot-pro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Buat file `.env.local` di root directory:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Setup Clerk
1. Daftar di [Clerk](https://clerk.com)
2. Buat aplikasi baru
3. Copy publishable key dan secret key ke `.env.local`
4. Konfigurasi OAuth providers (Google, GitHub, dll)

### 5. Setup Supabase
1. Daftar di [Supabase](https://supabase.com)
2. Buat project baru
3. Copy URL dan keys ke `.env.local`
4. Jalankan SQL schema dari `database/schema.sql`

### 6. Database Schema
Jalankan SQL berikut di Supabase SQL Editor:

```sql
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
  symbol TEXT UNIQUE NOT NULL,
  base_currency TEXT NOT NULL,
  quote_currency TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  min_lot_size DECIMAL(10,5) DEFAULT 0.01,
  max_lot_size DECIMAL(10,2) DEFAULT 100.00,
  pip_size DECIMAL(10,8) DEFAULT 0.0001,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog categories
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category_id UUID REFERENCES blog_categories(id),
  author_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog comments
CREATE TABLE blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  parent_id UUID REFERENCES blog_comments(id),
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample data
INSERT INTO blog_categories (name, slug, description) VALUES
('Strategi Trading', 'strategi-trading', 'Artikel tentang strategi trading forex'),
('Technical Analysis', 'technical-analysis', 'Analisis teknikal dan indikator'),
('Risk Management', 'risk-management', 'Manajemen risiko trading'),
('Psychology', 'psychology', 'Psikologi trading dan mindset'),
('Market News', 'market-news', 'Berita dan analisis market'),
('Tutorial', 'tutorial', 'Panduan dan tutorial trading');

INSERT INTO trading_pairs (symbol, base_currency, quote_currency) VALUES
('EUR/USD', 'EUR', 'USD'),
('GBP/USD', 'GBP', 'USD'),
('USD/JPY', 'USD', 'JPY'),
('USD/CHF', 'USD', 'CHF'),
('AUD/USD', 'AUD', 'USD'),
('USD/CAD', 'USD', 'CAD');
```

### 7. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
forexbot-pro/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── blog/              # Blog pages
│   ├── dashboard/         # User dashboard pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── lib/                   # Utility libraries
│   └── supabase.js       # Supabase client
├── database/              # Database schema
│   └── schema.sql        # SQL schema
├── public/               # Static assets
└── middleware.js         # Route protection
```

## 🔐 Role & Permissions

### User Roles
- **user** - Akses terbatas, fitur dasar
- **premium** - Akses penuh, fitur advanced
- **admin** - Akses admin panel, full control

### Route Protection
- `/dashboard/*` - Requires authentication
- `/admin/*` - Requires admin role
- `/blog/*` - Public access with user features

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces

### Design System
- Consistent color palette
- Typography scale
- Component library
- Dark mode support (planned)

### Accessibility
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

## 📊 Analytics & Monitoring

### User Analytics
- Page views tracking
- User engagement metrics
- Conversion tracking
- Performance monitoring

### Trading Analytics
- Profit/Loss tracking
- Win rate analysis
- Risk metrics
- Portfolio performance

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Type check (if using TypeScript)
npm run type-check

# Format code
npm run format
```

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically

### Manual Deployment
```bash
# Build project
npm run build

# Start production server
npm start
```

## 📈 Performance

### Optimization
- Image optimization
- Code splitting
- Lazy loading
- Caching strategies
- CDN integration

### Monitoring
- Real-time performance metrics
- Error tracking
- User experience monitoring
- Server health checks

## 🔒 Security

### Authentication
- JWT tokens
- Session management
- Role-based access control
- Multi-factor authentication

### Data Protection
- HTTPS encryption
- SQL injection prevention
- XSS protection
- CSRF protection

## 📞 Support

### Documentation
- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Database Schema](./docs/database.md)

### Contact
- Email: support@forexbotpro.com
- Discord: [Join our community](https://discord.gg/forexbotpro)
- GitHub: [Report issues](https://github.com/forexbotpro/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication
- [Supabase](https://supabase.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Recharts](https://recharts.org/) - Charts
- [Lucide](https://lucide.dev/) - Icons

---

**ForexBot Pro** - Trading Bot Forex Terdepan di Indonesia 🇮🇩
