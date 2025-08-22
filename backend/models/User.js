class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.wallet = parseFloat(data.wallet) || 0.0;
    this.friends = data.friends || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Validate user data
  static validate(data) {
    const errors = [];

    if (!data.username || data.username.trim().length < 3) {
      errors.push("Username must be at least 3 characters long");
    }

    if (!data.password || data.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (data.wallet !== undefined && (isNaN(data.wallet) || data.wallet < 0)) {
      errors.push("Wallet balance must be a positive number");
    }

    return errors;
  }

  // Check if user has sufficient funds
  hasSufficientFunds(amount) {
    return this.wallet >= amount;
  }

  // Deduct amount from wallet
  deductAmount(amount) {
    if (this.hasSufficientFunds(amount)) {
      this.wallet -= amount;
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Add amount to wallet
  addAmount(amount) {
    this.wallet += amount;
    this.updatedAt = new Date().toISOString();
  }

  // Add friend
  addFriend(friendUsername) {
    if (!this.friends.includes(friendUsername)) {
      this.friends.push(friendUsername);
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Remove friend
  removeFriend(friendUsername) {
    const index = this.friends.indexOf(friendUsername);
    if (index > -1) {
      this.friends.splice(index, 1);
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Get user data for response (without sensitive information)
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      wallet: parseFloat(this.wallet.toFixed(2)),
      friends: this.friends,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Explicit safe serializer that omits password
  safeJSON() {
    return this.toJSON();
  }
}

module.exports = User;
