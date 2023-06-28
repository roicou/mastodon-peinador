import logger from "@/libs/logger";
import flightService from "@/services/flight.service";
export default async () => {
    logger.info(`
        ################################################
        #                 Aiport loaded                #
        ################################################
    `);
    try {
        await flightService.updateFlights();
    } catch (error) {
        logger.error(error);
    }
    setInterval(async () => {
        try {
            await flightService.updateFlights();
        } catch (error) {
            logger.error(error);
        }
    }, /* each 5 minutes */ 5 * 60 * 1000);
}