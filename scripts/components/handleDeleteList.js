import { db, databaseIndexed } from '../database/configIndexedDB.js';
import { openTransaction } from '../database/openTransaction.js';

export function handleDeleteList(event) {
  const list = event['target']['parentNode']['parentNode'];
  const containerModal = document.querySelector('.container-modal');
  const modalDelete = containerModal['parentElement'];

  (function openModalDelete() {
    modalDelete.classList.add('open');
    closeModalDelete();
  })()
  
  function closeModalDelete() {
    const buttonRemoveList = document.getElementById('delete-list');
    const buttonCloseClass = buttonRemoveList['previousElementSibling'];

    buttonRemoveList.addEventListener('click', () => (
      modalDelete.classList.remove('open'),
      removeList()
    ));
    
    buttonCloseClass.addEventListener('click', () => (
      modalDelete.classList.remove('open')
    ));
  }

  function removeList() {
    const key = list['dataset']['key'];
    const { todo } = databaseIndexed['store'];
    const todoStore = openTransaction({ database: db, store: todo, mode: 'readwrite' });

    todoStore.delete(Number(key));
    
    list.remove()
  }
}
