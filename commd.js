window.onload = () => {
    loadOrders();
};

let getData = []; // Variable globale pour stocker les données reçues


function loadOrders() {
    fetch('http://localhost:3000/commandes')
        .then(response => {
            if (!response.ok) throw new Error("Erreur de chargement des commandes");
            return response.json();
        })
        .then(data => {
            console.log('Données reçues:', data); 
            populateTable(data);
            const reservationsByMealType = countReservationsByMealType(data);
            createChart(reservationsByMealType, "line");
        })
        .catch(error => {
            console.error('Erreur de chargement des commandes:', error);
        });
}


function populateTable(data) {
    const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];
    ordersTable.innerHTML = ''; 
    getData = data; 

    data.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.fullname}</td>
            <td>${order.email}</td>
            <td>${order.address}</td>
            <td>${order.mealType}</td>
            <td>${order.menuItem}</td>
        `;
        ordersTable.appendChild(row);
    });
}


function countReservationsByMealType(data) {
    const counts = {};
    data.forEach(order => {
        const mealType = order.mealType;
        counts[mealType] = (counts[mealType] || 0) + 1;
    });

    return {
        labels: Object.keys(counts),
        values: Object.values(counts),
    };
}


let myChart; 
function createChart(data, type) {
    const ctx = document.getElementById("myChart").getContext("2d");

 
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: data.labels,
            datasets: [{
                label: "Nombre de réservations par type de repas",
                data: data.values,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            }],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Type de repas",
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Nombre de réservations",
                    },
                },
            },
        },
    });
}

function logout() {
    localStorage.removeItem('authToken'); 
    sessionStorage.clear(); 
    alert('Vous êtes déconnecté.');

  
    window.location.href = 'login.html';
}
function accueil() {
    localStorage.removeItem('authToken'); 
    sessionStorage.clear(); 

  
    window.location.href = 'ADMIN.html';
}

function principale() {
    localStorage.removeItem('authToken'); 
    sessionStorage.clear(); n

  
    window.location.href = 'ProjetRestau.html';
}

function countAndSaveTotalOrders() {
    const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];
    const totalOrders = ordersTable.rows.length; 
    localStorage.setItem('totalOrders', totalOrders); 
}


function populateTable(data) {
    const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];
    ordersTable.innerHTML = ''; 

    data.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td> <!-- Numéro de la ligne -->
            <td>${order.fullname}</td>
            <td>${order.email}</td>
            <td>${order.address}</td>
            <td>${order.mealType}</td>
            <td>${order.menuItem}</td>
        `;
        ordersTable.appendChild(row);
    });

    countAndSaveTotalOrders(); 
}
