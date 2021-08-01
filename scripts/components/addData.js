import { db, databaseIndexed } from '../database/configIndexedDB.js';
import { openTransaction } from '../database/openTransaction.js';
import { createList } from './createList.js';

const form = document.getElementById('form');
const { title, description } = form;

export function addData() {
  const newItem = {
    name: title['value'],
    body: description['value'],
    checked: false,
  }
  
  const { todo } = databaseIndexed['store'];
  const todoStore = openTransaction({ database: db, store: todo, mode: 'readwrite' });
  const request = todoStore.add(newItem);

  request.onsuccess = () => {
    const todoStore = openTransaction({ database: db, store: todo });
    const request = todoStore.getAllKeys()
    
    request.onsuccess = (event) => {
      const arrayId = event.target.result;
      const numberOfId = arrayId.length - 1;
      
      const request = todoStore.get(arrayId[numberOfId]);

      request.onsuccess = (event) => {
        const todo = event.target.result;

        const appendTodo = {
          title: todo['name'],
          description: todo['body'],
          checked: todo['checked'],
          key: todo['id'],
        }
        createList(appendTodo)
      }
    }
  }
  request.onerror = () => console.log('error')
  
}
