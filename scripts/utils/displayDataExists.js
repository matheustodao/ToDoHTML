import { db, databaseIndexed } from '../database/configIndexedDB.js';
import { openObjectStore } from '../database/openObjectStore.js';
import { createList } from './createList.js';

export function displayDataExists() {
  const { todo } = databaseIndexed['store'];
  const todoStore = openObjectStore({ database: db, store: todo });
  const request = todoStore.openCursor();

  request.onsuccess = (event) => {
    const cursor = event.target.result;

    if (!cursor) {
      return;
    };

    createList({
      title: cursor['value']['name'],
      description: cursor['value']['body'],
      key: cursor['primaryKey'],
      checked: cursor['value']['checked'],
    });
    cursor.continue();
  }

}
