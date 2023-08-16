import { Router, Request as IReq, Response as IRes } from 'express';

const router = Router();

router.route('*').all(function (req: IReq, res: IRes): void {
  res.status(404).json({
    err_code: 404,
    err_status: 'Route not found.',
    err_message: 'This route cannot be reached, check the url and try again.',
  });
});

export { router as notFoundRoute };
