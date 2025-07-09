# Docker Local Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker installed and running
- Docker Compose installed
- 8000 and 8001 ports available

### One-Command Deployment
```bash
./deploy-local.sh start
```

## 📦 What Gets Deployed

### Services
1. **Web API Server** - Port 8000
   - REST API for AI tools
   - Interactive web interface
   - Health monitoring

2. **Global MCP Server** - Port 8001
   - MCP protocol server
   - Railway-compatible API
   - Claude Desktop integration

3. **MCP Server** - Background service
   - Standalone MCP server
   - Direct stdio integration

### Available Endpoints
- `http://localhost:8000/` - API documentation
- `http://localhost:8000/health` - Health check
- `http://localhost:8000/api/tools` - List AI tools
- `http://localhost:8001/health` - Global MCP health
- `http://localhost:8001/message` - MCP message endpoint

## 🛠️ Deployment Commands

### Start Services
```bash
./deploy-local.sh start
```

### Stop Services
```bash
./deploy-local.sh stop
```

### Restart Services
```bash
./deploy-local.sh restart
```

### View Logs
```bash
./deploy-local.sh logs
```

### Check Status
```bash
./deploy-local.sh status
```

### Test Services
```bash
./deploy-local.sh test
```

### Clean Up
```bash
./deploy-local.sh clean
```

## 🔧 Manual Docker Commands

### Build Image
```bash
docker build -t fuzzy-disco-ai .
```

### Run Web API
```bash
docker run -p 8000:8000 fuzzy-disco-ai npm run start:web
```

### Run Global MCP Server
```bash
docker run -p 8001:8000 fuzzy-disco-ai node mcp-server-global.js
```

### Run with Docker Compose
```bash
docker-compose up --build -d
```

## 🧪 Testing the Deployment

### Test Web API
```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/tools
```

### Test Global MCP Server
```bash
curl http://localhost:8001/health
```

### Test AI Tools
```bash
curl -X POST http://localhost:8000/api/select-style \
  -H "Content-Type: application/json" \
  -d '{"taskType": "feature", "context": "authentication", "teamSize": 2}'
```

## 📊 Monitoring

### View Container Logs
```bash
docker-compose logs -f fuzzy-disco-ai
docker-compose logs -f mcp-global
```

### Container Status
```bash
docker-compose ps
```

### Resource Usage
```bash
docker stats
```

## 🔄 Development Workflow

### Hot Reload (Development)
```bash
# Stop production containers
./deploy-local.sh stop

# Run in development mode
docker-compose -f docker-compose.dev.yml up --build
```

### Update Code
```bash
# Rebuild and restart
./deploy-local.sh restart
```

## 🐛 Troubleshooting

### Port Conflicts
```bash
# Check what's using port 8000
lsof -i :8000

# Kill process using port
kill -9 $(lsof -t -i :8000)
```

### Container Issues
```bash
# Remove all containers
docker-compose down -v

# Clean up system
docker system prune -f

# Rebuild from scratch
./deploy-local.sh clean
./deploy-local.sh start
```

### Memory Issues
```bash
# Check Docker memory usage
docker stats

# Increase Docker memory limit in Docker Desktop
```

## 📝 Configuration

### Environment Variables
```bash
# Set in docker-compose.yml
environment:
  - NODE_ENV=production
  - PORT=8000
  - API_URL=http://localhost:8000
```

### Custom Ports
```bash
# Edit docker-compose.yml
ports:
  - "8080:8000"  # Change host port
```

## 🔐 Security

### Container Security
- Runs as non-root user
- Minimal Alpine Linux base
- No unnecessary packages

### Network Security
- Isolated Docker network
- Only exposed ports accessible

## 📈 Performance

### Resource Limits
```yaml
# Add to docker-compose.yml
resources:
  limits:
    memory: 512M
    cpus: '0.5'
```

### Health Checks
- Built-in health monitoring
- Automatic restart on failure
- Graceful shutdown handling

## 🎯 Production Considerations

### Scaling
```bash
# Scale services
docker-compose up --scale fuzzy-disco-ai=3
```

### Load Balancing
```bash
# Add nginx container for load balancing
# See docker-compose.prod.yml
```

### Monitoring
```bash
# Add prometheus/grafana for monitoring
# See monitoring/docker-compose.yml
```

## ✅ Success Indicators

After successful deployment, you should see:
- ✅ Web API responding at localhost:8000
- ✅ Global MCP server at localhost:8001
- ✅ Health checks passing
- ✅ All 4 AI tools available
- ✅ Container logs showing "ready"

## 🚀 Ready to Use!

Your fuzzy-disco-ai is now running locally with Docker. All AI tools are available via REST API or MCP protocol for Claude Desktop integration.