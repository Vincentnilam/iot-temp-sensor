import time
import board
import adafruit_dht
import requests

API_URL = ""
API_KEY = ""
READ_INTERVAL_SECONDS = 300

dht = adafruit_dht.DHT22(board.D4)

while True:
    try:
        temperature = dht.temperature
        humidity = dht.humidity

        if temperature is None or humidity is None:
            print("Failed to get sensor reading")
            time.sleep(2)
            continue

        payload = {
            "temperature": round(float(temperature), 2),
            "humidity": round(float(humidity), 2)
        }

        response = requests.post(
            API_URL,
            json=payload,
            headers={"x-api-key": API_KEY},
            timeout=15
        )

        print("Sent:", payload)
        print("Status:", response.status_code, response.text)

    except RuntimeError as e:
        print("Sensor read error:", e)
    except requests.RequestException as e:
        print("HTTP error:", e)
    except Exception:
        dht.exit()
        raise

    time.sleep(READ_INTERVAL_SECONDS)