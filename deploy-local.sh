#!/bin/bash

# Local Docker Deployment Script for Fuzzy Disco AI

set -e

echo "🚀 Starting Fuzzy Disco AI Local Docker Deployment"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Docker daemon is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Parse command line arguments
ACTION=${1:-start}

case $ACTION in
    "start")
        echo "🏗️  Building and starting containers..."
        docker-compose up --build -d
        
        echo "⏳ Waiting for services to be ready..."
        sleep 10
        
        echo "🔍 Checking service health..."
        
        # Check web API
        if curl -s http://localhost:8000/health > /dev/null; then
            echo "✅ Web API is running at http://localhost:8000"
        else
            echo "⚠️  Web API may still be starting..."
        fi
        
        # Check global MCP server
        if curl -s http://localhost:8001/health > /dev/null; then
            echo "✅ Global MCP Server is running at http://localhost:8001"
        else
            echo "⚠️  Global MCP Server may still be starting..."
        fi
        
        echo ""
        echo "🎉 Deployment complete!"
        echo "📍 Available services:"
        echo "   • Web API: http://localhost:8000"
        echo "   • Global MCP: http://localhost:8001"
        echo "   • MCP Server: Running in background"
        echo ""
        echo "🔧 Available endpoints:"
        echo "   • http://localhost:8000/health - Health check"
        echo "   • http://localhost:8000/api/tools - List AI tools"
        echo "   • http://localhost:8000/ - API documentation"
        echo ""
        echo "📊 View logs: docker-compose logs -f"
        echo "🛑 Stop services: ./deploy-local.sh stop"
        ;;
        
    "stop")
        echo "🛑 Stopping containers..."
        docker-compose down
        echo "✅ All containers stopped"
        ;;
        
    "restart")
        echo "🔄 Restarting containers..."
        docker-compose down
        docker-compose up --build -d
        echo "✅ Containers restarted"
        ;;
        
    "logs")
        echo "📋 Showing container logs..."
        docker-compose logs -f
        ;;
        
    "status")
        echo "📊 Container status:"
        docker-compose ps
        ;;
        
    "clean")
        echo "🧹 Cleaning up containers and images..."
        docker-compose down -v
        docker system prune -f
        echo "✅ Cleanup complete"
        ;;
        
    "test")
        echo "🧪 Testing deployed services..."
        
        # Test web API
        echo "Testing Web API..."
        curl -s http://localhost:8000/health | jq '.' || echo "Web API test failed"
        
        # Test global MCP server
        echo "Testing Global MCP Server..."
        curl -s http://localhost:8001/health | jq '.' || echo "Global MCP test failed"
        
        # Test API tools endpoint
        echo "Testing API tools..."
        curl -s http://localhost:8000/api/tools | jq '.' || echo "API tools test failed"
        
        echo "✅ Testing complete"
        ;;
        
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|clean|test}"
        echo ""
        echo "Commands:"
        echo "  start   - Build and start all containers"
        echo "  stop    - Stop all containers"
        echo "  restart - Restart all containers"
        echo "  logs    - Show container logs"
        echo "  status  - Show container status"
        echo "  clean   - Clean up containers and images"
        echo "  test    - Test deployed services"
        exit 1
        ;;
esac