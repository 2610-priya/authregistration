# Full-Stack Authentication & Registration System

A premium, production-ready Full-Stack User Authentication and Registration system. Built with a high-performance **Java Spring Boot** backend and a modern glassmorphic responsive **Vanilla HTML/CSS/JavaScript** frontend. Communicates statelessly using cryptographically secure **JSON Web Tokens (JWT)** and hashes passwords securely using **BCrypt**.

---

## 📂 Project Structure

```text
authregistration/
├── backend/                  # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/authregistration/
│   │   │   │   ├── config/       # Spring Security & CORS rules
│   │   │   │   ├── controller/   # REST Endpoints
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   ├── entity/       # JPA Database Entities
│   │   │   │   ├── exception/    # Controller exception handlers
│   │   │   │   ├── repository/   # JPA Repositories
│   │   │   │   ├── security/     # JWT Token Filters & Providers
│   │   │   │   └── service/      # Business logic controllers
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml               # Maven configuration
├── frontend/                 # Static web application client
│   ├── css/
│   │   └── style.css         # Custom premium stylesheet
│   ├── js/
│   │   ├── config.js         # Dynamic environment switcher
│   │   └── auth.js           # Validations, APIs, and Storage
│   ├── index.html            # Landing Page
│   ├── login.html            # Sign In form
│   ├── register.html         # Sign Up form
│   └── profile.html          # User Dashboard
├── database.sql              # Database setup script
└── README.md                 # Deployment & Setup guide
```

---

## 🚀 Quick Local Setup

### 1. Database Setup
1. Open your MySQL client (CLI, Workbench, phpMyAdmin, DBeaver).
2. Execute the commands inside the [database.sql](file:///c:/Users/rath7/Desktop/authregistration/database.sql) script:
   ```sql
   CREATE DATABASE IF NOT EXISTS login_system;
   USE login_system;
   -- Creates users table and inserts a sample user
   ```

### 2. Run Backend (Spring Boot)
#### IntelliJ IDEA or Eclipse:
1. Import the `backend` folder as a **Maven Project**.
2. Update database credentials in [application.properties](file:///c:/Users/rath7/Desktop/authregistration/backend/src/main/resources/application.properties) if your local MySQL root password is not blank:
   ```properties
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Run the class `com.example.authregistration.AuthRegistrationApplication`.
4. The server starts on port `8080`. Verify status at `http://localhost:8080/api/health`.

### 3. Run Frontend
1. Simply double-click [index.html](file:///c:/Users/rath7/Desktop/authregistration/frontend/index.html) or run a local dev server (e.g., Live Server extension in VS Code).
2. The dynamic client config in [config.js](file:///c:/Users/rath7/Desktop/authregistration/frontend/js/config.js) automatically targets the backend at `http://localhost:8080` when running locally.

---

## 🛠️ Production Cloud Deployment Guide

Follow these steps to deploy the application for production access:

### Step 1: Deploy MySQL Database on Aiven or Railway
1. **Aiven Console**: Register/Sign in to [Aiven](https://aiven.io/).
2. **Create Service**: Spin up a free-tier MySQL instance named `login-system-mysql`.
3. **Database Credentials**: Retrieve the Connection URI, Host, Port, Username, and Password.
4. **Database Migration**: Run the queries in `database.sql` against the new Aiven MySQL database to construct the schema.

---

### Step 2: Deploy Spring Boot Backend on Render
1. Sign in to [Render](https://render.com/).
2. Create a new **Web Service** and link it to your GitHub repository.
3. Configure the following service settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests` (or maven build if wrapper is available, otherwise default maven toolchain)
   - **Start Command**: `java -jar target/authregistration-0.0.1-SNAPSHOT.jar`
4. Add the following **Environment Variables** in Render settings under "Environment":
   
   | Variable | Value (Example) | Description |
   | :--- | :--- | :--- |
   | `DB_HOST` | `mysql-xxxx-aiven.aivencloud.com` | Hostname of your Aiven DB |
   | `DB_PORT` | `12345` | Connection port of your Aiven DB |
   | `DB_NAME` | `login_system` | Name of your database |
   | `DB_USER` | `avnadmin` | Aiven DB Username |
   | `DB_PASSWORD`| `your_password_here` | Aiven DB Password |
   | `JWT_SECRET` | `32_character_long_secret_hash_here_for_prod` | Custom secret for signing tokens |

5. Deploy the web service. Copy the generated Web Service URL (e.g., `https://auth-api-xxxx.onrender.com`).

---

### Step 3: Deploy Frontend on Vercel
1. Sign in to [Vercel](https://vercel.com/).
2. Create a new project, connect your GitHub repository, and select `frontend` as the **Root Directory**.
3. Deploy! No custom environment variables or build commands are needed for static deployment.
4. Vercel will generate your live client URL (e.g., `https://auth-client.vercel.app`).

---

### Step 4: Link Frontend and Backend (Production Update)
1. Open [config.js](file:///c:/Users/rath7/Desktop/authregistration/frontend/js/config.js).
2. Update the `PRODUCTION_API_URL` to match your deployed Render URL:
   ```javascript
   PRODUCTION_API_URL: "https://your-backend-url.onrender.com",
   ```
3. Commit and push the updates. Vercel will rebuild automatically, and all endpoints will use HTTPS.

---

## 🔒 Security Configuration
- **BCrypt Password Encoder**: Passwords are saved hashed using standard salt vectors in the database.
- **JWT Authentication**: Auth state is stateless; the backend generates a cryptographically signed token valid for 24 hours. The client sends this token in the `Authorization: Bearer <token>` header.
- **CORS Setup**: Fully supports cross-origin sharing for your Vercel domains, and automatically allows incoming Preflight request methods (`OPTIONS`, `GET`, `POST`).

---

## 🧪 Testing Credentials
You can log in locally or in production using the pre-inserted seed user credentials:
- **Email**: `john.doe@example.com`
- **Password**: `password123`
