// account.js
const account = (() => ({
  displayName: localStorage.getItem('name') || 'Guest',
  email: localStorage.getItem('email') || '',
  photoURL: localStorage.getItem('image') || '',
}))();

function updateAccountFromLocalStorage() {
  return {
    displayName: localStorage.getItem('name') ? localStorage.getItem('name') : 'Guest',
    email: localStorage.getItem('email') ? localStorage.getItem('email') : '',
    photoURL: localStorage.getItem('image') ? localStorage.getItem('image') : '',
  };
}

export { account, updateAccountFromLocalStorage };
