const form = document.getElementById("myForm");
const userInfo = document.getElementById("data");
const modal = document.getElementById("userForm");
const closeModal = document.querySelector(".modal .close");
const newUserBtn = document.querySelector(".newUser");
let ctx = document.getElementById('myChart');
let myChart;
let Jsondata;

let getData = [];
let isEdit = false;
let editId = null;

function logout() {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    alert('Vous êtes déconnecté.');
    window.location.href = 'login.html';
}

function commd() {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    window.location.href = 'commd.html';
}

function principale() {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    window.location.href = 'client_page.html';
}

async function loadDataFromServer() {
    try {
        const response = await fetch('http://localhost:3000/users');
        if (response.ok) {
            getData = await response.json();
            showInfo();
        } else {
            console.error('Erreur lors du chargement des données du serveur');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function updateServerData() {
    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(getData),
        });

        if (!response.ok) {
            console.error('Erreur lors de la mise à jour du serveur');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function showInfo() {
    userInfo.innerHTML = "";
    getData.forEach((user, index) => {
        const userRow = `
            <tr>
                <td>${index + 1}</td>
                <td>${user.id}</td>
                <td>${user.nom}</td>
                <td>${user.age}</td>
                <td>${user.prenom}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.heure}</td>
                <td>${user.startDate}</td>
                <td>
                    <button class="edit" onclick="editInfo(${index})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteInfo(${index})"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>`;
        userInfo.innerHTML += userRow;
    });
    const reservationsByHour = countReservationsByHour(getData);
    createChart(reservationsByHour, "bar");
    const reservationsByDay = countReservationsByDay(getData);
    createPieChart(reservationsByDay);
}

function editInfo(index) {
    const user = getData[index];
    isEdit = true;
    editId = index;

    document.getElementById("name").value = user.nom;
    document.getElementById("age").value = user.age;
    document.getElementById("prenom").value = user.prenom;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;
    document.getElementById("heure").value = user.heure;
    document.getElementById("sDate").value = user.startDate;

    modal.style.display = "flex";
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = {
        id: isEdit ? getData[editId].id : Date.now(),
        nom: document.getElementById("name").value.trim(),
        age: document.getElementById("age").value.trim(),
        prenom: document.getElementById("prenom").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        heure: document.getElementById("heure").value.trim(),
        startDate: document.getElementById("sDate").value.trim(),
    };

    if (isEdit) {
        getData[editId] = user;
    } else {
        getData.push(user);
    }

    updateServerData();
    form.reset();
    modal.style.display = "none";
    showInfo();
});

function deleteInfo(index) {
    getData.splice(index, 1);
    updateServerData();
    showInfo();
}

newUserBtn.addEventListener("click", () => {
    isEdit = false;
    modal.style.display = "flex";
    form.reset();
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

loadDataFromServer();

fetch("users.json")
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    }
  })
  .then((data) => {
    getData = data;
    showInfo();

    const reservationsByHour = countReservationsByHour(data);
    createChart(reservationsByHour, "bar");
  });

function countReservationsByHour(data) {
  const counts = {};
  data.forEach((row) => {
    const hour = row.heure.split(":")[0];
    counts[hour] = (counts[hour] || 0) + 1;
  });

  const labels = Object.keys(counts).sort((a, b) => a - b);
  const values = labels.map((label) => counts[label]);

  return { labels, values };
}

function createChart(data, type) {
    const ctx = document.getElementById("myChart").getContext("2d");
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: "Nombre de réservations",
                    data: data.values,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        stepSize: 1,
                    },
                },
                y: {
                    beginAtZero: true,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

fetch("users.json")
.then((response) => {
if (response.status === 200) {
return response.json();
}
})
.then((data) => {
getData = data;
showInfo();

const reservationsByDay = countReservationsByDay(data);

createPieChart(reservationsByDay);
})
.catch((error) => console.error("Erreur lors du chargement du fichier JSON :", error));

function countReservationsByDay(data) {
const counts = {};

data.forEach((row) => {
const date = row.startDate;
counts[date] = (counts[date] || 0) + 1;
});

const labels = Object.keys(counts);
const values = labels.map((label) => counts[label]);

return { labels, values };
}

function countReservationsByDay(data) {
    const counts = {};
    data.forEach((row) => {
        const date = row.startDate;
        counts[date] = (counts[date] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const values = labels.map((label) => counts[label]);

    const totalReservations = values.reduce((total, current) => total + current, 0);
    document.getElementById('totalReservations').textContent = totalReservations;

    return { labels, values };
}
let myPieChart;

async function fetchDataAndCreatePieChart() {
    try {
        const response = await fetch("users.json");
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement de users.json : ${response.statusText}`);
        }

        const users = await response.json();

        const reservationsPerDay = {};
        users.forEach(user => {
            const date = user.reservationDate;
            reservationsPerDay[date] = (reservationsPerDay[date] || 0) + 1;
        });

        const labels = Object.keys(reservationsPerDay);
        const values = Object.values(reservationsPerDay);

        createPieChart({ labels, values });
    } catch (error) {
        console.error("Erreur lors de la création du graphique :", error);
    }
}

function createPieChart(data) {
    const canvas = document.getElementById("myPieChartCanvas");
    if (!canvas) {
        console.error("Canvas pour le graphique pie introuvable");
        return;
    }

    const ctx = canvas.getContext("2d");
    if (myPieChart) myPieChart.destroy();

    myPieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: "Réservations par jour",
                    data: data.values,
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)"
                    ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)"
                    ],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
        
    });
}

fetchDataAndCreatePieChart();

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = function() {
    console.log('Connexion WebSocket établie avec le serveur');
};

ws.onerror = function(error) {
    console.error('Erreur WebSocket :', error);
};

const tableBody = document.getElementById('data');
const newRow = document.createElement('tr');

newRow.innerHTML = `
    <td>#</td>
    <td>${reservationData.name}</td>
    <td>${reservationData.email}</td>
    <td>${reservationData.phone}</td>
    <td>${reservationData.date}</td>
    <td>${reservationData.time}</td>
    <td>${reservationData.guests}</td>
`;

tableBody.appendChild(newRow);

function displayTotalOrders() {
    const totalOrders = localStorage.getItem('totalOrders');
    if (totalOrders !== null) {
        document.getElementById('totalOrders').textContent = totalOrders;
    } else {
        console.error("Le total des commandes n'est pas disponible.");
    }
}

window.onload = displayTotalOrders;

const userCountElement = document.getElementById('user-count');

let users = JSON.parse(localStorage.getItem('users')) || [];
const usersCount = users.length;

userCountElement.textContent = usersCount;
