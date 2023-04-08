import { Router, Request as IReq, Response as IRes } from 'express';

const router = Router();

router.route('*').all((req: IReq, res: IRes) => {
  res
    .status(404)
    .json({
      message: 'This route cannot be reached, check the url and try again.',
    });
});

export { router as notFoundRoute };
