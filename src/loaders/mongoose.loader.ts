import mongoose from 'mongoose';
import config from '@/config';
import logger from '@/libs/logger';

export default async (): Promise<void> => {

    // connect to mongodb
    await mongoose.connect(config.db.uri, {
        user: config.db.user,
        pass: config.db.password
    })
        .catch((err) => {
            throw err;
        })
    logger.info(`
        ################################################
        #              Mongoose connected              #
        ################################################
    `);
    // return connection.connection.db;
}