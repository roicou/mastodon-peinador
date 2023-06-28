import { DateTime } from "luxon";

export default interface AenaFlightInterface {
    compania: string;
    numVuelo: string;
    iataAena: string;
    fecha: string;
    horaProgramada: string;
    // dateTimeProgramada?: DateTime;
    fechaEstimada: string;
    horaEstimada: string;
    // dateTimeEstimada?: DateTime;
    iataOtro: string;
    estado: string;
    tipoVuelo: string;
    codigosCompania: string;
    terminal: string;
    tipoAeronave: string;
    puertaPrimera: string;
    puertaSegunda: string;
    mostradorDesde: string;
    mostradorHasta: string;
    ciudadIataOtro: string;
    iataCompania: string;
    oaciCompania: string;
    nombreCompania: string;
    urlLogoCompaniaDesktopMin1600: string;
    urlLogoCompaniaDesktopMax1600: string;
    urlLogoCompaniaTablet: string;
    urlLogoCompaniaMobile: string;
    iatasCompaniaSecundarios: string;
    oacisCompaniaSecundarios: string;
    poiMostrador: string;
    poiPuerta: string;
}