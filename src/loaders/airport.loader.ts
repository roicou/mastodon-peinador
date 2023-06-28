import logger from "@/libs/logger";
import airportService from "@/services/airportService";
export default async () => {
    logger.info(`
        ################################################
        #                 Aiport loaded                #
        ################################################
    `);
    try {
        await airportService.updateAirports();
    } catch (error) {
        logger.error(error);
    }
    setInterval(async () => {
        try {
            await airportService.updateAirports();
        } catch (error) {
            logger.error(error);
        }
    }, /* each day */ 24 * 60 * 60 * 1000);

}