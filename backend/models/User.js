const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

class User {
  constructor() {
    this.usersFile = path.join(__dirname, "..", "data", "users.json");
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(path.join(__dirname, "..", "data"))) {
      fs.mkdirSync(path.join(__dirname, "..", "data"));
    }
    if (!fs.existsSync(this.usersFile)) {
      fs.writeFileSync(this.usersFile, JSON.stringify([]));
    }
  }

  async create(userData) {
    const users = this.getAll();

    // Check if username already exists
    if (users.find((user) => user.username === userData.username)) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      password: hashedPassword,
      wallet: 0,
      friends: [],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  getAll() {
    const data = fs.readFileSync(this.usersFile);
    return JSON.parse(data);
  }

  getById(id) {
    const users = this.getAll();
    const user = users.find((u) => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async updateWallet(userId, amount) {
    const users = this.getAll();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) throw new Error("User not found");

    users[userIndex].wallet =
      parseFloat(users[userIndex].wallet) + parseFloat(amount);

    this.saveUsers(users);
    return { wallet: users[userIndex].wallet };
  }

  saveUsers(users) {
    fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
  }

  async validatePassword(username, password) {
    const users = this.getAll();
    const user = users.find((u) => u.username === username);

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
