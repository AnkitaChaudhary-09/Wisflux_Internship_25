# Money Splitter

A web application for splitting expenses between multiple users. Users can manage their expenses, split bills with friends, and keep track of their spending history.

## Features

- User authentication (login/register)
- Add and manage friends
- Split expenses between multiple users
- Wallet balance tracking
- Transaction history
- Real-time balance updates

## Tech Stack

- Frontend:

  - React.js
  - Vite
  - React Router DOM
  - Tailwind CSS
  - Axios for API calls

- Backend:
  - Express.js
  - JSON file-based storage
  - JWT for authentication
  - CORS for cross-origin requests

## Project Structure

```
money-splitter/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   └── services/     # API services
│   └── ...
└── backend/              # Express backend
    ├── routes/          # API routes
    ├── controllers/     # Route controllers
    ├── models/         # Data models
    ├── config/         # Configuration files
    └── data/          # JSON data storage
```

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Start the development servers:

   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend development server (from frontend directory)
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

## API Endpoints

### Authentication

- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user

### Users

- GET `/api/users/profile` - Get user profile
- POST `/api/users/wallet` - Update wallet balance

### Friends

- GET `/api/friends` - Get friends list
- POST `/api/friends` - Add a friend
- DELETE `/api/friends/:friendId` - Remove a friend

### Transactions

- GET `/api/transactions` - Get user's transactions
- POST `/api/transactions` - Create new transaction

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
