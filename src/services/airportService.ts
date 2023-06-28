import airportModel from "@/models/airport.model";
import logger from "@/libs/logger";
import AirportInterface from "@/interfaces/airport.interface";
import aenaService from "./aena.service";
class AirportService {
    /**
     * update airports with bulk on database
     * @param airports 
     */
    public async updateAirports() {
        logger.info('Updating airports');
        const airports: AirportInterface[] = await aenaService.getAirports();
        // upsert airports with bulk
        await airportModel.bulkWrite(airports.map((airport: AirportInterface) => {
            return {
                updateOne: {
                    filter: { iata: airport.iata },
                    update: airport,
                    upsert: true
                }
            }
        }));
        logger.info('Airports updated');
    }
}
export default new AirportService();