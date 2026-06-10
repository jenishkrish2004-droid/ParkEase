# **Parkora**

![Parkora Banner](https://img.shields.io/badge/Parkora-Smart_Parking_%26_EV-d4af37?style=for-the-badge)

**Parkora** is a production-grade, full-stack parking marketplace platform that bridges the gap between vehicle owners and verified parking space providers. The platform seamlessly enables users to discover, compare, and book parking and EV charging spaces, while empowering property owners to monetize their inventory, track active bookings, and monitor revenue in real time.

Built with modern software engineering principles, **Parkora** prioritizes scalability, maintainability, and mobile-first responsiveness.

---

## **Overview**

Urban parking is a growing challenge characterized by limited availability, hidden costs, and inefficient use of existing infrastructure. **Parkora** solves this by delivering a centralized, intelligent ecosystem where:

* **Drivers** can instantly search, filter, and book verified parking and EV charging spaces.
* **Property Owners** can easily list and monetize their available parking real estate.
* **Administrators** securely verify users, hosts, and properties to maintain a trusted marketplace.
* **Developers** can scale the platform to mobile applications via a robust, shared API architecture.

---

## **Key Features**

### **For Users (Drivers)**
* **Seamless Authentication & KYC:** Secure registration, mobile verification, and identity checks.
* **Smart Discovery:** Advanced filtering by distance, vehicle type, and amenities.
* **Instant Booking & Payments:** Reserve slots in real-time with integrated, secure payment gateways.
* **Booking Management:** View active reservations, history, and receipts.
* **Community Trust:** Integrated rating, review, and complaint resolution systems.

### **For Property Owners (Hosts)**
* **Streamlined Onboarding:** Automated owner and property verification workflows.
* **Inventory Control:** Complete management over parking spaces, pricing, and availability.
* **Live Dashboard:** Monitor active occupancies, upcoming bookings, and daily revenue.
* **Analytics:** Comprehensive financial insights and utilization statistics.

### **For Administrators**
* **Platform Moderation:** Tools to verify users, approve property listings, and resolve disputes.
* **Ecosystem Analytics:** High-level metrics on platform growth, revenue, and active usage.

---

## **Advanced Filtering & Capabilities**

**Parkora** offers industry-leading search capabilities allowing users to combine multiple filters:

* **Vehicle Compatibility:** Car, Bike, Electric Vehicle (EV).
* **Security Standards:** CCTV, On-site Security/Watchman, Gated Access.
* **Infrastructure:** Covered Parking, Open Spaces, EV Charging Points, 24/7 Lighting.
* **Logistics:** Price Range, Proximity/Distance, Real-time Availability, User Ratings.

---

## **Technology Stack**

**Parkora** is built using a modern, scalable, and type-safe monorepo architecture.

### **Frontend (Client)**
* **React 19 & TypeScript:** For robust, component-driven UI development.
* **Vite:** High-performance frontend tooling and bundling.
* **Tailwind CSS:** Utility-first styling for a beautiful, responsive, dark-mode ready design.
* **React Hook Form & Zod:** Type-safe form validation.
* **TanStack Query (React Query):** Powerful asynchronous state management.

### **Backend (Server)**
* **Node.js & Express.js:** Fast, scalable API layer.
* **TypeScript:** End-to-end type safety sharing schemas with the frontend.
* **PostgreSQL & Prisma ORM:** Relational data modeling and type-safe database queries.
* **JWT & bcrypt:** Secure, stateless authentication.

### **Infrastructure & Third-Party**
* **Docker & Docker Compose:** Containerized, reproducible development environments.
* **Cloudinary:** Cloud-based image management for properties and profiles.
* **Leaflet & OpenStreetMap:** Interactive geolocation and mapping.
* **Razorpay:** Secure payment processing integration.

---

## **Project Architecture**

The repository utilizes a modular monorepo structure to ensure high cohesion and loose coupling.

```text
Parkora/
├── client/      # React Frontend (Vite)
├── server/      # Express Backend (Node.js)
├── shared/      # Shared TypeScript Types, Constants, and Zod Validators
├── docker/      # Docker configuration and orchestration
└── prisma/      # Database Schema and Migrations
```

---

## **Future Roadmap**

**Parkora** is designed with an **API-First** philosophy. Once the web platform reaches full production maturity, the ecosystem will expand to native mobile applications (iOS and Android). These mobile apps will seamlessly consume the existing backend APIs, ensuring perfect synchronization across all devices without requiring changes to core business logic.

---

## **Author**

Developed and maintained by **Jenish Krish**.

---

## **License**

This project is proprietary and currently under active development.
