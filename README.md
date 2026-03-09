# IoT Temperature Sensor

A full-stack room temperature and humidity monitor using a Raspberry Pi 5 and DHT22 sensor. Readings are sent to a REST API and displayed on a live dashboard.

## Stack

- **Hardware:** Raspberry Pi 5, DHT22 sensor (GPIO4)
- **Pi script:** Python (`temp-reader.py`) — reads sensor every 5 minutes and POSTs to the API. Runs only on the Raspberry Pi as a systemd service.
- **Backend:** Node.js + Express, Prisma ORM, MongoDB
- **Frontend:** React + Vite + Recharts + Tailwind CSS

## Project Structure

```
├── temp-reader.py        # Raspberry Pi only — runs as a systemd service
├── server/               # Express API
│   ├── routes/
│   │   └── temperature.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── app.js
│   └── .env.example
└── client/               # React dashboard
    └── src/
        ├── App.jsx
        └── components/
            ├── StatCard.jsx
            └── TempHumidityChart.jsx
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/temperature` | Submit a reading (requires `x-api-key` header) |
| `GET` | `/api/temperature/latest` | Get the most recent reading |
| `GET` | `/api/temperature?page=1&limit=20` | Get paginated history |

## Setup

### Server

```bash
cd server
cp .env.example .env   # fill in your values
npm install
npx prisma generate
npm start
```

### Client

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```
VITE_API_URL=https://your-api.up.railway.app
```

Then run:

```bash
npm run dev
```

### Pi — `temp-reader.py` (Raspberry Pi only)

> This script is intended to run only on the Raspberry Pi. Do not run it on your dev machine.

1. Copy `temp-reader.py` to your Pi
2. Install dependencies:
   ```bash
   pip install adafruit-circuitpython-dht requests
   ```
3. Set `API_URL` and `API_KEY` at the top of `temp-reader.py`
4. Create a systemd service for auto-start on boot:

   ```bash
   sudo nano /etc/systemd/system/temp-reader.service
   ```

   Paste the following:

   ```ini
   [Unit]
   Description=DHT22 Temperature Reader
   After=network.target

   [Service]
   ExecStart=/usr/bin/python3 /home/pi/temp-reader.py
   Restart=always
   RestartSec=10
   User=pi

   [Install]
   WantedBy=multi-user.target
   ```

5. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable temp-reader
   sudo systemctl start temp-reader
   ```

6. Check the logs:
   ```bash
   sudo journalctl -u temp-reader -f
   ```

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB connection string |
| `PORT` | Server port (default: 5000) |
| `FRONTEND_URL` | Allowed CORS origin |
| `PI_SECRET` | API key expected in `x-api-key` header |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL used by the Vite dev proxy |
