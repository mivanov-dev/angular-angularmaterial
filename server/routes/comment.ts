import { Router } from 'express';
import { CommentController } from './controllers';

const router = Router();

router.get('/api/comments/all', CommentController.all);

export { router as commentRouter };
