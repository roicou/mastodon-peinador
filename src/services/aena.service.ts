import config from "@/config";
import AenaAirportInterface from "@/interfaces/aenaairport.interface";
import AirportInterface from "@/interfaces/airport.interface";
import AenaFlightInterface from "@/interfaces/aenaflight.interface";
import FlightInterface from "@/interfaces/flight.interface";
import logger from "@/libs/logger";
import axios from "axios";
import { DateTime, Settings } from "luxon";
Settings.defaultZone = config.timezone;
class AenaService {
    private readonly BASE_URL = "https://www.aena.es";
    private readonly PREFIX = "/sites";
    private readonly ENDPOINT = "/Satellite";
    private readonly PAGENAME = "AENA_ConsultarVuelos";
    private readonly FLIGHT_TYPE_DEPARTURES = "S";
    private readonly FLIGHT_TYPE_ARRIVALS = "L";
    private readonly TWO_DAYS = "si";
    private readonly AIRPORT = config.airport.iata;
    // https://www.aena.es/sites/Satellite?pagename=AENA_ConsultarVuelos&airport=VGO&flightType=S&dosDias=si
    private readonly DEPARTURES_URI = `${this.BASE_URL}${this.PREFIX}${this.ENDPOINT}?pagename=${this.PAGENAME}&airport=${this.AIRPORT}&flightType=${this.FLIGHT_TYPE_DEPARTURES}&dosDias=${this.TWO_DAYS}`;
    // https://www.aena.es/sites/Satellite?pagename=AENA_ConsultarVuelos&airport=VGO&flightType=L&dosDias=si
    private readonly ARRIVALS_URI = `${this.BASE_URL}${this.PREFIX}${this.ENDPOINT}?pagename=${this.PAGENAME}&airport=${this.AIRPORT}&flightType=${this.FLIGHT_TYPE_ARRIVALS}&dosDias=${this.TWO_DAYS}`;

    /**
     * make a post petition to Aena and return flights
     * @param uri
     * @returns flights
     * @throws Error
     */
    private async post(uri: string): Promise<AenaFlightInterface[]> {
        // use axios to post petition
        const response = await axios.post(uri, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
       
        if (!response.data && typeof response.data == 'string') {
            throw new Error('No data found')
        }
        // for(const flight of response.data) {
        //     flight.dateTimeProgramada = DateTime.fromFormat(`${flight.fecha} ${flight.horaProgramada}`, 'dd/MM/yyyy HH:mm:ss');
        //     flight.dateTimeEstimada = DateTime.fromFormat(`${flight.fechaEstimada} ${flight.horaEstimada}`, 'dd/MM/yyyy HH:mm:ss');
        // }
        return response.data;
    }

    /**
     * Get flights from Aena and call flightService to update flights
     * @returns airports
     * @throws Error
     */
    public async getAirports() {
        logger.info('Getting airports from Aena');
        // https://www.aena.es/sites/Satellite?pagename=AENA_InfoAeropuertosScript&d=NonTouch
        const response = await axios.post(`${this.BASE_URL}${this.PREFIX}${this.ENDPOINT}?pagename=AENA_InfoAeropuertosScript&d=NonTouch`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        if (!response.data) {
            throw new Error('No data found')
        }
        // check if response.data starts with infoAeropuertoJSON=
        if (response.data.indexOf(`infoAeropuertoJSON=`) === -1) {
            logger.debug(response.data)
            throw new Error('No airports found')
        }
        // remove infoAeropuertoJSON= and parse JSON
        const data = JSON.parse(response.data.replace('infoAeropuertoJSON=', ''));
        // map data to AirportInterface
        const airports: AirportInterface[] = data.map((airport: AenaAirportInterface) => {
            return {
                name: airport.nombre,
                iata: airport.iata,
                oaci: airport.oaci,
                province: airport.ciudad
            }
        });
        logger.info('Airports retrieved');
        return airports;
    }


    /**
     * Get flights from Aena and call flightService to update flights
     */
    public async getDepartures() {
        logger.debug('POST:', this.DEPARTURES_URI)
        const response = await this.post(this.DEPARTURES_URI);
        // console.log('response', response)
        const flights: FlightInterface[] = this.transformFlights(response, 'departure');
        return flights;
    }

    /**
     * Get flights from Aena and call flightService to update flights
     */
    public async getArrivals() {
        logger.debug('POST:', this.ARRIVALS_URI)
        const response = await this.post(this.ARRIVALS_URI);
        // console.log('response', response)
        const flights: FlightInterface[] = this.transformFlights(response, 'arrival');
        return flights;
    }

    /**
     * Transform AenaFlightInterface to FlightInterface
     * @param aena_flights
     * @param type
     * @returns flights
     * @throws Error
     */
    private transformFlights(aena_flights: AenaFlightInterface[], type: string): FlightInterface[] {
        const flights: FlightInterface[] = aena_flights.map((flight: AenaFlightInterface) => {
            return {
                companyCode: flight.compania,
                companyName: flight.nombreCompania,
                flightNumber: flight.numVuelo,
                scheduledDate: DateTime.fromFormat(`${flight.fecha} ${flight.horaProgramada}`, 'dd/MM/yyyy HH:mm:ss').toJSDate(),
                estimatedDate: DateTime.fromFormat(`${flight.fechaEstimada} ${flight.horaEstimada}`, 'dd/MM/yyyy HH:mm:ss').toJSDate(),
                localIata: flight.iataAena,
                remoteIata: flight.iataOtro,
                status: flight.estado,
                type: type,
                plain: flight.tipoAeronave,
            }
        });
        return flights;
    }
}
export default new AenaService();

