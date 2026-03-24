# Overview

Kua Glang is a community-driven food-sharing platform built to combat food waste. By connecting individuals who have surplus food with those who can use it, the platform fosters a sustainable environment, encourages community engagement, and introduces gamification to incentivize reducing food waste.

## 🌟 Key Features

*   **Food Inventory Management:** Track your groceries and ingredients. Create folders, add food items, set expiration dates, and monitor what needs to be consumed.
*   **Community Food Sharing:** Have extra food? Share it on the platform! Users can browse available food items in their community, request them, and arrange pickups.
*   **Community Feed:** A social feed where users can post updates, follow others, and interact through comments and likes.
*   **Gamification & Competition:** Earn points and rank up by completing quests, sharing food, and reducing waste. Compete with friends and the community on the leaderboard!
*   **History Tracking:** Keep a record of all your shared items and contributions to the community.

## 🛠️ Tech Stack

**Frontend**
*   **Framework:** React 19 (Vite)
*   **Routing:** React Router DOM
*   **Styling:** Tailwind CSS
*   **API Client:** Axios
*   **Icons:** Lucide React, React Icons

**Backend**
*   **Framework:** Node.js, Express.js
*   **Architecture:** Serverless (AWS Lambda ready via `serverless-http` / `aws-serverless-express`)
*   **AWS Services Integration:** 
    *   **DynamoDB:** Primary database for fast and flexible NoSQL data storage.
    *   **Amazon S3:** Used for storing user-uploaded images (profile pictures, food items).
    *   **Amazon Cognito:** Authentication and identity management.
    *   **Amazon SNS:** Push notifications and messaging.

**Infrastructure**
*   Docker & Docker Compose for easy local setup and containerized deployment.

## 📁 Project Structure

```text
kua-glang/
├── backend/          # Node.js/Express serverless application
│   ├── src/
│   │   ├── controllers/ # API logic (auth, food, post, share, rank, etc.)
│   │   ├── routes/      # Express route definitions
│   │   └── utils/       # Helpers and database connections
│   ├── Dockerfile
│   └── template.yml     # AWS SAM / Serverless template
│
├── frontend/         # React application (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route components (Home, Community, Profile, etc.)
│   │   ├── contexts/    # React Context (AuthContext)
│   │   └── services/    # API interaction functions
│   ├── Dockerfile
│   └── tailwind.config.js
│
└── docker-compose.yml # Orchestration for local development
```

## 🚀 Getting Started

### Prerequisites
*   Node.js
*   Docker & Docker Compose (optional, for containerized running)
*   AWS Account & Credentials (requires an `.env` file configured with your AWS resources)

### Running Locally (Without Docker)

1.  **Clone the repository**
2.  **Start the Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    *(Note: Ensure you have the necessary `.env` variables set up in the `backend` directory for your AWS services.)*

3.  **Start the Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The frontend will run on `http://localhost:5173` (or similar).

### Running with Docker Compose
To spin up the entire stack using Docker:
```bash
docker-compose up --build
```

## 🌱 Mission
To drastically reduce household and community food waste by making sharing easy, rewarding, and social.
