import flightModel from "@/models/flight.model";
import aenaService from "./aena.service";
import FlightInterface from "@/interfaces/flight.interface";
import { DateTime, Settings } from "luxon";
import config from "@/config";
import logger from "@/libs/logger";
import { debug } from "console";
Settings.defaultZone = config.timezone;
class FlightService {
    /**
     * delete old flights from database
     */
    private deleteOldFlights() {
        return flightModel.deleteMany({
            $and: [
                { scheduledDate: { $lt: DateTime.local().startOf('minute').toJSDate() } },
                { estimatedDate: { $lt: DateTime.local().startOf('minute').toJSDate() } }
            ]
        });

    }

    /**
     * update flights with bulk on database
     */
    public async updateFlights() {
        logger.info('Updating flights');
        logger.info('Updating departures');
        const departures = await aenaService.getDepartures();
        await this.saveFlights(departures);
        logger.info('Departures updated');
        logger.info('Updating arrivals');
        const arrivals = await aenaService.getArrivals();
        await this.saveFlights(arrivals);
        logger.info('Arrivals updated');
        logger.info('Deleting old flights');
        await this.deleteOldFlights();
        logger.info('Old flights deleted');
        logger.info('Flights updated');
        await this.nextFlight();
        

        
    }

    /**
     * get the next flight to publish and log it
     */
    public async nextFlight() {
        const next = await flightModel.findOne({published: false}).sort({ estimatedDate: 1 });
        if(next) {
            logger.info('Next flight:', next.companyCode + next.flightNumber, DateTime.fromJSDate(next.estimatedDate).toFormat('dd/MM/yyyy HH:mm:ss'));
        } else {
            logger.info('No next flight');
        }
    }

    /**
     * save flights on database
     */
    private saveFlights(flights: FlightInterface[]) {
        const now = DateTime.local().startOf('minute').toMillis();
        const twoHours = DateTime.local().plus({ hours: 12 }).toMillis();
        const to_save: FlightInterface[] = flights.filter((flight: FlightInterface) => {
            return (flight.scheduledDate.getTime() > now || flight.estimatedDate.getTime() > now) &&
                (flight.scheduledDate.getTime() < twoHours && flight.estimatedDate.getTime() < twoHours);
        });
        // update flights with bulk
        return flightModel.bulkWrite(to_save.map((flight: FlightInterface) => {
            return {
                updateOne: {
                    filter: { flightNumber: flight.flightNumber },
                    update: flight,
                    setonInsert: { published: false },
                    upsert: true
                }
            }
        }));
    }

    /**
     * get flights to publish
     */
    public async getFlightsToPublish() {
        const fromDate = DateTime.local().startOf('minute').toJSDate();
        const toDate = DateTime.local()/*.plus({minutes: 120})*/.endOf('minute').toJSDate(); //! 1 minute
        const flights = await flightModel.aggregate([
            {
                $match: {
                    published: false,
                    estimatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            { $lookup: { from: 'airports', localField: 'localIata', foreignField: 'iata', as: 'localAirport' } },
            { $unwind: '$localAirport' },
            { $lookup: { from: 'airports', localField: 'remoteIata', foreignField: 'iata', as: 'remoteAirport' } },
            { $unwind: '$remoteAirport' }
        ]);
        // set published to true
        await flightModel.updateMany({ _id: { $in: flights.map((flight: FlightInterface) => flight._id) } }, { published: true });
        flights.forEach((flight: FlightInterface) => {
            if(flight.companyCode === 'NT' && flight.companyName === 'Binter Canarias') {
                flight.companyCode = 'IBB';
            }
        });
        return flights;
    }
}
export default new FlightService();