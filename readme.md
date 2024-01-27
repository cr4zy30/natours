# Natours

### Description

Natours is a tour booking application. It's built using modern technologies such as Node.js, Express, MongoDB and Mongoose.
It has its own RESTful API. SendGrid is used for emails. Stripe is used for payments. Some API endpoints require users to be logged-in or have a certain role (admin, guide, etc.).

### Main page: displays all the tours received from the API request.
![image](https://github.com/cr4zy30/natours/assets/112426363/16943aaf-c3cf-493e-aaa9-bc64cc2f42dc)

### Tour details 
Displays the tour's information on a single page (duration, location, rating, nb. of participants, difficulty, next date, description, tour guides, reviews, images). 
The data is received from an API request (ex: /tour/the-sea-explorer) 

![image](https://github.com/cr4zy30/natours/assets/112426363/290f0573-d8c4-49e9-bc54-b3d8e644b8bf)
![image](https://github.com/cr4zy30/natours/assets/112426363/dbc4a4d3-0e3a-46c0-88d4-9798df760ac1)
![image](https://github.com/cr4zy30/natours/assets/112426363/4bc3a342-139d-4203-9095-f5884c3046c0)
![image](https://github.com/cr4zy30/natours/assets/112426363/d486dd2f-e4c2-4b33-9189-51d39d451204)

### Log in
All users are stored in the MongoDB database. Passwords are encrypted. Works with JSON Web Tokens.

![image](https://github.com/cr4zy30/natours/assets/112426363/08de5370-2c96-4480-a48f-407414a48e14)

### Account
Users can change their name, email address, and profile picture. They can also view their bookings (/my-tours).

![image](https://github.com/cr4zy30/natours/assets/112426363/9e9282f4-d9b6-4fe1-b493-2aa34615c9bf)
![image](https://github.com/cr4zy30/natours/assets/112426363/7fb10cdd-c1bc-4c44-a829-1fa6ee4ca020)

### Payments
Test payments

![image](https://github.com/cr4zy30/natours/assets/112426363/146d9ad2-50db-4329-a0c6-28c988e72dd9)




