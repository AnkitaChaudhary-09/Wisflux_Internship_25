# Money Splitter Backend API

A comprehensive backend API for splitting expenses between multiple users with wallet management and transaction history.

## 🏗️ Architecture

This backend follows the **MVC (Model-View-Controller)** pattern with proper separation of concerns:

```
backend/
├── models/           # Data models and business logic
├── controllers/      # Request handling and business operations
├── middleware/       # Validation and error handling
├── routes/           # API endpoint definitions
├── utils/            # Utility functions and helpers
├── data/             # JSON data storage
└── server.js         # Main application entry point
```

## 🚀 Features

- **User Management**: Registration, login, and profile management
- **Expense Splitting**: Create expenses and automatically split costs among participants
- **Wallet System**: Track user balances and validate funds before splitting
- **Friend Management**: Add/remove friends for easier expense sharing
- **Transaction History**: Complete audit trail of all financial activities
- **Data Validation**: Comprehensive input validation and error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Storage**: JSON files
- **Architecture**: MVC pattern
- **Error Handling**: Custom error classes and middleware
- **Validation**: Request validation middleware

## 📁 Project Structure

### Models (`/models`)
- **User.js**: User entity with wallet and friends management
- **Expense.js**: Expense entity with splitting logic
- **History.js**: Transaction history entity

### Controllers (`/controllers`)
- **authController.js**: User authentication operations
- **expenseController.js**: Expense creation and management
- **friendController.js**: Friend list operations
- **historyController.js**: Transaction history operations
- **walletController.js**: Wallet balance operations

### Middleware (`/middleware`)
- **validation.js**: Request validation for all endpoints
- **errorHandler.js**: Global error handling and custom error classes

### Routes (`/routes`)
- **auth.js**: Authentication endpoints
- **expenses.js**: Expense management endpoints
- **friends.js**: Friend management endpoints
- **history.js**: Transaction history endpoints
- **wallet.js**: Wallet operations endpoints

### Utils (`/utils`)
- **dataManager.js**: File I/O operations and data utilities

## 🚀 Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Test the backend**:
   ```bash
   node test-server.js
   ```

3. **Start the server**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile/:username` - Get user profile

### Expenses
- `POST /api/expenses` - Create new expense and split money
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `GET /api/expenses/user/:username` - Get expenses by user

### Friends
- `GET /api/friends/:username` - Get user's friends list
- `POST /api/friends/:username/add` - Add friend to user's list
- `DELETE /api/friends/:username/remove` - Remove friend from user's list
- `GET /api/friends/:username/search` - Search for users

### History
- `GET /api/history/:username` - Get user's transaction history
- `GET /api/history/:username/summary` - Get user's transaction summary
- `GET /api/history/:username/expense/:expenseId` - Get expense-specific history

### Wallet
- `GET /api/wallet/:username` - Get current wallet balance

## 📊 Data Models

### User
```json
{
  "id": "string",
  "username": "string",
  "password": "string",
  "wallet": "number",
  "friends": ["string"],
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Expense
```json
{
  "id": "string",
  "productName": "string",
  "price": "number",
  "place": "string",
  "remarks": "string",
  "paidBy": "string",
  "participants": ["string"],
  "splitAmount": "number",
  "status": "string",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### History
```json
{
  "id": "string",
  "username": "string",
  "expenseId": "string",
  "type": "expense_split|expense_paid",
  "amount": "number",
  "balance": "number",
  "description": "string",
  "timestamp": "ISO date"
}
```

## 🔒 Business Logic

### Expense Splitting
1. **Validation**: Check if all participants exist and have sufficient funds
2. **Calculation**: Divide total cost equally among all participants
3. **Wallet Updates**: Deduct appropriate amounts from each participant's wallet
4. **History Recording**: Create transaction records for audit trail
5. **Status Update**: Mark expense as completed

### Fund Validation
- Users cannot participate in expenses if they have insufficient funds
- The system prevents negative wallet balances
- All transactions are atomic (all or nothing)

## 🚨 Error Handling

The API uses custom error classes for different types of errors:
- **ValidationError**: Invalid input data
- **NotFoundError**: Requested resource not found
- **UnauthorizedError**: Authentication required
- **ForbiddenError**: Access denied
- **ConflictError**: Resource conflict (e.g., duplicate username)

## 🧪 Testing

### Test the Backend
```bash
node test-server.js
```

### Test with Postman
Use the provided Postman collection to test all endpoints:
- Base URL: `http://localhost:5000`
- All endpoints are documented with sample requests/responses

## 🔧 Development

### Adding New Features
1. **Model**: Create/update data models in `/models`
2. **Controller**: Add business logic in `/controllers`
3. **Route**: Define endpoints in `/routes`
4. **Middleware**: Add validation in `/middleware/validation.js`
5. **Test**: Update test files and documentation

### Code Style
- Use ES6+ features
- Follow MVC pattern strictly
- Add comprehensive error handling
- Include input validation
- Write clear documentation

## 🚀 Future Enhancements

- **Database Integration**: Replace JSON files with proper database
- **Authentication**: JWT tokens and password hashing
- **Real-time Updates**: WebSocket integration
- **File Uploads**: Receipt image storage
- **Notifications**: Email/SMS alerts for expenses
- **Analytics**: Spending patterns and reports
- **Mobile API**: Optimized endpoints for mobile apps

## 📝 License

This project is licensed under the ISC License.
