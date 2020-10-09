import { Response, Request } from 'express';
const ms = require('ms');
// custom
import { Comment } from '../../mongoose/models';
import { handleErrors } from '../../middlewares';
import { redisClient } from '../../redis';

class Controller {

    static all = async (req: Request, res: Response): Promise<void> => {

        const { offset, batch } = req.body;
        const key = `${req.url}:${offset}:${batch}`;

        try {
            const comments = await Comment.find({},
                {
                    _id: 0,
                    emoji: 1,
                    author: 1,
                    description: 1,
                    seq: 1
                })
                .sort({ seq: 1 })
                .skip(offset)
                .limit(batch)
                .exec();

            await redisClient.setex(key, 60, JSON.stringify(comments));

            res.send({ comments });

        } catch (error) {
            handleErrors(error, res);
        }

    }
}

export { Controller as CommentController };
