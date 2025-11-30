# Freelancer Toolkit Backend (Flask + MongoDB)

This is the complete backend solution for the Freelancer Toolkit frontend application, built with Flask, MongoDB, and integrated with various external services as requested.

## Features Implemented

*   **Authentication (JWT):** Signup, Login, Refresh Token, Forgot/Reset Password (placeholder).
*   **Data Modules (CRUD):** Clients, Projects, Milestones, Invoices, Invoice Items, Documents, Calendar Events.
*   **External Service Integrations:**
    *   **MongoDB Atlas:** Primary database for all application data.
    *   **Cloudinary:** File storage for logos and generated PDFs.
    *   **Stripe API:** Payment link generation and webhook handling for payment status updates.
    *   **OpenAI API:** AI document drafting (Proposals, Contracts, etc.).
    *   **Google Calendar API:** Auto-sync for project milestones and calendar events (placeholder for OAuth flow).
    *   **Gmail API:** Invoice emailing and overdue reminders (placeholder for OAuth flow).
*   **Scheduled Jobs:** Daily cron job (via APScheduler) to check for and send overdue invoice reminders.
*   **Dashboard & Analytics:** API route for fetching key summary statistics and revenue chart data.
*   **Notifications:** System for storing and fetching user notifications.
*   **Admin Dashboard:** Basic routes for system-wide statistics and user management.

## Project Structure

```
freelancer-toolkit-backend/
├── app.py                  # Main Flask application entry point
├── config.py               # Configuration class for environment variables
├── requirements.txt        # Python dependencies
├── .env.example            # Example environment variables file
├── controllers/            # Business logic and request handling
│   ├── auth_controller.py
│   ├── client_controller.py
│   ├── project_controller.py
│   ├── invoice_controller.py
│   ├── document_controller.py
│   ├── dashboard_controller.py
│   ├── notification_controller.py
│   ├── calendar_controller.py
│   └── admin_controller.py
├── models/                 # MongoDB data models (schemas)
│   ├── user_model.py
│   ├── client_model.py
│   ├── project_model.py
│   ├── invoice_model.py
│   ├── document_model.py
│   ├── event_model.py
│   ├── notification_model.py
│   └── email_log_model.py
├── routes/                 # Flask Blueprints (API endpoints)
│   ├── auth_routes.py
│   ├── client_routes.py
│   ├── project_routes.py
│   ├── invoice_routes.py
│   ├── payment_routes.py
│   ├── document_routes.py
│   ├── dashboard_routes.py
│   ├── notification_routes.py
│   ├── calendar_routes.py
│   ├── settings_routes.py
│   └── admin_routes.py
├── services/               # External API integration logic
│   ├── cloudinary_service.py
│   ├── stripe_service.py
│   ├── openai_service.py
│   ├── google_calendar_service.py
│   ├── gmail_service.py
│   └── pdf_service.py
├── utils/                  # Utility functions (JWT, Auth, Google OAuth)
│   ├── auth_utils.py
│   ├── jwt_utils.py
│   └── google_oauth_utils.py
└── cron/                   # Scheduled jobs logic
    └── daily_jobs.py
```

## Setup and Installation

### 1. Prerequisites

*   Python 3.8+
*   MongoDB Atlas Account (or local MongoDB instance)
*   Stripe Account
*   OpenAI Account
*   Cloudinary Account
*   Google Cloud Project (for Calendar and Gmail APIs)

### 2. Install Dependencies

Navigate to the project directory and install the required Python packages:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Edit the newly created `.env` file with your actual values:

| Variable | Description |
| :--- | :--- |
| `MONGO_URI` | Your MongoDB Atlas connection string. |
| `JWT_SECRET_KEY` | A strong, random key for JWT signing. |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (`sk_live_...` or `sk_test_...`). |
| `STRIPE_WEBHOOK_SECRET` | The secret for verifying Stripe webhooks. |
| `OPENAI_API_KEY` | Your OpenAI API key. |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret. |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret. |
| `SENDER_EMAIL` | The email address used to send invoices (must be authorized in Gmail API). |
| `FRONTEND_URL` | The URL where your React frontend is running (e.g., `http://localhost:5173`). |

### 4. Run the Application

Start the Flask server:

```bash
python app.py
```

The server will start on `http://127.0.0.1:5000` (or `http://localhost:5000`).

### 5. API Endpoint Structure

All API routes are prefixed with `/api/`.

| Module | Endpoint Prefix | Example Route | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth` | `POST /api/auth/signup` | User registration. |
| **Clients** | `/api/clients` | `GET /api/clients` | Fetch all clients. |
| **Projects** | `/api/projects` | `GET /api/projects/{id}` | Fetch project details. |
| **Milestones** | `/api/projects/{id}/milestones` | `POST /api/projects/{id}/milestones` | Create a new milestone. |
| **Invoices** | `/api/invoices` | `POST /api/invoices/{id}/send` | Send invoice email. |
| **Payments** | `/api/payments` | `GET /api/payments` | Payment history (paid invoices). |
| **Documents** | `/api/documents` | `POST /api/documents` | AI drafting and PDF generation. |
| **Calendar** | `/api/calendar` | `GET /api/calendar` | Fetch events. |
| **Dashboard** | `/api/dashboard` | `GET /api/dashboard` | Summary statistics. |
| **Notifications** | `/api/notifications` | `GET /api/notifications` | Fetch user notifications. |
| **Settings** | `/api/settings` | `PUT /api/settings/profile` | Update user profile. |
| **Admin** | `/api/admin` | `GET /api/admin/dashboard` | Admin statistics (requires `is_admin=True`). |

---

**Note on Placeholders:**

The Google Calendar and Gmail API integrations (`services/google_calendar_service.py`, `services/gmail_service.py`, and `utils/google_oauth_utils.py`) contain **placeholder logic** for the OAuth 2.0 flow, as this requires interactive user consent and credential storage that cannot be fully automated in this environment.

*   You will need to complete the OAuth flow implementation to securely obtain and refresh tokens for each user, storing them in the `api_keys` field of the `users` collection.
*   The core logic for creating events and sending emails is present but relies on the `get_google_credentials(user_id)` function to return valid credentials.
