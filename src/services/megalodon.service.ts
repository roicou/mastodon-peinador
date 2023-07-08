import { MegalodonInterface } from "megalodon";
import logger from "@/libs/logger";
import { DateTime, Settings } from "luxon";
import config from "@/config";
import aenaService from "./aena.service";
import flightService from "./flight.service";
Settings.defaultZone = config.timezone;


class MegalodonService {
    private client: MegalodonInterface;
    private lastPost: DateTime = null;
    /**
     * Start the client
     * @param client 
     */
    public async startClient(client: MegalodonInterface) {
        this.client = client;
    }

    /**
     * get the flights to publish and publish them
     */
    public async publishFlights() {
        const first_words = [
            'Atención!',
            'Alerta!',
            'Información!',
            'Noticia!',
            'Última hora!',
            'Exclusiva!',
            'Atención, atención!',
        ];
        const second_words = [
            'O voo',
            'O avión',

        ];
        const third_words = [
            'acaba de',
            'xusto está a',
            'xa está a',
            'vai',
            'xa vai',
            'xusto vai',
            'está a piques de',
            'está a',
            'anda xa a'
        ];

        const flights = await flightService.getFlightsToPublish();
        logger.info('Flights for this minute:', flights.length);
        // logger.debug('flights', JSON.stringify(flights, null, 2))
        // some flights can be grouped because they are the same flight with different companies
        const grouped_flights = flights.reduce((acc, flight) => {
            const key = `${flight.type}@${flight.remoteIata}@${flight.plain}@${flight.scheduledDate.getTime()}@${flight.estimatedDate.getTime()}`
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(flight);
            return acc;
        }, {});
        logger.debug('grouped_flights', JSON.stringify(grouped_flights, null, 2));
        for (const key in grouped_flights) {
            //const first_word = first_words[Math.floor(Math.random() * first_words.length)];
            const second_word = second_words[Math.floor(Math.random() * second_words.length)];
            const third_word = third_words[Math.floor(Math.random() * third_words.length)];

            let main_text = /*`${first_word} */`${second_word} de `;// ${third_word} `
            // for (const flight of grouped_flights[key]) {
            //     main_text += ` ${flight.companyName} (${flight.companyCode}${flight.flightNumber}),`

            // }
            const flight = grouped_flights[key][0];
            main_text += `${flight.companyName} ${flight.companyCode}${flight.flightNumber}`
            // main_text = main_text.slice(0, -1);
            let secondary_text: string;
            let action_text: string;
            switch (flight.type) {
                case 'arrival':
                    action_text = 'aterrar';
                    secondary_text = 'procedente de'
                    break;
                case 'departure':
                    action_text = 'despegar';
                    secondary_text = 'con destino';
                    break;
            }
            main_text += ` ${secondary_text} ${flight.remoteAirport.name} (${flight.remoteAirport.province}) ${third_word} ${action_text}`;
            main_text += ` ás ${DateTime.fromJSDate(flight.estimatedDate).toFormat('HH:mm')}`
            if (flight.estimatedDate.getTime() !== flight.scheduledDate.getTime()) {
                main_text += ` con ${Math.abs(DateTime.fromJSDate(flight.estimatedDate).diff(DateTime.fromJSDate(flight.scheduledDate), 'minutes').minutes)} minutos de `;
                if (flight.estimatedDate.getTime() > flight.scheduledDate.getTime()) {
                    main_text += 'retraso';
                } else {
                    main_text += 'adianto';
                }
            }
            main_text += `\nhttps://flightaware.com/live/flight/${flight.companyCode}${flight.flightNumber}`
            logger.info('Text to toot:\n' + main_text);
            
            try {
                //if (!config.debug) {
                    const now = DateTime.local();
                    let visibility: "unlisted" | "public" = "unlisted";
                    if(!this.lastPost || this.lastPost < now.minus({hour: 1})) {
                        visibility = "public";
                        this.lastPost = now;
                    }
                    logger.info('Visibility:', visibility);
                    await this.client.postStatus(main_text, {
                        visibility: visibility,
                        sensitive: false,
                    });
                //}
            } catch (error) {
                logger.error(error);
            }
        }
        await flightService.nextFlight();
    }

    // await this.client.postStatus(message, {
    //     scheduled_at: DateTime.local().plus({ minutes: 1 }).toISO()
    // });


}
export default new MegalodonService();