import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';

import { User, UserImage } from './models';
import { log } from '../logger';

(mongoose as any).Promise = bluebird.Promise;
mongoose.set('debug', false);

export function database(uri: string): void {

    const connection = mongoose.connection;
    connection.on('open', async () => {

        await connection.dropDatabase(err => console.log('mongoose:drop database'));

        dropModels();

    });
    connection.on('connected', () => log.info('mongoose:connected'));
    connection.on('connecting', () => log.info('mongoose:connecting'));
    connection.on('error', err => log.error('mongoose:error'));
    connection.on('disconnected', () => log.warn('mongoose:disconnected'));

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

}

async function dropModels(): Promise<void> {

    const dbModels = [User, UserImage];

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
