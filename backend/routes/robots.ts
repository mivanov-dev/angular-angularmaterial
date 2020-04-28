import { Router } from 'express';
import { RobotsController } from './controllers';

const router = Router();

router.get('/robots.txt', RobotsController.robots);

export { router as robotsRouter };