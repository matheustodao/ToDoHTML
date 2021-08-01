import { createIndexedDB } from './database/configIndexedDB.js';
import { handleSubmit } from './submitTodo.js';

const form = document.getElementById('form');

// Events Listeners
form.addEventListener('submit', handleSubmit);
document.body.onload = createIndexedDB();
