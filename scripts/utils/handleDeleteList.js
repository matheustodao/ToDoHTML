import { db, databaseIndexed } from '../database/configIndexedDB.js';
import { openObjectStore } from '../database/openObjectStore.js';

let list;

export function handleDeleteList(event) {
  list = event['target']['parentNode']['parentNode'];
  const containerModal = document.querySelector('.container-modal');
  const modalDelete = containerModal['parentElement'];

  function openModalDelete() {
    modalDelete.classList.add('open');
  }
  openModalDelete();

  const buttonRemoveList = document.getElementById('delete-list');
  const buttonCloseClass = buttonRemoveList['previousElementSibling'];

  buttonCloseClass.addEventListener('click', () => {
    return modalDelete.classList.remove('open')
  });

  buttonRemoveList.addEventListener('click', () => (
    modalDelete.classList.remove('open'),
    removeList()
  ));
}

function removeList() {
  let key = list['dataset']['key'];
  key = Number(key)
  const { todo } = databaseIndexed['store'];
  const todoStore = openObjectStore({ database: db, store: todo, mode: 'readwrite' });


  todoStore.openCursor(key).onsuccess = (event) => {
    const cursor = event.target.result;
    if (!cursor) {
      return;
    }

    if (cursor.value.id === key) {
      cursor.delete();
      list.remove();
    }
  }
}
