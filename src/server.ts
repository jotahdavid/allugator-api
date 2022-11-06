import express from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './docs/swagger.json';

import routes from './routes';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors());
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT ?? 3001;
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`🔥 Server running at http://localhost:${PORT}`));
