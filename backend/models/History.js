class History {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.expenseId = data.expenseId;
    this.type = data.type; // 'expense_split', 'expense_paid'
    this.amount = parseFloat(data.amount) || 0.00;
    this.balance = parseFloat(data.balance) || 0.00;
    this.description = data.description;
    this.timestamp = data.timestamp || new Date().toISOString();
  }

  // Validate history data
  static validate(data) {
    const errors = [];
    
    if (!data.username || data.username.trim().length === 0) {
      errors.push('Username is required');
    }
    
    if (!data.expenseId || data.expenseId.trim().length === 0) {
      errors.push('Expense ID is required');
    }
    
    if (!data.type || !['expense_split', 'expense_paid'].includes(data.type)) {
      errors.push('Type must be either expense_split or expense_paid');
    }
    
    if (!data.amount || isNaN(data.amount)) {
      errors.push('Amount must be a valid number');
    }
    
    if (!data.description || data.description.trim().length === 0) {
      errors.push('Description is required');
    }
    
    return errors;
  }

  // Get history data for response
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      expenseId: this.expenseId,
      type: this.type,
      amount: parseFloat(this.amount.toFixed(2)),
      balance: parseFloat(this.balance.toFixed(2)),
      description: this.description,
      timestamp: this.timestamp
    };
  }
}

module.exports = History;
