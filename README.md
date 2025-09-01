# Remi

**Flexible Reminders for Real Life**

Remi is a task management application that addresses the limitations of traditional todo apps by focusing on recurring tasks with irregular schedules. Unlike standard todo apps that require rigid scheduling patterns, Remi allows users to input natural language descriptions of when tasks should occur and uses AI to provide intelligent weekly recommendations.

## 🎯 Purpose

Many important recurring tasks don't follow strict schedules:
- Medical appointments (dentist, doctor checkups)
- Administrative tasks (renewing licenses, paying quarterly taxes)
- Personal connections (calling family members, catching up with friends)
- Home maintenance (changing filters, servicing appliances)

These tasks are important but often fall through the cracks in traditional task management systems. Remi serves as a gentle reminder system rather than a rigid scheduler, helping users maintain awareness of important but irregular tasks.

## ✨ Key Features

- **Natural Language Task Timing**: Describe when tasks should happen in plain text ("Every 6 months", "Roughly once a quarter", "2-3 times per year")
- **Last Occurrence Tracking**: Records when tasks were last completed to inform future scheduling
- **AI-Powered Scheduling**: An LLM interprets task descriptions and last completion dates to generate weekly recommendations
- **Simple Weekly View**: Provides a straightforward list of suggested tasks for the current week
- **Minimal Task Structure**: Focus on simplicity with just title, timing description, and last completion date

## 🛠 Tech Stack

### Backend
- **Laravel 12** - PHP framework with Eloquent ORM, routing, and queue management
- **PostgreSQL** - Relational database with excellent JSON support for LLM responses
- **Laravel Sanctum** - API authentication
- **Laravel Queues** - Background processing for AI tasks

### Frontend
- **Inertia.js v2** - Enables SPA experience with server-side routing
- **React 19** - Frontend component library with hooks
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - UI component library based on Radix UI
- **TypeScript** - Type safety and better developer experience

### Development Tools
- **Pest** - PHP testing framework
- **Laravel Pint** - Code formatting
- **Biome** - JavaScript/TypeScript linting and formatting
- **Vite** - Frontend build tool

## 🚀 Local Setup

### Prerequisites

- PHP 8.4+
- Composer
- Node.js 18+
- pnpm
- PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd remi
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies**
   ```bash
   pnpm install
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   
   Create a PostgreSQL database and update your `.env` file:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=remi
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Run database migrations**
   ```bash
   php artisan migrate
   ```

7. **Seed the database (optional)**
   ```bash
   php artisan db:seed
   ```

### Development

#### Option 1: Using the built-in dev script (recommended)
```bash
composer run dev
```
This will start all services concurrently:
- Laravel development server
- Queue worker
- Log monitoring (Pail)
- Vite development server

#### Option 2: Manual setup
Start each service in separate terminals:

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Queue worker
php artisan queue:work

# Terminal 3: Frontend development server
pnpm dev

# Terminal 4: Log monitoring (optional)
php artisan pail
```

The application will be available at `https://remi.test` (if using Laravel Herd) or `http://localhost:8000`.

### Frontend Development

- **Development**: `pnpm dev` - Start Vite development server with hot reload
- **Build**: `pnpm build` - Build for production
- **Build with SSR**: `pnpm build:ssr` - Build with server-side rendering
- **Linting**: `pnpm lint` - Run Biome linter
- **Type checking**: `pnpm types` - Run TypeScript type checking

### Testing

Run the test suite:
```bash
php artisan test
```

Run specific tests:
```bash
php artisan test --filter=TestName
php artisan test tests/Feature/ExampleTest.php
```

### Code Formatting

Format PHP code:
```bash
vendor/bin/pint
```

Format JavaScript/TypeScript:
```bash
pnpm format:fix
pnpm lint:fix
```

## 🗄 Database

The application uses PostgreSQL as the primary database. Key tables include:

- `users` - User accounts and authentication
- `tasks` - User-defined tasks with natural language timing
- `categories` - Task categorization
- `recommended_tasks` - AI-generated weekly recommendations
- `task_histories` - Completion tracking
- `birthdays` - Special recurring reminders
- `notification_preferences` - User notification settings

## 🔧 Configuration

Key configuration files:
- `config/database.php` - Database connections
- `config/queue.php` - Background job processing
- `config/inertia.php` - Inertia.js settings
- `config/services.php` - Third-party service configurations

## 📧 Email & Notifications

The application includes:
- Welcome emails for new users
- Weekly recommendation notifications
- Task reminder notifications
- MJML email templates for responsive design

## 🧪 Testing

The project uses Pest for testing with comprehensive coverage:
- Feature tests for HTTP endpoints
- Unit tests for services and helpers
- Authentication and authorization tests
- Database interaction tests

Test user credentials (seeded):
- Email: `jason@useremi.app`
- Password: `password`

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `php artisan test`
5. Format code: `vendor/bin/pint` and `pnpm lint:fix`
6. Submit a pull request

## 🎯 Target Audience

- Busy professionals managing both work and personal responsibilities
- Anyone who struggles with remembering irregular but important tasks
- Users who prefer natural language over rigid scheduling systems
