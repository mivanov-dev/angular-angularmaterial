import { Router } from 'express';
import { CommentController } from './controllers';

const router = Router();

router.post('/api/comments/all', CommentController.all);

export { router as commentRouter };
