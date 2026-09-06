import { createApp } from './app';
import { config } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/db';

const startServer = async (): Promise<void> => {
  // Initialize Database Connection
  await connectDatabase();

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`[Backend] RuralCare Connect API running on port ${config.port} (${config.env})`);
    console.log(`[Backend] Health check available at: http://localhost:${config.port}/api/health`);
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n[Backend] Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log('[Backend] HTTP server closed.');
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
};

startServer().catch((err) => {
  console.error('[Backend] Fatal error starting server:', err);
  process.exit(1);
});
