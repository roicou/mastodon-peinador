import FlightInterface from '@/interfaces/flight.interface';
import { Schema, model } from 'mongoose';
export default model<FlightInterface>(
    'Flight',
    new Schema<FlightInterface>({
        companyCode: { type: String, required: true },
        companyName: { type: String, required: true },
        flightNumber: { type: String, required: true },
        scheduledDate: { type: Date, required: true },
        estimatedDate: { type: Date, required: true },
        localIata: { type: String, required: true },
        remoteIata: { type: String, required: true },
        status: { type: String, required: true },
        type: { type: String, required: true },
        plain: { type: String, required: true },
        published: { type: Boolean, required: true, default: false }
    }, {
        timestamps: true,
        versionKey: false
    })
);