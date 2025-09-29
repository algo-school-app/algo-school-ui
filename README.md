# AlgoSchool Frontend - Vue 3 Application

A modern Vue 3 single-page application for the AlgoSchool multi-tenant Learning Management System.

## Architecture

### Frontend Technology Stack
- **Vue 3** with Composition API and `<script setup>` syntax
- **Vite** for fast development and optimized builds
- **TailwindCSS** with custom theme system and seasonal themes
- **Supabase** for authentication and realtime data
- **Vitest** with @testing-library/vue for testing
- **TypeScript** support for enhanced development experience

### Multi-Tenant Frontend Design
- Dynamic configuration system based on client/tenant context
- Supabase Auth with row-level security
- Reactive stores with realtime subscriptions
- Theme customization per client with seasonal variations

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm or yarn package manager
- Access to a Supabase project (for authentication and data)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   cd algo-school-ui
   npm install
   ```

2. **Environment configuration:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Start development server:**
   ```bash
   npm run dev
   # App will be available at http://localhost:5173
   ```

### Build and Preview

```bash
# Build for production
npm run build

# Preview production build
npm run preview
# Preview will be available at http://localhost:4173
```

## Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests once
npm run test:coverage    # Run tests with coverage report
npm run test:watch       # Run tests in watch mode

# Linting & Formatting
npm run lint             # Check code style
npm run format           # Auto-format code
```

## Docker Support

The application includes comprehensive Docker support for both development and production:

### Development with Docker
```bash
# Start with hot reload
docker-compose -f docker-compose.dev.yml up -d
# Access at http://localhost:5173
```

### Production with Docker
```bash
# Production build
docker-compose up -d
# Access at http://localhost:3000
```

See [DOCKER.md](./DOCKER.md) for detailed Docker configuration and troubleshooting.

## Project Structure

```
algo-school-ui/
├── src/
│   ├── components/          # Vue components
│   │   ├── locations/       # Physical locations components
│   │   │   ├── BuildingsList.vue
│   │   │   ├── BuildingModal.vue
│   │   │   ├── BuildingDetails.vue
│   │   │   └── RoomModal.vue
│   │   └── ...             # Other components
│   ├── views/              # Page-level components
│   ├── services/           # API and business logic
│   │   ├── locationService.js # Physical locations API client
│   │   └── ...             # Other services
│   ├── stores/             # State management
│   ├── utils/              # Helper utilities
│   ├── assets/             # Static assets
│   └── main.js             # Application entry point
├── public/                 # Public static files
├── tests/                  # Test files
└── docker-compose*.yml     # Docker configurations
```

## Environment Configuration

### Required Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_URL=http://localhost:8001
```

### Optional Variables
```env
# AI Configuration
VITE_AI_PROVIDER=openai
VITE_AI_MODEL=gpt-4o
VITE_AI_MAX_TOKENS=1000
VITE_AI_TEMPERATURE=0.7

# Application Settings
VITE_APP_TITLE=AlgoSchool
VITE_APP_DESCRIPTION=Learning Management System
VITE_DEBUG=true
```

## Key Features

### Authentication & Authorization
- Google OAuth integration through Supabase Auth
- Role-based access control (Super Admin, Tenant Admin, Teacher, etc.)
- Automatic user registration for approved email domains

### Multi-Tenant Support
- Client identification via domain or headers (`algo-client-id`, `algo-tenant-id`)
- Tenant-specific branding and themes
- Isolated data access with Supabase RLS policies

### Physical Locations Management
- Building and room management interface
- Shared infrastructure with multi-tenant booking capabilities
- Real-time capacity and availability tracking
- Permission-based access control for location management
- Simplified amenities/features management using enum arrays
- Fixed "Available" room count calculation (uses is_active field)
- API-level "Active Only" filtering implementation

### Classes & Academic Management
- Hierarchical academic structure: Programs → Courses → Classes
- Dual class menu system:
  - Administrative "Classes" (TeacherAssignments) with explicit permissions
  - Dynamic "My Classes" based on user profile data (no explicit permissions)
- Multi-tenant class assignments and enrollments
- Teacher and student management per class
- Document association with courses and classes

### UI/UX Features
- Responsive design with mobile-first approach
- Seasonal theme variations (autumn, winter, spring, summer)
- Component library following modern Vue 3 patterns
- Accessible design with ARIA support

### Integration Capabilities
- Real-time data synchronization with Supabase
- AI-powered chat interface
- Document processing status tracking
- Vector-based semantic search

## Vue 3 Development Patterns

### Composition API Usage
```javascript
// Always import Vue functions at the top
const { ref, reactive, computed, onMounted, watch } = Vue;

export default {
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      data: []
    });

    const filteredData = computed(() => {
      return state.data.filter(item => item.active);
    });

    onMounted(async () => {
      await loadData();
    });

    return {
      state,
      filteredData
    };
  }
}
```

### Critical Vue Import Pattern
**ALWAYS** check and add Vue imports at the top of component files:
```javascript
const { ref, reactive, computed, onMounted, watch } = Vue;
```

## Testing Strategy

### Unit Testing
- **Framework**: Vitest with @testing-library/vue
- **Patterns**: Component testing, user interaction simulation
- **Mocking**: MSW for API mocking in tests

### Example Test Structure
```javascript
import { render, screen } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent.vue';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(MyComponent, {
      props: { title: 'Test Title' }
    });

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

## Contributing

### Development Guidelines
1. Follow Vue 3 Composition API patterns
2. Use TypeScript for enhanced type safety
3. Maintain responsive design principles
4. Write tests for new components and features
5. Follow existing naming conventions and file structure

### Code Style
- Use Prettier for formatting
- Follow Vue official style guide
- Use semantic commit messages
- Add JSDoc comments for complex functions

## Integration with Backend

### API Communication
- RESTful endpoints with `/api/v1/` prefix
- Authentication via Bearer tokens
- Multi-tenant context headers
- Error handling with user-friendly messages

### Real-time Features
- Supabase realtime subscriptions
- Live document processing status
- Chat message streaming
- Collaborative features support

## Performance Considerations

### Development
- Vite's fast HMR (Hot Module Replacement)
- Lazy loading for route components
- Optimized bundle splitting

### Production
- Tree-shaking for minimal bundle size
- Asset optimization and compression
- Service worker for offline support
- CDN-ready static assets

## Deployment

The application is designed for flexible deployment:

- **Development**: Local development server
- **Staging**: Docker containers with development features
- **Production**: Optimized Docker builds with static serving

For detailed deployment instructions, see the main project [CLAUDE.md](../CLAUDE.md) file.

## Learn More

- [Vue 3 Documentation](https://vuejs.org/guide/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Vue 3 Script Setup](https://vuejs.org/api/sfc-script-setup.html)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Vitest Testing Framework](https://vitest.dev/)
- [Supabase Vue Guide](https://supabase.com/docs/guides/getting-started/quickstarts/vue)
