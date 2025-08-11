# 🐳 Docker Setup for AlgoSchool UI

## 📁 Available Docker Compose Files

### 1. **docker-compose.yml** (Default/Production)
```bash
docker-compose up -d
```
- **Port**: 3000 → 4173 (production build)
- **Environment**: Production optimized
- **Hot Reload**: No
- **Use Case**: Production deployment, testing production builds

### 2. **docker-compose.dev.yml** (Development) 
```bash
docker-compose -f docker-compose.dev.yml up -d
```
- **Port**: 5173 → 5173 (Vite dev server)
- **Environment**: Development with hot reload
- **Hot Reload**: Yes
- **Use Case**: Active development with live code changes

### 3. **docker-compose.prod.yml** (Production Explicit)
```bash
docker-compose -f docker-compose.prod.yml up -d
```
- **Port**: 3000 → 4173 (production build)
- **Environment**: Explicit production configuration
- **Use Case**: Production deployment with explicit settings

## 🚀 Quick Start

### Prerequisites
1. **Docker** and **Docker Compose** installed
2. **Environment file** configured (copy from `.env.example`)

### Setup Steps

1. **Clone and navigate to UI directory**:
```bash
cd algo-school-ui
```

2. **Create environment file**:
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Choose your deployment method**:

#### For Development (with hot reload):
```bash
docker-compose -f docker-compose.dev.yml up -d
```
Access at: http://localhost:5173

#### For Production:
```bash
docker-compose up -d
```
Access at: http://localhost:3000

## 🛠️ Available Commands

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs  
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild and start (after dependency changes)
docker-compose -f docker-compose.dev.yml up -d --build
```

### Production
```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f algo-school-ui

# Stop production environment  
docker-compose down

# Rebuild production image
docker-compose build --no-cache
```

### Utility Commands
```bash
# Check container status
docker-compose ps

# Execute commands inside container
docker-compose exec algo-school-ui sh

# View real-time logs
docker-compose logs -f

# Remove containers and networks
docker-compose down --volumes --remove-orphans
```

## 🔧 Environment Variables

### Required Variables
```env
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Endpoint (Required)
VITE_API_URL=http://api.localhost:8001
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

# Development Settings
VITE_DEBUG=true
NODE_ENV=development
```

### Backward Compatibility
The setup maintains backward compatibility with existing environment variables:
- `SUPABASE_URL` → `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` → `VITE_SUPABASE_ANON_KEY`
- `AI_MODEL` → `VITE_AI_MODEL`
- etc.

## 🌐 Port Mapping

| Environment | Host Port | Container Port | Access URL |
|-------------|-----------|----------------|------------|
| Development | 5173 | 5173 | http://localhost:5173 |
| Production | 3000 | 4173 | http://localhost:3000 |
| Legacy | 8080 | 4173 | http://localhost:8080 |

## 🏗️ Build Stages

### Development Build (`Dockerfile.dev`)
- **Base**: Node 18 Alpine
- **Features**: Hot reload, dev dependencies, volume mounting
- **Size**: Larger (includes dev tools)
- **Speed**: Faster startup, slower build

### Production Build (`Dockerfile`)
- **Base**: Multi-stage (Builder + Production)
- **Features**: Optimized bundle, minimal dependencies
- **Size**: Smaller (production optimized)
- **Speed**: Slower startup, faster runtime

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**:
```bash
# Check what's using the port
lsof -i :3000
# Kill the process or change port in docker-compose
```

2. **Environment Variables Not Loading**:
```bash
# Check if .env file exists and has correct values
cat .env
# Rebuild container after env changes
docker-compose up -d --build
```

3. **Hot Reload Not Working**:
```bash
# Use development compose file
docker-compose -f docker-compose.dev.yml up -d
# Ensure volumes are properly mounted
```

4. **Build Failures**:
```bash
# Clean build (remove cache)
docker-compose build --no-cache
# Check build logs
docker-compose logs algo-school-ui
```

5. **Container Health Check Failing**:
```bash
# Check container logs
docker-compose logs algo-school-ui
# Verify the application is running on correct port
docker-compose exec algo-school-ui wget -q -O - http://localhost:4173/
```

### Debugging Commands
```bash
# Enter container shell
docker-compose exec algo-school-ui sh

# Check container processes
docker-compose exec algo-school-ui ps aux

# Check network connectivity
docker-compose exec algo-school-ui ping google.com

# View environment variables
docker-compose exec algo-school-ui env
```

## 📊 Monitoring

### Health Checks
All containers include health checks that:
- Test HTTP connectivity to the app
- Run every 30 seconds
- Timeout after 10 seconds
- Retry up to 5 times
- Start checking after 60 seconds

### Logs
```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service logs
docker-compose logs -f algo-school-ui
```

## 🔐 Security

### Container Security
- Runs as non-root user (`nextjs:nodejs`)
- Minimal base image (Alpine Linux)
- No sensitive data in image layers
- Environment variables for configuration

### Network Security
- Custom bridge network isolation
- Only necessary ports exposed
- Health checks for availability monitoring

## 📈 Performance

### Production Optimizations
- Multi-stage Docker build
- Minimal production dependencies
- Vite production build optimizations
- Static file compression (if configured)

### Development Optimizations
- Volume mounting for hot reload
- Development dependencies available
- Source maps enabled
- Debug mode active

---

## 🤝 Usage Examples

### Full Development Setup
```bash
# 1. Setup environment
cp .env.example .env
vim .env  # Edit with your values

# 2. Start development with API
docker-compose -f docker-compose.dev.yml up -d

# 3. View logs
docker-compose -f docker-compose.dev.yml logs -f

# 4. Open in browser
open http://localhost:5173
```

### Production Deployment
```bash
# 1. Setup production environment
cp .env.example .env.production
vim .env.production  # Edit with production values

# 2. Deploy
ENV_FILE=.env.production docker-compose -f docker-compose.prod.yml up -d

# 3. Verify deployment
curl http://localhost:3000

# 4. Monitor logs
docker-compose -f docker-compose.prod.yml logs -f
```

### CI/CD Integration
```bash
# Build and test
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml run --rm algo-school-ui npm test


# Deploy
docker-compose -f docker-compose.prod.yml up -d
```