const form = document.getElementById('form');
const { title, description } = form;

// Events Listeners
form.addEventListener('submit', handleSubmit);
document.body.onload = updateList;

let db;
const databaseIndexed = {
  dbName: 'todos_db',
  store: {
    todo: 'todo'
  }
}

function updateList() {
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

function handleSubmit(event) {
  event.preventDefault();
  
  addData();
  
  resetFields(title, description);

}

function resetFields(...fields) {
  return fields.map((field) => field['value'] = '' )
}

function createList({
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
  itemOfList.classList.add('it')
  itemOfList.addEventListener('click', handleCheckList);
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
        class="delete" onclick="handleDeleteList(event)"
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
          class="delete" onclick="handleDeleteList(event)"
        />
      </div>
    `
  }



  dataList.appendChild(itemOfList);
}

function addData() {
  const newItem = {
    name: title['value'],
    body: description['value'],
    checked: false,
  }
  
  const { todo } = databaseIndexed['store'];
  
  const transaction = db.transaction(todo, 'readwrite');

  const objectStore = transaction.objectStore(todo);
  console.log(objectStore)
  const request = objectStore.add(newItem);
  request.onsuccess = () => {
    const transaction = db.transaction(todo, 'readonly');
    const todoStore = transaction.objectStore(todo);
    const request = todoStore.getAllKeys()
    
    request.onsuccess = (event) => {
      const arrayId = event.target.result;
      const numberOfId = arrayId.length - 1;
      
      const request = todoStore.get(arrayId[numberOfId]);

      request.onsuccess = (event) => {
        const todo = event.target.result;
        console.log(todo);
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

function displayDataExists() {
  const { todo } = databaseIndexed['store'];
  const transaction = db.transaction(todo, 'readonly');
  const todoStore = transaction.objectStore(todo);
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

function handleDeleteList(event) {
  const list = event['target']['parentNode']['parentNode'];
  const containerModal = document.querySelector('.container-modal');
  const modalDelete = containerModal['parentElement'];

  (openModalDelte = () => {
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
    const { todo } = databaseIndexed['store'];
    const transaction = db.transaction(todo, 'readwrite');
    const todoStore = transaction.objectStore(todo);
    const key = list['dataset']['key'];

    todoStore.delete(Number(key));
    
    list.remove()
  }
}

function handleCheckList(event) {
  const list = event['target']['parentElement'];
  let check = list['dataset']['check'];
  check = check === 'false' ? true : false;
  const key = list['dataset']['key'];

  // Toggle of class (checked) and check
  list['dataset']['check'] = check;
  list.classList.toggle('checked');
  
  const { todo } = databaseIndexed['store'];
  const transaction = db.transaction(todo, 'readwrite');
  const todoStore = transaction.objectStore(todo);
  const request = todoStore.get(Number(key));
  console.log(request);
  
  request.onsuccess = (event) => {
    let item = event.target.result;
    const newItem = {
      ...item,
      checked: check,
    };

    todoStore.put(newItem)
  }
}
