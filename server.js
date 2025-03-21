const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");


const app = express();
const PORT = 3000;
const USERS_FILE = "users.json";
const COMMANDES_FILE = "commandes.json"; // Nouveau fichier pour les commandes



app.use(cors());
app.use(bodyParser.json());

// Route pour la page d'accueil (racine)
app.get("/", (req, res) => {
    res.send("Bienvenue sur le serveur !");
});


// Lire les utilisateurs depuis le fichier users.json
app.get("/users", (req, res) => {
    fs.readFile(USERS_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Erreur lors de la lecture du fichier des utilisateurs" });
        }
        res.send(JSON.parse(data));
    });
});

// Sauvegarder les utilisateurs dans le fichier users.json
app.post("/users", (req, res) => {
    const users = req.body;
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ error: "Erreur lors de la sauvegarde du fichier des utilisateurs" });
        }
        res.send({ message: "Données utilisateurs sauvegardées avec succès !" });
    });
});

// Lire les commandes depuis le fichier commandes.json
app.get("/commandes", (req, res) => {
    fs.readFile(COMMANDES_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Erreur lors de la lecture du fichier des commandes" });
        }
        res.send(JSON.parse(data));
    });
});

// Sauvegarder une nouvelle commande dans le fichier commandes.json
app.post("/commandes", (req, res) => {
    const nouvelleCommande = req.body;

    // Lire les commandes existantes
    fs.readFile(COMMANDES_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Erreur lors de la lecture du fichier des commandes" });
        }

        const commandes = JSON.parse(data);
        commandes.push(nouvelleCommande); // Ajouter la nouvelle commande à la liste

        // Sauvegarder le fichier JSON mis à jour
        fs.writeFile(COMMANDES_FILE, JSON.stringify(commandes, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ error: "Erreur lors de la sauvegarde du fichier des commandes" });
            }
            res.send({ message: "Commande sauvegardée avec succès !" });
        });
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('Un client est connecté');
    
    // Écoute des messages venant des clients
    ws.on('message', function incoming(data) {
        const message = JSON.parse(data);
        
        // Si c'est un message de type 'commandCount', transmets-le à tous les clients
        if (message.type === 'commandCount') {
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'commandCount', count: message.count }));
                }
            });
        }
    });
});

console.log('Serveur WebSocket en écoute sur le port 8080');







