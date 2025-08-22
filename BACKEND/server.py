import mysql.connector
from flask import Flask, jsonify
import os
from dotenv import load_dotenv

# Carga las variables de entorno del archivo .env
load_dotenv()

app = Flask(__name__)

# Configuración de la conexión a la base de datos
db_config = {
    'host': os.getenv("DB_HOST"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'database': os.getenv("DB_NAME")
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except mysql.connector.Error as err:
        print(f"Error de conexión a la base de datos: {err}")
        return None

@app.route('/health')
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == '__main__':
    app.run(debug=True)