# Trading_App
React + Express + MongoDB + Websockets + Typescript + Redux

Goals: 
Real time data updates for crypto data
State managed using Redux and persisted to local storage 
Full duplex communication using websockets

Application flow:
1. Express backend polls cryto data for every 5 seconds 
2. Preprocess and save it in Mongodb database 
3. A socket.io websocket server is started
4. Each time new data is saved in the database, a cryptoUpdate event is emitted to all clients connected to the server 
5. The frontend recieves this new data through the emitted cryptoUpdate event and updates the data in redux store. 
6. Every time a new crypto is selected in the frontend, the /data/latest_N_Rows fetches the latest 20 entries and updates the lastQueriedCrypto
7. When a new coin is selected, the localStorage is updated with completely new data for persistance.
8. Until the client disconnects, new data will be sent to the frontend and table updates in real-times every 5 seconds as a new row will be added to the redux store 

Instructions to run locally:
Clone the project folder 
1. run command "npm install" to install all dependencies
2. run command "npm run start:backend" to start backed server at 4000
3. run command "npm run start:frontend" to start frontend server at 3000


Trobleshooting:
Check if the frontend server runs on Port 3000
Check if the backend server runs on Port 4000

If in case of error due to misisng dependencies in frontend
cd into frontend/my-app and run "npm install"
run "npm start" to react app

If in case of error due misisng dependencies in backend
cd into backend and run "npm install"
run "npm start" to start server

Output:

Demo video link:
https://drive.google.com/file/d/1ZI4NkX82viZKcKpPPM2H27XWEcnHwrfA/view?usp=sharing


UI:
![image](https://github.com/user-attachments/assets/f3346f45-d262-42a5-a69e-115930307c3c)

Redux dev tools console: 
![image](https://github.com/user-attachments/assets/22c2ca01-2df3-4223-b31a-b46e3b2c3178)

![image](https://github.com/user-attachments/assets/d5228cd7-ebf8-4416-95bd-89b26771487b)

Network console:
![image](https://github.com/user-attachments/assets/9f954d78-f534-45eb-8a95-832bf5b7edab)

MongoDB:
![image](https://github.com/user-attachments/assets/1aee5422-63d0-4ca4-9abe-e5ab0aaa30b1)

Postman:
![image](https://github.com/user-attachments/assets/9c4b1026-cc67-4087-9321-011d8b00cd02)

Backend server logs:
![image](https://github.com/user-attachments/assets/0134c2fc-4e84-4e8d-bcd2-a38bb2d0006d)


Improvements:
I focussed on the only the core task since it was given during a work week and missed some improvements which I have mentioned below.

1. Only livecoinwatch public api was updating data fast enough to demo real time updates, but would choose an API that allows websocket connection instead of polling every 5 seconds to get data 
2. Remove unneccessary comments and console.logs
3. Testing the api, mock testing, database testing and frontend testing
4. Better error handling on backend
5. Better error handling, meesages and redirects on frontend.
6. Better cleanups and websocket error handling
7. Maintain consistancy in code with regards to namimg conventions, function declarations, hoisting, indentation etc.
8. Add swagger api documentation
9. Proper project structure, code seperation 
10. Better logging using decorators
11. Make frontend responsive
12. .env file for credentials
