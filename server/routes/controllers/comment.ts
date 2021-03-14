import { Response, Request } from 'express';
// custom
import { Comment } from '@server/mongoose/models';
import { handleErrors } from '@server/middlewares';

class Controller {

  static all = async (req: Request, res: Response): Promise<void> => {

    const { offset, batch } = req.body;

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

      res.send({ comments });

    } catch (error) {
      handleErrors(error, res);
    }

  }
}

export { Controller as CommentController };
