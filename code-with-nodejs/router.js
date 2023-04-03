import Router from 'koa-router';
import {
  getPage,
  getUploadsPage,
} from './middleware';

const router = new Router();

router.get(
  '/cached/:name',
  getPage(),
);

router.get(
  '/cached/uploads/:name',
  getUploadsPage(),
);

export default router;
