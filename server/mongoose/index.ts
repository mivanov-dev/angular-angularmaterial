import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import * as faker from 'faker';
import * as bcrypt from 'bcryptjs';
// custom
import { User, UserImage, Comment, Counter } from './models';
import { log } from '@server/logger';
import { emojiRandom } from '@server/emojis';

(mongoose as any).Promise = bluebird.Promise;
mongoose.set('debug', false);

export function database(uri: string, options: object): void {

  const connection = mongoose.connection;
  connection.on('open', async () => {

    await connection
      .dropDatabase((error) => log.info(`mongoose:drop database: ${JSON.stringify(error)}`));

    await dropModels();

    await initData();

    await insertComments(30);

    await createAdmin();

  });
  connection.on('connected', () => log.info('mongoose:connected'));
  connection.on('connecting', () => log.info('mongoose:connecting'));
  connection.on('error', (error) => log.error(`mongoose:error: ${JSON.stringify(error)}`));
  connection.on('disconnected', () => log.warn('mongoose:disconnected'));

  mongoose.connect(uri, options);

}

async function dropModels(): Promise<void> {

  const dbModels = [User, UserImage, Comment, Counter];

  try {

    for (const model of dbModels) {

      const list = await model.db.db.listCollections({
        name: model.name
      }).toArray();

      if (list.length !== 0) {
        await model.collection.drop();
      } else {
        log.warn(`mongoose:dropModels: collection ${model.collection.name} does not exist`);
      }
    }

  }
  catch (error) {
    log.error(`mongoose:dropModels: ${JSON.stringify(error)}`);
  }

}

async function initData(): Promise<void> {

  try {
    await new Counter({ _id: 'commentId', seq: 0 }).save();
  } catch (error) {
    log.error(`initData: ${JSON.stringify(error)}`);
  }

}

async function insertComments(count: number): Promise<void> {

  try {

    for (let i = 0; i < count; i++) {
      await new Comment({
        emoji: emojiRandom(),
        author: `${faker.name.firstName()} ${faker.name.lastName()}`,
        description: `${faker.hacker.phrase()}`
      }).save();
    }

  } catch (error) {
    log.error(`insertComments: ${JSON.stringify(error)}`);
  }
}

async function createAdmin(): Promise<void> {

  try {

    const userImage = await new UserImage().save();

    const password = bcrypt.hashSync('1234567890', 10);

    await User.create({
      email: 'admin@admin.com',
      password,
      role: 'admin',
      imageId: userImage._id
    });

  } catch (error) {
    log.error(`createAdmin: ${JSON.stringify(error)}`);
  }
}
