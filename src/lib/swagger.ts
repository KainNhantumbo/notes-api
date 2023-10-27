import { info } from 'node:console';
import { Application } from 'express';
import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Choconotey API', version: '1.1.0' },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

const swaggerSpec = swaggerJSDoc(options);

export default function swaggerDocs(app: Application, port: number) {
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  app.get('docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  info(`Docs available at http://localhost:${port}/docs`);
}
