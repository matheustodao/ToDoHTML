import { resetFields } from './helpers/resetFields.js';
import { addData } from './utils/addData.js';

export function handleSubmit(event) {
  const form = document.getElementById('form');
  const { title, description } = form;
  event.preventDefault();
  
  addData();
  
  resetFields(title, description);

}
