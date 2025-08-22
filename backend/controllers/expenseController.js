const { readData, writeData, generateId, findByUsername } = require('../utils/dataManager');
const Expense = require('../models/Expense');
const User = require('../models/User');
const History = require('../models/History');
const { ValidationError, NotFoundError, ConflictError } = require('../middleware/errorHandler');

// Create new expense and split money
const createExpense = async (req, res, next) => {
  try {
    const { productName, price, place, remarks, paidBy, participants } = req.body;
    
    // Read data
    const users = await readData('users.json');
    const expenses = await readData('expenses.json');
    const history = await readData('history.json');
    
    // Validate participants exist
    const validParticipants = [];
    for (const participantUsername of participants) {
      const participant = findByUsername(users, participantUsername);
      if (!participant) {
        throw new NotFoundError(`User ${participantUsername} not found`);
      }
      validParticipants.push(new User(participant));
    }
    
    // Validate paidBy user exists and is in participants
    const paidByUser = findByUsername(users, paidBy);
    if (!paidByUser) {
      throw new NotFoundError(`User ${paidBy} not found`);
    }
    if (!participants.includes(paidBy)) {
      throw new ValidationError('The person who paid must be included in participants');
    }
    
    // Calculate split amount
    const splitAmount = parseFloat((price / participants.length).toFixed(2));
    
    // Check if all participants have sufficient funds
    for (const participant of validParticipants) {
      if (!participant.hasSufficientFunds(splitAmount)) {
        throw new ValidationError(`User ${participant.username} has insufficient funds ($${participant.wallet}) for split amount $${splitAmount}`);
      }
    }
    
    // Create expense
    const newExpense = new Expense({
      id: generateId(expenses),
      productName,
      price,
      place,
      remarks,
      paidBy,
      participants,
      splitAmount
    });
    
    // Add to expenses
    expenses.push(newExpense);
    
    // Update user wallets and create history records
    for (const participant of validParticipants) {
      const deductionAmount = participant.username === paidBy
        ? splitAmount - (price - (splitAmount * (participants.length - 1))) // Adjust for payer
        : splitAmount;
      
      // Deduct amount from wallet
      participant.deductAmount(deductionAmount);
      
      // Update user in users array
      const userIndex = users.findIndex(u => u.id === participant.id);
      if (userIndex !== -1) {
        users[userIndex] = participant;
      }
      
      // Create history record
      const historyRecord = new History({
        id: generateId(history),
        username: participant.username,
        expenseId: newExpense.id,
        type: participant.username === paidBy ? 'expense_paid' : 'expense_split',
        amount: deductionAmount,
        balance: participant.wallet,
        description: `Split for ${productName}`
      });
      
      history.push(historyRecord);
    }
    
    // Save all data
    await writeData('expenses.json', expenses);
    await writeData('users.json', users);
    await writeData('history.json', history);
    
    // Mark expense as completed
    newExpense.markCompleted();
    
    res.status(201).json({
      message: 'Expense created and split successfully',
      expense: newExpense.toJSON(),
      splitAmount: splitAmount,
      participants: validParticipants.map(p => ({
        username: p.username,
        amount: p.username === paidBy ? splitAmount - (price - (splitAmount * (participants.length - 1))) : splitAmount,
        newBalance: p.wallet
      }))
    });
    
  } catch (error) {
    next(error);
  }
};

// Get all expenses
const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await readData('expenses.json');
    
    res.json({
      expenses: expenses.map(expense => new Expense(expense).toJSON()),
      total: expenses.length
    });
    
  } catch (error) {
    next(error);
  }
};

// Get expense by ID
const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expenses = await readData('expenses.json');
    
    const expense = expenses.find(e => e.id === id);
    if (!expense) {
      throw new NotFoundError('Expense not found');
    }
    
    res.json({
      expense: new Expense(expense).toJSON()
    });
    
  } catch (error) {
    next(error);
  }
};

// Get expenses by user
const getExpensesByUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const expenses = await readData('expenses.json');
    
    // Find expenses where user is a participant
    const userExpenses = expenses.filter(expense => 
      expense.participants.includes(username)
    );
    
    res.json({
      username,
      expenses: userExpenses.map(expense => new Expense(expense).toJSON()),
      total: userExpenses.length
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  getExpensesByUser
};
