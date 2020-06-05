import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';

import { User, UserImage } from './models';
import { log } from '../logger';

( mongoose as any).Promise = bluebird.Promise;
mongoose.set('debug', false);

export function database(uri: string): void {

    const connection = mongoose.connection;
    connection.once('open', async () => {

        await connection.dropDatabase(err => console.log('mongoose:drop database'));
        dropModels();

    });
    connection.on('connected', () => log.info('mongoose:connected'));
    connection.on('connecting', () => log.info('mongoose:connecting'));
    connection.on('error', err => log.error('mongoose:error'));
    connection.on('disconnected', () => log.warn('mongoose:disconnected'));
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

}

function dropModels(): void {

    const dbModels = [User, UserImage];
    dbModels.forEach(e => {

        const model = e;
        model.db.db.listCollections({ name: model.collection.name })
            .toArray()
            .then((res: any[]) => {

                if (res.length !== 0) {
                    model.collection.drop();
                }

            })
            .catch((error) => {
                log.error(`mongoose:drop models: ${JSON.stringify(error)}`);
            });

    });

}
