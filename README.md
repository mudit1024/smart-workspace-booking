# Smart Workspace Booking System

A full-stack workspace booking platform built using React, Spring Boot microservices, and PostgreSQL.

The application allows users to discover, search, and book workspaces through a responsive and scalable web interface.

---

# Features

* User Authentication with JWT
* Workspace Discovery & Booking
* Search & Filtering
* Responsive Dashboard UI
* Microservice-Based Architecture
* Production Deployment

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS

## Backend

* Spring Boot
* Spring Security
* JWT Authentication

## Database

* PostgreSQL (Neon DB)

## Deployment

* Vercel (Frontend)
* Render (Backend Services)

---

# Architecture

The project follows a microservice-based architecture:

* auth-service
  Handles authentication and JWT-based authorization.

* workspace-service
  Manages workspace operations, bookings, and search/filter functionality.

---

# Project Structure

```bash
smart-workspace-booking/
│
├── workspace-frontend
├── auth-service//auth-service
├── workspace-service/
└── README.md
```

---

# Live Demo

Frontend Application:
https://smart-workspace-booking.vercel.app/

---

# API Services

Auth Service:
https://auth-service-ws.onrender.com

Workspace Service:
https://smart-workspace-booking.onrender.com

---

# Installation & Setup

## Clone Repository

```bash
git clone [YOUR_GITHUB_REPO]
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Backend Setup

### Auth Service

```bash
cd auth-service
./mvnw spring-boot:run
```

### Workspace Service

```bash
cd workspace-service
./mvnw spring-boot:run
```

---

# Environment Variables

## Frontend (.env)

```env
VITE_AUTH_API_URL=
VITE_WORKSPACE_API_URL=
```

## Backend (application.yml)

Configure:

* PostgreSQL Database URL
* Username & Password
* JWT Secret
* CORS Origins

---

# Future Improvements

* API Gateway Integration
* Role-Based Access Control
* Booking History
* Email Notifications
* Docker Deployment
* CI/CD Pipeline

---

# Learning Outcomes

This project helped me gain practical experience in:

* Full-stack application development
* Microservice architecture
* REST API design
* Authentication & authorization
* Deployment & production debugging
* Environment configuration management

---

# Author

Mudit Bhatnagar

LinkedIn: www.linkedin.com/in/mudit-bhatnagar-55145a14a
