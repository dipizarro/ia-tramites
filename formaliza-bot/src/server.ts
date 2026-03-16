import Fastify from 'fastify';
import crypto from 'crypto';
import cors from '@fastify/cors';
import { logger } from './infrastructure/logger';
import { setupRoutes } from './api/routes';
import { config } from './infrastructure/config';

const fastify = Fastify({
    loggerInstance: logger,
    genReqId: function (req) {
        return (req.headers['x-correlation-id'] as string) || crypto.randomUUID();
    }
});

fastify.register(cors, {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-correlation-id']
});

fastify.register(setupRoutes);

const start = async () => {
    try {
        await fastify.listen({ port: config.port, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
