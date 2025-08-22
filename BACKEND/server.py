import mysql.connector  # Para la conexión a MySQL
from flask import Flask, request, jsonify # Para crear la API y manejar respuestas JSON
import os  # Para manejar variables de entorno
from dotenv import load_dotenv # Para cargar variables de entorno desde un archivo .env

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

def get_db_connection():  # Función para obtener una conexión a la base de datos
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except mysql.connector.Error as err:
        print(f"Error de conexión a la base de datos: {err}")
        return None # Retorna None si hay un error de conexión

@app.route('/health') # Ruta para verificar el estado de la API
def health():
    return jsonify({"status": "ok"}), 200  # Respuesta JSON indicando que la API está funcionando


#CRUD para la tabla 'users'

@app.route('/users', methods=['GET'])
def get_users():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()

    cursor.close()
    connection.close()
    return jsonify(users)

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = """
        INSERT INTO users (name, email, password, document, date_birth, phone)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (data['name'], data['email'], data['password'], data['document'], data['date_birth'], data.get('phone'))

    cursor.execute(sql, values)
    connection.commit()

    new_id = cursor.lastrowid
    cursor.close()
    connection.close()

    return jsonify({"message": "User created", "id": new_id}), 201

@app.route('/users/<int:id_user>', methods=['PUT'])
def update_user(id_user):
    data = request.json
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = """
        UPDATE users SET name=%s, email=%s, password=%s, document=%s, date_birth=%s, phone=%s
        WHERE id_user=%s
    """
    values = (data['name'], data['email'], data['password'], data['document'], data['date_birth'], data.get('phone'), id_user)

    cursor.execute(sql, values)
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"message": "User updated"})

@app.route('/users/<int:id_user>', methods=['DELETE'])
def delete_user(id_user):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM users WHERE id_user = %s", (id_user,))
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"message": "User deleted"})


if __name__ == '__main__': # Ejecuta la aplicación Flask
    app.run(debug=True) # Modo debug para desarrollo