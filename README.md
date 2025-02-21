# Content Subscription API

This is a backend API that allows users to register, subscribe to content categories, receive personalized content based on their subscriptions, and get recommended content. The API also handles email notifications, JWT authentication, and integrates with an external content API for fetching personalized and recommended articles.

## Features

- **User Registration & Login**: JWT-based authentication for secure user login.
- **Subscription Management**: Users can subscribe or unsubscribe from content categories like Tech, Health, etc.
- **Personalized Content**: Fetch personalized content based on the user’s subscribed categories.
- **Recommended Content**: Get recommended content based on trending topics or a predefined query.
- **Email Notifications**: Subscription confirmation emails are sent when users subscribe to categories.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: Database for storing user data and subscriptions.
- **NewsAPI**: For fetching external content based on user preferences.
- **JWT**: For secure user authentication and authorization.
- **Nodemailer**: For sending emails.
- **Vercel**: For deploying the application.

## Setup Instructions

### Prerequisites

- MongoDB Atlas (for cloud MongoDB hosting) or local MongoDB
- A valid API key for NewsAPI (https://newsapi.org/)

3. Create a `.env` file in the root directory and add the following environment variables:
   ```bash
   PORT=5000
   DB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NEWS_API_KEY=your_newsapi_key
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_pass
   ```

## Testing the API

You can use Postman or any API testing tool to test the following endpoints:

- **POST /api/auth/register**: Register a new user (send name, email, and password).
- **POST /api/auth/login**: Login and get JWT (send email and password).
- **GET /api/content/subscribed**: Get personalized content based on user’s subscribed categories.
- **GET /api/content/recommended**: Get recommended content based on trending topics (e.g., bitcoin).

## Deployment

- The API is deployed on Vercel: [Live Demo](https://content-subscription-api.vercel.app/)
