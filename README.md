# Servo App

A single page application using REST JSON API to call petrol stations and thier locations. This is displayed using the Google Maps API. 

Please allow your location in Google Maps for optimal experience!

## :computer: [Click here]() to see the app!

![screenshot]()

# Team Members

- Ben
- Lea
- Chris 
- Arnav 



## :pencil2: Planning 

![screenshot](/public/pipeline.PNG)

## :page_facing_up: Features 

- The app calls 5244 petrol station locations within the map boundaries from the database using PostgreSQL. Uses Google maps API to display the data. 

- Using geo-location the map shows the user location and displays a marker. 

- Icon markers are used to show the top petrol station owners - BP, Shell, United, Clatex. All other stations are marked with a generic petrol station icon. 

- When users click markers they show info windows with the station name and address.

- Users can hide the sidebars pressing ctrl + shift + 'b' to display the map to fill the whole screen. 

- Users can scroll and move the map. The latitude and longitude is tracked as it is moved and centers on page.

- A stats table shows the total number of stations for each owner. 

- Spotlight feature highlights random petrol stations and takes the user to its location. 


## :rocket: Technologies used

JavaScript, Node.js, PostgreSQL, Google map API, EJS, CSS. 


