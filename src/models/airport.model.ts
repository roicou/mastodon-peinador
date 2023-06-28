import AirportInterface from '@/interfaces/airport.interface';
import { Schema, model } from 'mongoose';
export default model<AirportInterface>(
    'Airport',
    new Schema<AirportInterface>({
        name: { type: String, required: true },
        iata: { type: String, required: true },
        oaci: { type: String, required: true },
        province: { type: String, required: true }
    }, {
        timestamps: true,
        versionKey: false
    })
);