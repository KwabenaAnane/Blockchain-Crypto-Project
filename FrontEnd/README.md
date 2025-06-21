
**Blockchain-Crypto-Project/BackEnd**
====================================

**Introduction**
---------------
This is the backend for the Blockchain-Crypto-Project. It provides a RESTful API for interacting with the blockchain.


**Prerequisites**
----------------

* Node.js (version 14 or higher)
* npm (version 6 or higher)
* MongoDB (version 4 or higher)


**Installation**
---------------


1. Clone the repository: `git clone https://github.com/KwabenaAnane/Blockchain-Crypto-Project.git`
2. Navigate to the backend directory: `cd Blockchain-Crypto-Project/BackEnd`
3. Install dependencies: `npm install`
4. Start MongoDB: `mongod` (or use a MongoDB service like MongoDB Atlas)


**Starting the Backend**
-----------------------

1. Start the backend: `npm run dev`
2. The backend will start on port 3000. You can access the API endpoints by visiting `http://localhost:3000/api` in your web browser.


**API Endpoints**
----------------

### Authentication Routes

* `POST /api/auth/register`: Creates a new user account.
* `POST /api/auth/login`: Logs in an existing user account.
* `GET /api/auth/logout`: Logs out the current user account.

### Blockchain Routes

* `GET /api/blocks`: Retrieves a list of all blocks in the blockchain.
* `POST /api/blocks/mine`: Mines a new block and adds it to the blockchain.


### Transaction Routes

* `GET /api/transactions`: Retrieves a list of all transactions in the blockchain.
* `POST /api/transactions/mine`: Creates a new transaction and adds it to the blockchain.


**FrontEnd**
=====================================

**Installation**
--------------

1. Navigate to the frontend directory: `cd Blockchain-Crypto-Project/FrontEnd`
2. Install dependencies: `npm install`
3. Start the frontend: `npm run dev`

**Starting the Frontend**
-----------------------

1. Start the frontend: `npm run dev`
2. You can access the application by visiting ` http://localhost:5173/` in your web browser.


**Features**
------------

* User authentication: Register, login, and logout functionality
* Blockchain explorer: View the blockchain, including blocks and transactions
* Transaction creation: Create new transactions and add them to the blockchain
* Mining: Mine new blocks and add them to the blockchain


**Troubleshooting**
------------------


* If you encounter any issues starting the frontend, check the console output for error messages.
* If you encounter any issues with the application, check the browser console for error messages.

I hope this helps! Let me know if you have any questions or need further assistance.


