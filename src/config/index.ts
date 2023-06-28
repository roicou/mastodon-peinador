import dotenv from 'dotenv';
const envFound = dotenv.config();
if (envFound.error) {
    // This error should crash whole process
    throw new Error("Couldn't find .env file");
}
export default {
    /**
     * debug
     */
    debug: process.env.DEBUG == 'true',
    /**
     * time zone
     */
    timezone: process.env.TIMEZONE || 'Europe/Madrid',
    /**
     * db config
     */
    db: {
        uri: process.env.DB_URI,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    /**
     * mastodon config
     */
    mastodon: {
        client_key: process.env.MASTODON_CLIENT_KEY,
        client_secret: process.env.MASTODON_CLIENT_SECRET,
        access_token: process.env.MASTODON_ACCESS_TOKEN,
        api_url: process.env.MASTODON_API_URL,
    },
    /**
     * airport config
     * @see https://en.wikipedia.org/wiki/International_Civil_Aviation_Organization_airport_code
     * @see https://en.wikipedia.org/wiki/IATA_airport_code
     */
    airport: {
        name: process.env.AIRPORT_NAME,
        iata: process.env.AIRPORT_IATA,
    },
    /**
     * logs config
     */
    logs: {
        log_path: process.env.LOG_PATH || "logs",
        compress_before_days: process.env.COMPRESS_BEFORE_DAYS || 3,
        cron_hour: process.env.CRON_HOUR || 3
    },
}