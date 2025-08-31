import mysql.connector  # For MySQL connection
from flask import Flask, request, jsonify # For API creation and JSON responses
import os  # For environment variables
from dotenv import load_dotenv # To load environment variables from .env file
from flask_cors import CORS # Import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS

# Database connection configuration
db_config = {
    'host': os.getenv("DB_HOST"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'database': os.getenv("DB_NAME"),
    'port': int(os.getenv("DB_PORT", 5000)),
    'autocommit': True   # Very important to avoid locks
}

def get_db_connection():  # Function to get a database connection
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        return None # Returns None if there is a connection error

@app.route('/health')
def health():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT NOW();")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({
            "status": "ok",
            "db_connected": True,
            "db_time": str(result[0])
        }), 200
    else:
        return jsonify({
            "status": "fail",
            "db_connected": False
        }), 500

############## Route for login validation ##############
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Validate CEO
    sql_ceo = "SELECT * FROM ceo WHERE email=%s AND password=%s"
    cursor.execute(sql_ceo, (email, password))
    ceo = cursor.fetchone()
    if ceo:
        cursor.close()
        connection.close()
        return jsonify({"role": "ceo", "id": ceo["id_ceo"], "message": "Welcome CEO"}), 200

    # Validate Owner
    sql_owner = "SELECT * FROM owners WHERE email=%s AND password=%s"
    cursor.execute(sql_owner, (email, password))
    owner = cursor.fetchone()
    if owner:
        cursor.close()
        connection.close()
        return jsonify({"role": "owner", "id": owner["id_owner"], "name": owner["name"], "message": "Welcome Owner"}), 200

    # Validate User
    sql_user = "SELECT * FROM users WHERE email=%s AND password=%s"
    cursor.execute(sql_user, (email, password))
    user = cursor.fetchone()        
    if user:                            
        cursor.close()
        connection.close()
        return jsonify({"role": "user", "id": user["id_user"], "name": user["name"], "message": "Welcome User"}), 200

    # If nothing found
    cursor.close()
    connection.close()
    return jsonify({"message": "Incorrect email or password"}), 401

# CRUD for 'users' table

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
    role = "user"  # default role

    sql = """
        INSERT INTO users (name, email, password, document, date_birth, phone, role)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    # Add 'role' variable to the tuple of values
    values = (data['name'], data['email'], data['password'], data['document'], data['date_birth'], data.get('phone'), role)

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

# CRUD for 'owners' table

@app.route('/owners', methods=['POST'])
def create_owner():
    data = request.json
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO owners (name, email, password, nit, date_birth, phone)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            data['name'],
            data['email'],
            data['password'],
            data['nit'],
            data['date_birth'],
            data.get('phone')
        )

        cursor.execute(query, values)
        connection.commit()

        return jsonify({"message": "Owner created successfully", "id_owner": cursor.lastrowid}), 201

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/owners', methods=['GET'])
def get_owners():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM owners")
    owners = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(owners)

@app.route('/owners/<int:id_owner>', methods=['PUT'])
def update_owner(id_owner):
    data = request.json
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            UPDATE owners
            SET name=%s, email=%s, password=%s, nit=%s, date_birth=%s, phone=%s
            WHERE id_owner=%s
        """
        values = (
            data['name'],
            data['email'],
            data['password'],
            data['nit'],
            data['date_birth'],
            data.get('phone'),
            id_owner
        )

        cursor.execute(query, values)
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Owner not found"}), 404

        return jsonify({"message": "Owner updated successfully"}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/owners/<int:id_owner>', methods=['DELETE'])
def delete_owner(id_owner):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("DELETE FROM owners WHERE id_owner = %s", (id_owner,))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Owner not found"}), 404

        return jsonify({"message": "Owner deleted successfully"}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

# CRUD for 'hotels' table

@app.route('/hotels', methods=['POST'])
def create_hotel():
    data = request.json
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO hotels (id_owner, name, description, city, rating_average, img_url)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data['id_owner'],
        data['name'],
        data.get('description'),
        data['city'],
        data.get('rating_average', 0),
        data.get('img_url')
    ))
    connection.commit()

    new_id = cursor.lastrowid
    cursor.close()
    connection.close()
    return jsonify({"message": "Hotel created successfully"}), 201

@app.route('/hotels', methods=['GET'])
def get_hotels():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM hotels")
    hotels = cursor.fetchall()

    cursor.close()
    connection.close()
    return jsonify(hotels)

@app.route('/hotels/<int:id_hotel>', methods=['PUT'])
def update_hotel(id_hotel):
    data = request.json
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE hotels
        SET name=%s, description=%s, city=%s, rating_average=%s, img_url=%s
        WHERE id_hotel=%s
    """, (
        data['name'],
        data.get('description'),
        data['city'],
        data.get('rating_average', 0),
        data.get('img_url'),
        id_hotel
    ))
    connection.commit()

    cursor.close()
    connection.close()
    return jsonify({'message': 'Hotel updated'})

@app.route('/hotels/<int:id_hotel>', methods=['DELETE'])
def delete_hotel(id_hotel):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM hotels WHERE id_hotel = %s", (id_hotel,))
    connection.commit()

    cursor.close()
    connection.close()
    return jsonify({'message': 'Hotel deleted (rooms also deleted by cascade)'})

# CRUD for 'rooms' table

@app.route('/rooms', methods=['GET'])
def get_rooms():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM rooms")
    rooms = cursor.fetchall()

    cursor.close()
    connection.close()
    return jsonify(rooms)

@app.route('/rooms', methods=['POST'])
def create_room():
    new_room = request.json
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = """
        INSERT INTO rooms (id_hotel, capacity, price, img_url, number_room, state)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (
        new_room["id_hotel"],
        new_room["capacity"],
        new_room["price"],
        new_room.get("img_url"),
        new_room["number_room"],
        new_room.get("state", "available")
    )

    cursor.execute(sql, values)
    connection.commit()
    room_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return jsonify({"id_room": room_id, **new_room}), 201

@app.route('/rooms/<int:id_room>', methods=['PUT'])
def update_room(id_room):
    updated_room = request.json
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = """
        UPDATE rooms
        SET id_hotel=%s, capacity=%s, price=%s, img_url=%s, number_room=%s, state=%s
        WHERE id_room=%s
    """
    values = (
        updated_room["id_hotel"],
        updated_room["capacity"],
        updated_room["price"],
        updated_room.get("img_url"),
        updated_room["number_room"],
        updated_room.get("state", "available"),
        id_room
    )

    cursor.execute(sql, values)
    connection.commit()

    cursor.close()
    connection.close()

    if cursor.rowcount == 0:
        return jsonify({"message": "Room not found"}), 404

    return jsonify({"id_room": id_room, **updated_room})

@app.route('/rooms/<int:id_room>', methods=['DELETE'])
def delete_room(id_room):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM rooms WHERE id_room = %s", (id_room,))
    connection.commit()

    cursor.close()
    connection.close()

    if cursor.rowcount == 0:
        return jsonify({"message": "Room not found"}), 404

    return jsonify({"message": f"Room {id_room} deleted"})

# CRUD for 'activitys' table

@app.route('/activitys', methods=['POST'])
def create_activity():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """INSERT INTO activitys (id_owner, name, description, price, duration, img_url, place, quota_available)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    values = (data['id_owner'], data['name'], data.get('description'),
              data['price'], data.get('duration'), data.get('img_url'),
              data.get('place'), data['quota_available'])
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Activity created successfully"}), 201

@app.route('/activitys', methods=['GET'])
def get_activitys():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM activitys")
    activitys = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(activitys)

@app.route('/activitys/<int:id_activity>', methods=['PUT'])
def update_activity(id_activity):
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """UPDATE activitys
             SET id_owner=%s, name=%s, description=%s, price=%s, duration=%s, img_url=%s, place=%s, quota_available=%s
             WHERE id_activity=%s"""
    values = (data['id_owner'], data['name'], data.get('description'),
              data['price'], data.get('duration'), data.get('img_url'),
              data.get('place'), data['quota_available'], id_activity)
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Activity updated successfully"})

@app.route('/activitys/<int:id_activity>', methods=['DELETE'])
def delete_activity(id_activity):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM activitys WHERE id_activity = %s", (id_activity,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Activity deleted successfully"})

# Route to get hotels by owner
@app.route("/hotels/owner/<int:owner_id>", methods=["GET"])
def get_hotels_by_owner(owner_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    sql = "SELECT * FROM hotels WHERE id_owner = %s"
    cursor.execute(sql, (owner_id,))
    hotels = cursor.fetchall()

    cursor.close()
    connection.close()
    return jsonify(hotels)

# Route to get activities by owner
@app.route('/activitys/owner/<int:id_owner>', methods=['GET'])
def get_activities_by_owner(id_owner):
    try:
        connection = get_db_connection()  # uses the function that works for hotels
        cursor = connection.cursor(dictionary=True)

        sql = "SELECT * FROM activitys WHERE id_owner = %s"
        cursor.execute(sql, (id_owner,))
        activities = cursor.fetchall()

        cursor.close()
        connection.close()
        return jsonify(activities)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/rooms/hotel/<int:hotel_id>", methods=["GET"])
def get_rooms_by_hotel(hotel_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM rooms WHERE id_hotel = %s", (hotel_id,))
        rooms = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(rooms)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__': # Run the Flask application
    port = int(os.getenv("PORT", 5000))   # Puerto dinámico (Render) o 5000 (local)
    app.run(host='0.0.0.0', debug=False) # Debug