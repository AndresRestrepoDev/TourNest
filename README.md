# TourNest

## Overview
TourNest is a comprehensive web platform designed to unify hotel and tour package management, offering a modern, centralized solution to the industry's current challenges.

In most small and medium-sized hotels, room management and tour sales are handled separately, often with manual records. This leads to overbooking, loss of information, inefficiency in promotions, and difficulties with financial reporting.

With TourNest, both hotels and travel agencies will be able to manage rooms, reservations, tour packages, and payments from a single system, with real-time availability and differentiated access for administrators, receptionists, and guests.

The system will also incorporate Artificial Intelligence tools, such as personalized package recommendations, occupancy prediction for dynamic pricing management, a customer service chatbot, and automatic reporting on tourism trends.

Its target audience includes small and medium-sized hotels, local travel agencies, and traveling clients looking for a convenient and reliable experience when booking accommodations and tours in one place.

In its MVP (Minimum Viable Product), TourNest will allow:

Administrator: manage rooms, tour packages, basic payments, and simple reporting.

Customer: register, check availability, book rooms, select packages, and review payment status.

AI-powered extras: a basic chatbot and initial package recommendations.

With this approach, TourNest aims to become an innovative and scalable solution that not only optimizes hotel and tourism management but also improves the customer experience and increases the competitiveness of local hotels and agencies.

## Technologies used

- Python for the backend
- JavaScript for services
- HTML5 & CSS for the frontend

## Credits

- Stiven Higaldo (Product Owner and front-end support)
- Andres Restrepo (SCRUM master and back-end support)
- Geronimo Cardona (Back-end developer)
- Yancelly Rojas (Front-end developer)

## Project Structure

```
TourNest/
├── 📁 DOCUMENTATION    
│   ├── 📁 Weekly_Documentation/     
│   │   ├── 📄 Week1.txt           
│   │   ├── 📄 Week2.txt           
│   │   └── 📄 Week3.txt   
│   ├── 📄 Project_Approach.txt
│   ├── 📄 PixelPioneers_Technical_Document.txt 
│   └── 📄 EvidencesSCRUM.txt           
├── 📁 DATA
│   ├── 📄 Commands.sql
│   ├── 📄 ModeloER
│   └── 📄 Diagramam 
├── 📁 FRONTEND       
│   ├── 📄 index.html              
│   ├── 📄 index.js                           
│   └── 📄 services.js            
├── 📁 BACKEND
│   ├── 📄 .env                           
│   └── 📄 server.py
└── 📄 README.md                 
```

# 🏨 TourNest Backend

Backend del proyecto **TourNest**, un sistema para gestionar hoteles, habitaciones, actividades y reservas turísticas.  
Este backend está hecho en **Python (Flask)** con conexión a **MySQL**.

---

## 🚀 Requisitos previos
- Python 3.10 o superior
- MySQL instalado y corriendo
- Git instalado

---

## 📦 Instalación del proyecto

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/AndresRestrepoDev/TourNest.git

2. **Crear un entorno virtual**

    python3 -m venv venv
    source venv/bin/activate

3. **Instalar dependencias**

    pip install -r requirements.txt

4. **Configurar variables de entorno**

    Crear un archivo .env en la raíz del proyecto con tus credenciales:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=tu_password
    DB_NAME=TourNest
    
    Ejecutar el servidor -> python server.py

