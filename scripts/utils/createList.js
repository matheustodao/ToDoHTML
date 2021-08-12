import { handleCheckList } from './handleCheckList.js';
import { handleDeleteList } from './handleDeleteList.js';

export function createList({
  title,
  description = '',
  key,
  checked,
}) {

  const containerDataList = document.getElementById('container-list');

  const olExists = containerDataList.children[0];
  const itemOfList = document.createElement('li');
  itemOfList.setAttribute('data-key', key);
  itemOfList.setAttribute('data-check', checked);
  
  // If tag <ol> not exists then...
  if (!olExists) {
    // Create Tag
    const element = document.createElement('ol');
    // Set id = wrapper-list
    element.setAttribute('id', 'wrapper-list');
    // Add in your parent #container-list
    containerDataList.appendChild(element);
    // And continue
  }

  const dataList = document.getElementById('wrapper-list');

  if (checked) {
    itemOfList.classList.add('checked');

    if (!description) {
      itemOfList.classList.add('checked');
    }
  }

  itemOfList.innerHTML = `
    <div
      class="info-container"
    >
      <span>${title}</span>
      <p>${description}</p>
    </div>
    <div class="action-container">
      <img
        src="./assets/icons/removeCircle.svg"
        class="delete"
      />
    </div>
  `

  if (!description) {
    itemOfList.innerHTML = `
      <div
        class="info-container"
      >
        <span>${title}</span> 
      </div>
      <div class="action-container">
        <img
          src="./assets/icons/removeCircle.svg"
          class="delete"
        />
      </div>
    `
  }

  dataList.appendChild(itemOfList);

  const infoContainers = document.querySelectorAll('.info-container');
  const btnsDelete = document.querySelectorAll('.delete');

  infoContainers.forEach((infoContainer) => {
    infoContainer.addEventListener('click', handleCheckList);
  });

  btnsDelete.forEach((btnDelete) => {
    btnDelete.addEventListener('click', handleDeleteList);
  })
}
