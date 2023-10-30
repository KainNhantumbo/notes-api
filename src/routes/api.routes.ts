import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    code: 200,
    message: 'Service active and running...'
  });
});

export { router as healthRoutes };
