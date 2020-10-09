import { NextFunction, Router, Request, Response } from 'express';

import { CommentController } from './controllers';
import { redisClient } from '../redis';
import { handleErrors } from '../middlewares';

const router = Router();

async function checkCache(req: Request, res: Response, next: NextFunction): Promise<void> {

    const { offset, batch } = req.body;
    const key = `${req.url}:${offset}:${batch}`;

    try {

        const result = await redisClient.get(key);

        if (result) {
            res.send({ comments: JSON.parse(result) });
        }
        else {
            next();
        }

    } catch (error) {
        handleErrors(error, res);
    }

}

router.post('/api/comments/all', checkCache, CommentController.all);

export { router as commentRouter };
