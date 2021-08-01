import { displayDataExists } from '../components/displayDataExists.js';

export let db;
export const databaseIndexed = {
  dbName: 'todos_db',
  store: {
    todo: 'todo'
  }
}

export function createIndexedDB() {
  const request = indexedDB.open(databaseIndexed['dbName'], 1);

  request.onsuccess = () => {
    db = request.result;
    displayDataExists();

  };

  request.onerror = () => {
    console.log('Database failed to open!')
  };

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    const { todo } = databaseIndexed['store'];
    const objectStoreToDo = db.createObjectStore(todo, {
      keyPath: 'id',
      autoIncrement: true,
    });

    objectStoreToDo.createIndex('item', 'item', { unique: false });

  }
}

