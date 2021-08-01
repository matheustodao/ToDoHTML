export function openTransaction({
  database,
  mode = 'readonly',
  store,
}) {
  const transaction = database.transaction(store, mode);
  const objectStore = transaction.objectStore(store);
  return objectStore;
}