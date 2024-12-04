import { Router, Request as IReq, Response as IRes } from 'express';

const router: Router = Router();

router.route('*').all(function (req: IReq, res: IRes) {
  res.status(404).json({
    code: 404,
    status: 'Route not found.',
    message: 'This route cannot be reached, check the url and try again.'
  });
});

export { router as notFoundRoute };
