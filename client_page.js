
// Obtenez les éléments du modal
var modal = document.getElementById("reservationModal");
var btn = document.getElementById("openModalBtn");
var span = document.getElementsByClassName("close")[0];

// Ouvrir le modal lorsqu'on clique sur le bouton
btn.onclick = function() {
    modal.style.display = "block";
}

// Fermer le modal lorsqu'on clique sur la croix
span.onclick = function() {
    modal.style.display = "none";
}

// Fermer le modal si l'utilisateur clique en dehors du modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function updateMenu() {
    const mealType = document.getElementById('mealType').value;
    const menuItemSelect = document.getElementById('menuItem');
    menuItemSelect.innerHTML = ''; // Vider les options existantes

    // Plats disponibles pour chaque type de repas
    const menuOptions = {
        ptitDej: [
            { name: 'Le Pack Essentiel', price: '10€/pers' },
            { name: 'Formule Confort', price: '20€/pers' },
            { name: 'Formule Prestige', price: '30€/pers' },
            { name: 'Le brunch Frenchy', price: '40€/pers' },
        ],
        dej: [
            { name: 'Pâtes crémeuses aux champignons', price: '34€' },
            { name: 'Pizza aux saveurs de la mer', price: '53€' },
            { name: 'Truffe', price: '45€' },
        ],
        diner: [
            { name: 'Sauté de veau aux morilles', price: '45€' },
            { name: 'Poulet grillé aux girolles et crème', price: '39€' },
            { name: 'Pâtes au citron et au poulet', price: '41€' },
        ],
    };

    const options = menuOptions[mealType] || []; // Gérer les cas où aucun type de repas n'est sélectionné
    options.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = `${item.name} - ${item.price}`; // Utiliser des backticks ici
        menuItemSelect.appendChild(option);
    });
}

// Ajout de l'événement change et initialisation
document.getElementById('mealType').addEventListener('change', updateMenu);
updateMenu(); // Initialiser le menu lors du chargement de la page

// Initialiser le menu en fonction du type par défaut (Petit-déjeuner)
document.getElementById('mealType').addEventListener('change', updateMenu);
updateMenu();


document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const orderData = {
        fullname: event.target.fullname.value,
        email: event.target.email.value,
        address: event.target.address.value,
        mealType: event.target.mealType.value,
        menuItem: event.target.menuItem.value,
    };

    // Envoi des données de commande au serveur Express
    fetch('http://localhost:3000/commandes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Commande passée avec succès !');
        event.target.reset();  // Réinitialiser le formulaire
    })
    .catch(error => {
        alert('Erreur lors de la commande');
        console.error(error);
    });
});

function updateCommandCount() {
    fetch('http://localhost:3000/commandes')  // Suppose que le serveur retourne toutes les commandes
    .then(response => response.json())
    .then(data => {
        // Le nombre de commandes est la longueur du tableau renvoyé par le serveur
        const commandCount = data.length;
        document.getElementById('commandCount').textContent = commandCount;
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des commandes:', error);
    });
}

// Appel de la fonction pour mettre à jour le nombre de commandes au chargement de la page
updateCommandCount();

const ws = new WebSocket('ws://localhost:8080');

document.getElementById('reservationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const reservationData = {
        name: event.target.name.value,
        email: event.target.email.value,
        phone: event.target.phone.value,
        date: event.target.date.value,
        time: event.target.time.value,
        guests: event.target.guests.value,
    };

    ws.send(JSON.stringify(reservationData));
    alert('Votre réservation a été envoyée avec succès !');
    event.target.reset();
});
ws.onerror = function (error) {
    console.error("WebSocket error:", error);
};

