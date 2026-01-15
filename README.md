# 🚀 FinAI - Sistema de Gestión Financiera Inteligente

![Microservices Architecture](https://img.shields.io/badge/Architecture-Microservices-orange?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

**FinAI** es una plataforma de gestión financiera avanzada construida bajo una arquitectura de microservicios. El sistema permite la gestión de usuarios, autenticación segura y una infraestructura de pagos escalable, diseñada para operar en entornos contenedorizados.

---

## 🏗️ Arquitectura y Funcionamiento

El ecosistema se divide en servicios especializados que se comunican de forma asíncrona y segura:

1.  **API Gateway (Node.js & Express):**
    * Gestiona el flujo de registro e inicio de sesión.
    * Implementa seguridad mediante **JWT (JSON Web Tokens)**.
    * Actúa como orquestador, sincronizando la creación de usuarios con el módulo de pagos.

2.  **Payment Service (Java 17 & Spring Boot 3):**
    * Administra la lógica de suscripciones y planes (FREE, PREMIUM, ULTIMATE).
    * Utiliza **Spring Data JPA** para la persistencia de perfiles financieros.
    * Garantiza la integridad de los datos de facturación desde la inicialización.

3.  **Persistencia (MySQL):**
    * Bases de datos relacionales independientes para asegurar el aislamiento de los datos (*Database per Service*).

---

## 🛠️ Stack Tecnológico

### **Backend - Gateway**
* **Runtime:** Node.js v18+
* **Framework:** Express.js
* **Comunicación:** Axios (Comunicación Inter-Servicios)
* **Seguridad:** Bcrypt para hashing de contraseñas.

### **Backend - Payments**
* **Framework:** Spring Boot 3.x
* **ORM:** Hibernate / JPA
* **Serialización:** Jackson para manejo de DTOs.
* **Server:** Embedded Tomcat 11.

### **Infraestructura & DevOps**
* **Orquestación:** Docker & Docker Compose.
* **Redes:** Virtual Bridge Networks para aislamiento de contenedores.
* **Configuración:** Gestión de secretos mediante variables de entorno (.env).

---

## 🚀 Desafíos Técnicos Superados

Durante el desarrollo, se resolvieron retos críticos de ingeniería:
* **Interoperabilidad:** Sincronización de tipos de datos entre JavaScript (Tipado dinámico) y Java (Tipado fuerte).
* **Networking en Docker:** Implementación de resolución de nombres DNS interna evitando caracteres no válidos (RFC 1035) para asegurar la comunicación entre contenedores.
* **Persistencia Robusta:** Configuración de pools de conexión eficientes para evitar latencia en el inicio de los servicios.

---

## 🔧 Instalación Rápida

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/finai-microservices.git](https://github.com/tu-usuario/finai-microservices.git)
    cd finai-microservices
    ```

2.  **Configurar Entorno:**
    Crea un archivo `.env` basado en el ejemplo proporcionado con tus credenciales de base de datos.

3.  **Desplegar con Docker:**
    ```bash
    docker-compose up --build
    ```

*La aplicación estará disponible en `http://localhost:3000`.*

---

## 👨‍💻 Autor
**Natalia Triana**
Desarrollador Backend / Estudiante de Ingeniería

---
© 2026 FinAI Project - Arquitecturas Escalables.
