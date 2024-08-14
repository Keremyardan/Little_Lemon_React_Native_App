import * as SQLite from 'expo-sqlite';

// Veritabanını aç
const db = SQLite.openDatabase('little_lemon.db');

// Tabloyu oluştur
export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS menuitems (id INTEGER PRIMARY KEY NOT NULL, name TEXT, price TEXT, description TEXT, image TEXT, category TEXT);"
        );
      },
      reject,
      resolve
    );
  });
}

// Menü öğelerini al
export async function getMenuItems() {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM menuitems", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

// Menü öğelerini kaydet
export function saveMenuItems(menuItems) {
  db.transaction(tx => {
    const values = menuItems
      .map(
        item =>
          `(${item.id}, "${item.name}", "${item.price}", "${item.description}", "${item.image}", "${item.category}")`
      )
      .join(", ");

    tx.executeSql(
      `INSERT INTO menuitems (id, name, price, description, image, category) VALUES ${values}`
    );
  });
}

// Sorgu ve kategorilere göre filtrele
export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    const categories = activeCategories.map(cat => `"${cat}"`).join(", ");

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM menuitems WHERE name LIKE ? AND category IN (${categories})`,
        [`%${query}%`],
        (_, { rows }) => {
          resolve(rows._array);
        }
      );
    }, reject);
  });
}
