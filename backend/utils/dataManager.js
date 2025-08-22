const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read data from JSON file
async function readData(filename) {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw new Error(`Failed to read ${filename}`);
  }
}

// Write data to JSON file
async function writeData(filename, data) {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    
    // Ensure data directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write data with pretty formatting
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw new Error(`Failed to write ${filename}`);
  }
}

// Generate unique ID
function generateId(existingData) {
  let id = 1;
  
  if (existingData && existingData.length > 0) {
    // Find the highest existing ID
    const maxId = Math.max(...existingData.map(item => parseInt(item.id) || 0));
    id = maxId + 1;
  }
  
  return id.toString();
}

// Find record by ID
function findById(data, id) {
  return data.find(item => item.id === id);
}

// Find record by username (case-insensitive, trimmed)
function findByUsername(data, username) {
  if (!Array.isArray(data)) return undefined;
  if (typeof username !== 'string') return undefined;
  const target = username.trim().toLowerCase();
  return data.find(item =>
    item && typeof item.username === 'string' && item.username.trim().toLowerCase() === target
  );
}

// Update record
function updateRecord(data, id, updates) {
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    return data[index];
  }
  return null;
}

// Delete record
function deleteRecord(data, id) {
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    return data.splice(index, 1)[0];
  }
  return null;
}

// Initialize data files if they don't exist
async function initializeDataFiles() {
  const files = ['users.json', 'expenses.json', 'history.json'];
  
  for (const file of files) {
    try {
      await readData(file);
    } catch (error) {
      // File doesn't exist, create with empty array
      await writeData(file, []);
    }
  }
}

module.exports = {
  readData,
  writeData,
  generateId,
  findById,
  findByUsername,
  updateRecord,
  deleteRecord,
  initializeDataFiles
};
