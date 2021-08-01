import { db, databaseIndexed } from '../database/configIndexedDB.js';
import { openTransaction } from '../database/openTransaction.js';

export function handleCheckList(event) {
  const list = event['target']['parentElement'];
  const check = list['dataset']['check'] === 'false' && true;
  const key = list['dataset']['key'];

  // Toggle of class (checked) and check
  list['dataset']['check'] = check;
  list.classList.toggle('checked');
  
  const { todo } = databaseIndexed['store'];
  const todoStore = openTransaction({ database: db, store: todo, mode: 'readwrite' });
  const request = todoStore.get(Number(key));
  
  request.onsuccess = (event) => {
    let item = event.target.result;
    const newItem = {
      ...item,
      checked: check,
    };

    todoStore.put(newItem)
  }
}