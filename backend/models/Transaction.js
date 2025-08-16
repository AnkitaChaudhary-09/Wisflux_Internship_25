const fs = require("fs");
const path = require("path");

class Transaction {
  constructor() {
    this.transactionsFile = path.join(
      __dirname,
      "..",
      "data",
      "transactions.json"
    );
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(path.join(__dirname, "..", "data"))) {
      fs.mkdirSync(path.join(__dirname, "..", "data"));
    }
    if (!fs.existsSync(this.transactionsFile)) {
      fs.writeFileSync(this.transactionsFile, JSON.stringify([]));
    }
  }

  create(transactionData) {
    const transactions = this.getAll();

    const newTransaction = {
      id: Date.now().toString(),
      ...transactionData,
      createdAt: new Date().toISOString(),
    };

    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  }

  getAll() {
    const data = fs.readFileSync(this.transactionsFile);
    return JSON.parse(data);
  }

  getByUserId(userId) {
    const transactions = this.getAll();
    return transactions.filter(
      (t) => t.paidBy === userId || t.splitWith.includes(userId)
    );
  }

  saveTransactions(transactions) {
    fs.writeFileSync(
      this.transactionsFile,
      JSON.stringify(transactions, null, 2)
    );
  }

  calculateSplit(amount, numberOfPeople) {
    return parseFloat((amount / numberOfPeople).toFixed(2));
  }
}

module.exports = Transaction;
