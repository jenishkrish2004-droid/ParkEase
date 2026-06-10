// ============================================================
// Server Entry Point
// ============================================================

import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

const PORT = env.PORT;

async function bootstrap() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🅿️  Parkora API Server                          ║
║                                                    ║
║   Environment:  ${env.NODE_ENV.padEnd(33)}║
║   Port:         ${String(PORT).padEnd(33)}║
║   API Prefix:   ${env.API_PREFIX.padEnd(33)}║
║   Health:       http://localhost:${PORT}${env.API_PREFIX}/health   ║
║                                                    ║
╚════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
