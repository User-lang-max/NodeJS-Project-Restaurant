const signInBtnLink = document.querySelector('.signInBtn-link');
const signUpBtnLink = document.querySelector('.signUpBtn-link');
const wrapper = document.querySelector('.wrapper');
const maxUsers = 1000;

let users = JSON.parse(localStorage.getItem('users')) || [];
let usersCount = users.length;

function addUser(username, email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users.push({ username, email, password });
  localStorage.setItem('users', JSON.stringify(users));
}


signUpBtnLink.addEventListener('click', () => {
  wrapper.classList.toggle('active');
});

signInBtnLink.addEventListener('click', () => {
  wrapper.classList.toggle('active');
});

// Connexion
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  if (role === 'admin' && username === 'root' && password === 'root') {
    alert('Administrateur connecté avec succès !');
    window.location.href = 'ADMIN.html';
  } else {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      alert('Utilisateur connecté avec succès !');
      window.location.href = 'client_page.html';
    } else {
      alert('Nom d\'utilisateur ou mot de passe invalide !');
    }
  }
});

// Inscription
document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const newUsername = document.getElementById('new-username').value;
  const email = document.getElementById('email').value;
  const newPassword = document.getElementById('new-password').value;
  const terms = document.getElementById('terms').checked;

  if (!terms) {
    alert('Vous devez accepter les conditions d\'utilisation.');
    return;
  }

  if (usersCount >= maxUsers) {
    alert('Nombre maximum d\'utilisateurs atteint.');
    return;
  }

  if (users.some(u => u.username === newUsername || u.email === email)) {
    alert('Nom d\'utilisateur ou email déjà utilisé.');
    return;
  }

  const newUser = { username: newUsername, email, password: newPassword };
  users.push(newUser);
  usersCount++;
  updateUsersCount();

  localStorage.setItem('users', JSON.stringify(users));
  alert('Inscription réussie !');
  wrapper.classList.toggle('active');
});

// Fonction pour obtenir le nombre d'utilisateurs
function getUsersCount() {
  return usersCount;
}

// Fonction pour mettre à jour le nombre d'utilisateurs dans le localStorage
function updateUsersCount() {
  usersCount = users.length;
  localStorage.setItem('usersCount', usersCount);
}
