# Composition

**Deconstruct Anything** - AI-powered composition analysis with interactive 3D visualization.

Enter any product, substance, or entity to see what it's really made of - from ingredients to elements.

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **3D Engine**: Three.js via React Three Fiber
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand + TanStack Query
- **Backend**: Next.js API Routes
- **AI Research**: Claude API
- **Database**: PostgreSQL with Prisma
- **Cache**: Redis (Upstash)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- Redis instance (optional, for caching)

### Environment Variables

Create a `.env.local` file with:

```env
# AI Services
ANTHROPIC_API_KEY=your_anthropic_key

# Database
DATABASE_URL=postgresql://...

# Cache (optional)
REDIS_URL=redis://... or https://... for Upstash
```

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Push database schema
pnpm prisma db push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── composition/       # Composition views
│   └── s/                 # Share links
├── components/
│   ├── search/            # Search UI
│   ├── viewer/            # 3D viewer
│   ├── ui/                # Shared components
│   └── providers/         # React context providers
├── lib/
│   ├── agents/            # AI research agents
│   └── db/                # Database utilities
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

## Features

- **Search**: Enter any product, substance, or entity
- **AI Research**: Multi-step AI analysis to find composition
- **3D Visualization**: Interactive exploded view of composition layers
- **Depth Control**: Drill down from product -> components -> materials -> elements
- **Share**: Generate shareable links to compositions

## Development

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Database studio
pnpm prisma studio
```

## Deployment

The project is configured for Vercel deployment. Push to main branch to trigger automatic deployment.

## Known Issues

- Production build may show errors related to static page generation for error pages (404/500). This is a known Next.js issue with Three.js and doesn't affect the deployed application functionality.

## License

MIT
