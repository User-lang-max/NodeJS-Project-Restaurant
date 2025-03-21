# NodeJS-Project-Restaurant
# Restaurant Management Project

## Description
This project is a web application that allows managing users, orders, and reservations for a restaurant. It includes an administration interface and a client interface.

## Project Structure
server.js: Node.js server using Express to manage users and orders.

ADMIN.html: Administration interface to manage users and orders.

client_page.html: Client interface allowing users to book a table and place orders.

comms.html: shows the commands passed by the client in the client_page by the formular 

login.html: first page that allows you to login as a admin/user (for admin the user:root , pass :root)

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Backend**: Node.js, Express
- **Database**: JSON (files `users.json` and `commandes.json`)
- **WebSocket**: Real-time communication for order counting

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/NodeJS-Project-Restaurant.git
   cd NodeJS-Project-Restaurant
   ```
2. **Install dependencies**:
   ```bash
   npm install express body-parser cors ws
   ```
3. **Start the server**:
   ```bash
   node server.js
   ```
4. **Access the json files**:
  
reservation: http://localhost:3000/users

commands: http://localhost:3000/commandes

## Features
- Display and manage users through the admin interface
- Add and manage orders
- Online reservations via the client interface
- Real-time order count updates with WebSocket

## Possible Improvements
- Integration of a database (MySQL or MongoDB)
- Secure access with authentication
- Adding an online payment system




