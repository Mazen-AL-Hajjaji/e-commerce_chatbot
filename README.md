# Chatbot Backend

A Node.js backend for a chatbot assistant, built with Express, MongoDB, and Dialogflow integration.

## Features

- RESTful API using Express
- MongoDB database connection via Mongoose
- Dialogflow integration for natural language understanding
- CORS enabled for frontend integration
- Modular route and model structure

## Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)
- Dialogflow project (for conversational AI)
- A `.env` file with your environment variables

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-project-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add your MongoDB URI and any other required keys:
     ```
     MONGO_URI=your_mongodb_connection_string
     DIALOGFLOW_CLIENT_EMAIL=your_dialogflow_client_email
     DIALOGFLOW_PRIVATE_KEY=your_dialogflow_private_key
     DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id
     ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

## Project Structure

```
.
├── index.js
├── models/
│   └── Product.js
├── routes/
│   ├── dialogFlowRoutes.js
│   └── fulfillmentRoutes.js
├── config/
│   └── keys.js
├── package.json
└── .env
```

## API Endpoints

- `POST /api/dialogflow` — Handles Dialogflow webhook requests (see `routes/dialogFlowRoutes.js`)
- `POST /api/fulfillment` — Handles fulfillment logic (see `routes/fulfillmentRoutes.js`)
- Additional endpoints as defined in your route files

## License

MIT

---

**Author:** Mazen Al-Hajjaji

---

**Note:**  
- Make sure your Dialogflow credentials and MongoDB URI are kept secure and not committed to version control.
- For production, set appropriate CORS origins and environment variables.

## Ignored Files

- **`*.json` files** (e.g., `package.json`, `package-lock.json`) are ignored in version control. Ensure you manually manage these files or use a tool like `npm` to handle dependencies. 