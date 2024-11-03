// bm-day-book/app/services/indexedDB.js
import { openDB } from "idb";

const DB_NAME = "salesDB";
const STORE_NAMES = {
  sales: "sales",
  expenses: "expenses",
};

export const initDB = async () => {
  return openDB(DB_NAME, 2, {
    // Increment version number to trigger upgrade
    upgrade(db, oldVersion, newVersion) {
      // Create sales store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAMES.sales)) {
        db.createObjectStore(STORE_NAMES.sales, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      // Create expenses store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAMES.expenses)) {
        db.createObjectStore(STORE_NAMES.expenses, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

export const saveSale = async (sale) => {
  const db = await initDB();
  await db.add(STORE_NAMES.sales, sale);
};

export const getPendingSales = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAMES.sales);
};

export const deletePendingSale = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAMES.sales, id);
};

// Fetch all sales from IndexedDB
export const getAllSales = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAMES.sales);
};

// Update a sale in IndexedDB
export const updateSale = async (saleData) => {
  const db = await initDB();
  const store = db
    .transaction(STORE_NAMES.sales, "readwrite")
    .objectStore(STORE_NAMES.sales);

  // Find the sale by original MongoDB _id
  const existingSales = await store.getAll();
  const saleToUpdate = existingSales.find((sale) => sale._id === saleData.id);

  if (saleToUpdate) {
    saleToUpdate.amount = saleData.amount;
    saleToUpdate.invoiceNumber = saleData.invoiceNumber;
    saleToUpdate.updatedOffline = true;
    await store.put(saleToUpdate);
  } else {
    // If not found, add as a new record
    await store.add({
      ...saleData,
      _id: saleData.id,
      updatedOffline: true,
    });
  }
};

// New methods for expenses
export const saveExpense = async (expense) => {
  const db = await initDB();
  return await db.add(STORE_NAMES.expenses, {
    ...expense,
    date: new Date().toISOString(),
    syncStatus: "pending",
  });
};

export const getPendingExpenses = async () => {
  const db = await initDB();
  const expenses = await db.getAll(STORE_NAMES.expenses);
  return expenses.filter((expense) => expense.syncStatus === "pending");
};

export const deletePendingExpense = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAMES.expenses, id);
};

export const getAllExpenses = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAMES.expenses);
};
