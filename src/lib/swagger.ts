import { Application } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from '../data/swagger.json';

export default function swaggerDocs(app: Application, port: number) {
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  app.get('/docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.info(`Docs available at http://localhost:${port}/docs`);
}
