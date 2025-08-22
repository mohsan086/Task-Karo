# Task-Karo - Modern Task Management Application

A comprehensive, production-ready task management application built with Next.js, Supabase, and modern web technologies.

## Features

- **User Authentication**: Secure email/password authentication with Supabase
- **Task Management**: Create, edit, delete, and organize tasks with priorities and due dates
- **Real-time Updates**: Optimistic updates and real-time synchronization
- **Advanced Filtering**: Search, filter, and sort tasks by multiple criteria
- **Admin Dashboard**: Complete user management and system analytics
- **Responsive Design**: Mobile-first design that works on all devices
- **Role-based Access**: User and admin roles with appropriate permissions
- **Production Ready**: Docker support, error handling, and performance optimizations

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts
- **Deployment**: Docker, Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd task-karo
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your Supabase credentials:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

4. Run the database migrations:
- Execute the SQL scripts in the `scripts/` folder in your Supabase SQL editor
- Or use the v0 interface to run them automatically

5. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- `profiles`: User profiles with role-based access
- `tasks`: Task management with status, priority, and assignments
- `task_comments`: Collaborative comments on tasks

All tables use Row Level Security (RLS) for data protection.

## Deployment

### Docker Deployment

1. Build the Docker image:
\`\`\`bash
docker build -t task-karo .
\`\`\`

2. Run with Docker Compose:
\`\`\`bash
docker-compose up -d
\`\`\`

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Required environment variables for production:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
\`\`\`

## Features Overview

### User Management
- Secure authentication with email verification
- Role-based access control (User/Admin)
- Profile management

### Task Management
- Create, edit, and delete tasks
- Set priorities (Low, Medium, High, Urgent)
- Due date tracking with overdue notifications
- Status management (To Do, In Progress, Completed)

### Advanced Features
- Real-time search and filtering
- Sorting by multiple criteria
- Task statistics and analytics
- Admin dashboard with user management
- System health monitoring

### Security
- Row Level Security (RLS) on all tables
- Secure API routes
- Input validation and sanitization
- CSRF protection
- Security headers

## API Routes

- `GET /api/health` - Health check endpoint
- Authentication handled by Supabase Auth

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
