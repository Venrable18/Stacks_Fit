import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'StacksFit AI Middleware',
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// Detailed health check
router.get('/detailed', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'StacksFit AI Middleware',
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024),
    },
    services: {
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      stacks: process.env.STACKS_CONTRACT_ADDRESS ? 'configured' : 'not configured',
    }
  };

  res.json(healthData);
});

export default router;