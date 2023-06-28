import megalodonLoader from "@/loaders/megalodon.loader"
import mongooseLoader from "@/loaders/mongoose.loader";
import airportLoader from "@/loaders/airport.loader";
import flightLoader from "./flight.loader";
export default async () => {
    await mongooseLoader()
    await airportLoader();
    await flightLoader();
    await megalodonLoader();
}