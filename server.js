const { spawn } = require('child_process');

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

console.log(`🚀 Starting Xero MCP Server on ${host}:${port}`);
console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);

// Validate required environment variables
if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
  console.error('❌ Missing required environment variables: XERO_CLIENT_ID, XERO_CLIENT_SECRET');
  process.exit(1);
}

console.log('✅ Environment variables validated');

// Start the MCP server
const mcpServer = spawn('npx', ['@xeroapi/xero-mcp-server@latest'], {
  env: {
    ...process.env,
    PORT: port,
    HOST: host
  },
  stdio: 'inherit'
});

mcpServer.on('error', (error) => {
  console.error('❌ Failed to start MCP server:', error);
  process.exit(1);
});

mcpServer.on('close', (code) => {
  console.log(`🔄 MCP server exited with code ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully');
  mcpServer.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully');
  mcpServer.kill('SIGINT');
});
