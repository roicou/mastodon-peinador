# Mastodon Peinador
Bot que publica un toot cada vez que un avión aterra ou despega de Peinador.

## Instalación
### Requisitos
- NodeJS
- npm
- Mastodon API credentials
- TypeScript
- MongoDB

### Archivo .env
```env
# DEBUG: true OR false
DEBUG=false

# Mastodon API
MASTODON_CLIENT_KEY=<your-client-key>
MASTODON_CLIENT_SECRET=<your-client-secret>
MASTODON_ACCESS_TOKEN=<your-access-token>
MASTODON_API_URL=https://botsin.space

# LOCAL AIRPORT
AIRPORT_NAME=Vigo Peinador
AIRPORT_IATA=VGO

# MongoDB
DB_URI=<your-mongodb-uri>
DB_USER=<your-mongodb-user>
DB_PASSWORD=<your-mongodb-password>
```

