import serial
import requests
import time

# ⚠️ CHANGE THIS to your ESP32's COM port (e.g., 'COM3')
COM_PORT = 'COM5'
BAUD_RATE = 115200

BACKEND_URL = "http://127.0.0.1:5005/predict"

def main():
    try:
        ser = serial.Serial(COM_PORT, BAUD_RATE, timeout=1)
        print(f"[OK] Successfully connected to ESP32 on {COM_PORT}")
        print("Waiting for FPGA sensor data...\n")

        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                
                # Ignore empty lines or debug messages
                if not line or line.startswith("ESP") or line.startswith("Wifi"):
                    continue
                
                print(f"[IN] Received raw data: {line}")
                
                # Expecting comma-separated values: 
                # moisture, temperature, humidity, ph, electrical_conductivity, n, p, k
                try:
                    # Split by comma (if separated by spaces, change ',' to ' ')
                    values = [float(val.strip()) for val in line.split(',')]
                    
                    if len(values) >= 8:
                        moisture = values[0]
                        temperature = values[1]
                        humidity = values[2]
                        ph = values[3]
                        ec = values[4] # We read it, but the ML model doesn't use it right now
                        n = values[5]
                        p = values[6]
                        k = values[7]
                        
                        # Build the JSON payload expected by the backend
                        # Note: We omit rainfall so the backend auto-generates it, 
                        # or you can set a default like 'rainfall': 100
                        sensor_data = {
                            "n": n,
                            "p": p,
                            "k": k,
                            "ph": ph,
                            "moisture": moisture,
                            "temperature": temperature,
                            "humidity": humidity
                        }
                        
                        print(f"[OUT] Formatted JSON: {sensor_data}")
                        
                        # Send to the local Node.js backend
                        response = requests.post(BACKEND_URL, json=sensor_data)
                        
                        if response.status_code == 200:
                            print("[OK] AI Prediction:", response.json()['recommended_crops'])
                        else:
                            print("[ERROR] Backend Error:", response.status_code)
                    else:
                        print(f"[WARN] Warning: Expected at least 8 values, got {len(values)}. Ignoring line.")
                        
                except ValueError:
                    # This catches lines that aren't numbers (like "Starting up...")
                    pass
                except requests.exceptions.ConnectionError:
                    print("[ERROR] Could not connect to backend. Is the Node.js server running on port 5005?")
                
                print("-" * 50)
            
            time.sleep(0.1)

    except serial.SerialException:
        print(f"[ERROR] Error: Could not open {COM_PORT}. Is the cable connected? Is the Arduino IDE Serial Monitor closed?")
    except KeyboardInterrupt:
        print("\nExiting bridge...")
        if 'ser' in locals() and ser.is_open:
            ser.close()

if __name__ == "__main__":
    main()
