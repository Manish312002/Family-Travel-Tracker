# Family Travel Tracker

**Family Travel Tracker** is a web application to manage and view your family's travel history. Track countries visited, manage user profiles, and switch between users with ease.

## Features

- **User Management**: Add new users, switch profiles.
- **Travel Tracking**: Add and view countries visited by each user.
- **Dynamic Content**: Display visited countries and manage user profiles.

## Technologies

- **Backend Framework**: Built using Node.js and Express for routing and server management.
- **Database**: PostgreSQL is used for data storage, handling user information and visited countries.
- **Template Engine**: EJS is used to render HTML views dynamically based on server-side data.
- **Middleware**: Utilizes body-parser to handle URL-encoded form data and express.static to serve static files from a "public" directory.

## Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Manish312002/family-travel-tracker.git
   cd family-travel-tracker

2. **Install Dependencies**
- npm i

3. **Configure Database**
- Ensure PostgreSQL is installed and running. Create a database named **Web Dev** and set up the following tables:

- users
- countries
- visited_countries

4. **Run the Server**
- node index.js
- Access the application at http://localhost:3000.

## Endpoints
- **GET /:** Displays home page with visited countries and user options.
- **POST /add:** Add a new country to the visited list for the current user.
- **POST /user:** Manage user selection or navigate to the new user creation page.
- **POST /new:** Add a new user with a name and color.

## Error Handling
- Duplicate entries are avoided.
- Error messages are shown for missing fields or non-existent countries.
