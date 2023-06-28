import { DateTime } from "luxon";
import AirportInterface from "./aenaairport.interface";
import { ObjectId } from "mongoose";

export default interface AenaFlightInterface {
    _id?: ObjectId;
    companyCode: string;
    companyName: string;
    flightNumber: string;
    scheduledDate: Date;
    estimatedDate: Date;
    localIata: string;
    localAirport?: AirportInterface;
    remoteIata: string;
    remoteAirport?: AirportInterface;
    status: string;
    type: string;
    plain: string;
    published?: boolean;
}