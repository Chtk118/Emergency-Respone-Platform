# 🚨 Emergency Response Coordination Platform

A full-stack web application designed to streamline the process of reporting, managing, and responding to emergencies. Built using the **MERN stack**, this platform offers real-time mapping, role-based dashboards, and a scalable backend connected to **MongoDB Atlas**.

---

## ⚙️ Tech Stack

| Layer       | Technology                            |
|-------------|----------------------------------------|
| Frontend    | React, React Router, Axios, Bootstrap, Leaflet.js |
| Backend     | Node.js, Express.js                   |
| Database    | MongoDB Atlas (Mongoose ODM)          |
| Maps        | Leaflet + OpenStreetMap               |
| Optional    | Firebase Authentication (for login)   |

---

## ✨ Features

- 📝 **Report Incidents**  
  Users can submit emergencies with type, location (via map click), and description.

- 🧑‍💼 **Admin Dashboard**  
  Admins can view all reports, filter by type, and visualize reports on an interactive map.

- 🚑 **Responder Dashboard**  
  Responders can view and respond to only their assigned incidents (Medical, Fire, Police).

- 📍 **Live Map Selection**  
  Map integration with Leaflet.js lets users mark exact locations.

- 💾 **REST API + MongoDB Atlas**  
  Incidents are saved via Express backend to MongoDB Atlas using Mongoose.

- 🔄 **Separation of Concerns**  
  Cleanly split frontend (`client/`) and backend (`server/`) for better maintainability.

---

## 🧑‍💻 Local Development Setup

### 🔃 Clone the Repository

```bash
git clone https://github.com/Chtk118/Emergency-Response-Platform.git
cd Emergency-Response-Platform
