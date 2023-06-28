import megalodonService from "@/services/megalodon.service";
import config from '@/config';
import generator, { MegalodonInterface } from 'megalodon'
import logger from "@/libs/logger";

export default async () => {
    // service to send posts
    const client: MegalodonInterface = generator('mastodon', config.mastodon.api_url, config.mastodon.access_token);
    logger.info(`
        ################################################
        #          Megalodon client loaded             #
        ################################################
    `);
    await megalodonService.startClient(client);
    try {
        await megalodonService.publishFlights();
    } catch (error) {
        logger.error(error);
    }
    setInterval(async () => {
        try {
            await megalodonService.publishFlights();
        } catch (error) {
            logger.error(error);
        }
    }, 1 * 60 * 1000);
}

