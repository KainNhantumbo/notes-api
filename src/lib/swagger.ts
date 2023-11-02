import { info } from 'node:console';
import { Application } from 'express';
import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Choconotey API',
      description: 'Choconotey Server Rest API Application',
      version: '1.1.0',
      contact: {
        name: 'Kain Nhantumbo',
        url: 'codenut-dev.vercel.app',
        email: 'nhantumbok@gmail.com'
      },
      license: {
        name: 'Apache License Version 2.0',
        url: 'http://www.apache.org/licenses'
      }
    },
    servers: [
      {
        url: 'http://localhost:5700',
        description: 'Development server'
      }
    ],
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
import swaggerDocsJSON from '../data/swagger.json'

export default function swaggerDocs(app: Application, port: number) {
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocsJSON));

  app.get('docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  info(`Docs available at http://localhost:${port}/docs`);
}
