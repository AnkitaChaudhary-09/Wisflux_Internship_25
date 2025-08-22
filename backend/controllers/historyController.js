const { readData, findByUsername } = require('../utils/dataManager');
const History = require('../models/History');
const { ValidationError, NotFoundError } = require('../middleware/errorHandler');

// Get user's transaction history
const getUserHistory = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20, type } = req.query;
    
    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      throw new ValidationError('Invalid pagination parameters');
    }
    
    // Read data
    const history = await readData('history.json');
    const expenses = await readData('expenses.json');
    
    // Filter user's history
    let userHistory = history.filter(record => record.username === username);
    
    // Filter by type if specified
    if (type && ['expense_split', 'expense_paid'].includes(type)) {
      userHistory = userHistory.filter(record => record.type === type);
    }
    
    // Sort by timestamp (newest first)
    userHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Calculate pagination
    const totalRecords = userHistory.length;
    const totalPages = Math.ceil(totalRecords / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedHistory = userHistory.slice(startIndex, endIndex);
    
    // Enrich history with expense details
    const enrichedHistory = paginatedHistory.map(record => {
      const expense = expenses.find(e => e.id === record.expenseId);
      return {
        ...new History(record).toJSON(),
        expense: expense ? {
          productName: expense.productName,
          place: expense.place,
          remarks: expense.remarks
        } : null
      };
    });
    
    res.json({
      username,
      history: enrichedHistory,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalRecords,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      filters: {
        type: type || 'all'
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Get user's transaction summary
const getUserSummary = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { period = 'all' } = req.query; // all, month, week
    
    // Read data
    const history = await readData('history.json');
    const users = await readData('users.json');
    
    // Find user
    const user = findByUsername(users, username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Filter user's history
    let userHistory = history.filter(record => record.username === username);
    
    // Apply time period filter
    if (period === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      userHistory = userHistory.filter(record => 
        new Date(record.timestamp) >= oneMonthAgo
      );
    } else if (period === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      userHistory = userHistory.filter(record => 
        new Date(record.timestamp) >= oneWeekAgo
      );
    }
    
    // Calculate summary
    const totalExpenses = userHistory.length;
    const totalAmount = userHistory.reduce((sum, record) => sum + record.amount, 0);
    
    const expenseTypes = userHistory.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {});
    
    const amountByType = userHistory.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + record.amount;
      return acc;
    }, {});
    
    res.json({
      username,
      period,
      summary: {
        totalExpenses,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        currentBalance: parseFloat(user.wallet.toFixed(2)),
        expenseTypes,
        amountByType: Object.keys(amountByType).reduce((acc, key) => {
          acc[key] = parseFloat(amountByType[key].toFixed(2));
          return acc;
        }, {})
      },
      recentTransactions: userHistory
        .slice(0, 5)
        .map(record => new History(record).toJSON())
    });
    
  } catch (error) {
    next(error);
  }
};

// Get expense-specific history
const getExpenseHistory = async (req, res, next) => {
  try {
    const { username, expenseId } = req.params;
    
    // Read data
    const history = await readData('history.json');
    const expenses = await readData('expenses.json');
    
    // Find expense
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) {
      throw new NotFoundError('Expense not found');
    }
    
    // Check if user is participant
    if (!expense.participants.includes(username)) {
      throw new NotFoundError('User is not a participant in this expense');
    }
    
    // Get history for this expense
    const expenseHistory = history.filter(record => 
      record.expenseId === expenseId
    );
    
    // Get user's specific record
    const userRecord = expenseHistory.find(record => 
      record.username === username
    );
    
    if (!userRecord) {
      throw new NotFoundError('No history record found for this user and expense');
    }
    
    res.json({
      username,
      expenseId,
      expense: {
        productName: expense.productName,
        price: expense.price,
        place: expense.place,
        remarks: expense.remarks,
        paidBy: expense.paidBy,
        participants: expense.participants,
        splitAmount: expense.splitAmount
      },
      userRecord: new History(userRecord).toJSON(),
      allParticipants: expenseHistory.map(record => ({
        username: record.username,
        type: record.type,
        amount: record.amount,
        balance: record.balance
      }))
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserHistory,
  getUserSummary,
  getExpenseHistory
};
