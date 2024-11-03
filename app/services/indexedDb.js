// app/services/indexedDb.js
import Dexie from "dexie";

const db = new Dexie("BobaMetalsDB");

// Define tables and indexes
db.version(1).stores({
  sales: "++id, amount, date, invoiceNumber, synced, _id", // synced field to track sync status
  expenses: "++id, amount, description, date, synced, _id", // Add synced field here as well
  reciepts: "++id, amount, description, date, synced, _id", // Add synced field here as well
  users: "++id, email, role, synced, _id",
});

export default db;
