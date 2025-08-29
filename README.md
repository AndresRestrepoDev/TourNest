# 🏨 TourNest

## 📖 Overview
**TourNest** is a comprehensive web platform designed to unify hotel and tour package management, offering a modern, centralized solution to the industry's current challenges.

In many small and medium-sized hotels, room management and tour sales are often handled separately, usually with manual records. This can lead to **overbooking, loss of information, inefficiency in promotions, and difficulties with financial reporting**.

With TourNest, both hotels and travel agencies will be able to manage **rooms, reservations, tour packages, and payments** from a single system, with **real-time availability** and differentiated access for **administrators, receptionists, and guests**.

The system also integrates **Artificial Intelligence tools**, such as:
- Personalized package recommendations  
- Occupancy prediction for dynamic pricing  
- A customer service chatbot  
- Automatic tourism trend reports  

---

## 🎯 Target Audience
- Small and medium-sized hotels  
- Local travel agencies  
- Travelers looking for a convenient and reliable experience to book accommodations and tours in one place  

---

## 🚀 MVP Features
- **Administrator**: Manage rooms, tour packages, payments, and basic reports.  
- **Customer**: Register, check availability, book rooms, choose packages, and track payments.  
- **AI-powered features**: Basic chatbot and initial package recommendations.  

---

## 🛠️ Technologies Used
- **Python (Flask)** → Backend  
- **MySQL** → Database  
- **JavaScript (ES6)** → Services  
- **HTML5 & CSS3** → Frontend  

---

## 📂 Project Structure

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

---

# 🖥️ Backend Setup (Flask + MySQL)

### ✅ Requirements
- Python **3.10+**  
- MySQL installed and running  
- Git  

---

### ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AndresRestrepoDev/TourNest.git

2. **Create a virtual environment inside the BACKEND folder**

    cd BACKEND
    python3 -m venv venv

    > **Note:**  
    > To activate the virtual environment:
    > - **Linux/macOS:**  
    >   ```
    >   source venv/bin/activate
    >   ```
    > - **Windows:**  
    >   ```
    >   .\venv\Scripts\activate
    >   ```

3. **Install dependencies**

    pip install -r requirements.txt

4. **Configure environment variables**

Create a .env file inside the BACKEND folder with your database credentials:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password  -> **Important** 
    DB_NAME=TourNest

5. **Run the server**

    python server.py

🔑 Default Login Credentials

Use the following test accounts to access the system:

👥 Users

| Email                                           | Password |
| ----------------------------------------------- | -------- |
| [rojo@example.com](mailto:rojo@example.com)     | pass123  |
| [jero@example.com](mailto:jero@example.com)     | pass123  |
| [andres@example.com](mailto:andres@example.com) | pass123  |
| [stiven@example.com](mailto:stiven@example.com) | pass123  |

🏢 Owners (Agencies & Hotels)

| Email                                                 | Password |
| ----------------------------------------------------- | -------- |
| [aviatur@example.com](mailto:aviatur@example.com)     | pass123  |
| [despegar@example.com](mailto:despegar@example.com)   | pass123  |
| [decamerun@example.com](mailto:decamerun@example.com) | pass123  |
| [coloTours@example.com](mailto:coloTours@example.com) | pass123  |

👑 CEO (Admin Access)

| Email                                           | Password |
| ----------------------------------------------- | -------- |
| [admin@tournest.com](mailto:admin@tournest.com) | admin123 |


👨‍💻 Team Credits

Stiven Hidalgo – Product Owner & Frontend Support

Andrés Restrepo – SCRUM Master & Backend Support

Geronimo Cardona – Backend Developer

Yancelly Rojas – Frontend Developer

✅ With this setup, you can run TourNest locally, connect to the database, and log in using the provided test credentials.
