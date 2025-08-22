class Expense {
  constructor(data) {
    this.id = data.id;
    this.productName = data.productName;
    this.price = parseFloat(data.price) || 0.00;
    this.place = data.place;
    this.remarks = data.remarks;
    this.paidBy = data.paidBy;
    this.participants = data.participants || [];
    this.splitAmount = parseFloat(data.splitAmount) || 0.00;
    this.status = data.status || 'pending';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Validate expense data
  static validate(data) {
    const errors = [];
    
    if (!data.productName || data.productName.trim().length === 0) {
      errors.push('Product name is required');
    }
    
    if (!data.price || isNaN(data.price) || data.price <= 0) {
      errors.push('Price must be a positive number');
    }
    
    if (!data.paidBy || data.paidBy.trim().length === 0) {
      errors.push('Paid by field is required');
    }
    
    if (!data.participants || !Array.isArray(data.participants) || data.participants.length === 0) {
      errors.push('At least one participant is required');
    }
    
    if (data.participants && !data.participants.includes(data.paidBy)) {
      errors.push('The person who paid must be included in participants');
    }
    
    return errors;
  }

  // Calculate split amount
  calculateSplitAmount() {
    if (this.participants.length > 0) {
      this.splitAmount = parseFloat((this.price / this.participants.length).toFixed(2));
    }
    return this.splitAmount;
  }

  // Check if expense can be processed
  canProcess() {
    return this.status === 'pending' && this.participants.length > 0;
  }

  // Mark expense as completed
  markCompleted() {
    this.status = 'completed';
    this.updatedAt = new Date().toISOString();
  }

  // Get expense data for response
  toJSON() {
    return {
      id: this.id,
      productName: this.productName,
      price: parseFloat(this.price.toFixed(2)),
      place: this.place,
      remarks: this.remarks,
      paidBy: this.paidBy,
      participants: this.participants,
      splitAmount: parseFloat(this.splitAmount.toFixed(2)),
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Expense;
