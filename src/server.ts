/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './docs/swagger.json';

import prisma from '@services/prisma';
import routes from './routes';

const app = express();

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch {
    console.error('⛔ Database connection failure');
    return;
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use(cors());
  app.use(express.json());
  app.use(routes);

  const port = process.env.PORT ?? 3001;
  app.listen(port, () => {
    console.log(`🔥 Server running at http://localhost:${port}`);
  });
}

bootstrap();
