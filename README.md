# Project description

Project is done using Vue 3 in Vite alongside with HTML, CSS, and TypeScript. <br/>
I made current application as user friendly as possible and visually understandable. <br/>
All the user side instructions are in the user interface view when running the program. <br/>
Added as much comments as possible to the code. <br/>
A demo video file is in the project root showcasing the application, <br/>
file is called: **Application demo video.mp4**

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## What was done and finished

* I used Leaflet map because it's lightweight, easy to use and does not require an API key.
* **Start/Stop Engine** button realized and all the checks with it.
* **Get Your Location** button to start the application and make my initial location point. <br/>
(I also found nice instruction video how to set up the projet, Leaflet and create **Get Your Location** button.) <br/>
* UGV marker movement around the map using four arrow keys, always keeping focus in the middle of screen. <br/>
Showing UGV marker coordinates.
* Saving waypoints to the list, editing the name, drive button, deleting the waypoints from list.
* Saving new waypoints with green color on the map, when deleting waypoints also deleting them from the map.
* All kind of alerts, popup windows, texts and control of their use. - It's all made for better user experience!

## Most difficult parts to complete and conclusion

1. How to set green color on UGV marker nad how to delete markers from map.
2. How to solve a moment when I click right button and it need to save actually my current UGV marker location coordinates. Because I didn't like that it saved my exact coordinates what I clicked.
* I completed this task step by step because there were many things to do and finish.
* My extra helper was Copilot what helped to make process a bit faster and it gave me some very good ideas, also to understand solvable problems better. <br/>
(I also did some research what AI is best to use and I found that Copilot is the best for programming.) <br/>
***<hr/>*** - Sadly I didn't have time to make code modular, I think I needed to start with it right away. Too much time went to make application <br/> work well and 
to have a good user experience. I think it's only thing what I didn't complete.

## Application setup and how to use it

1. Clone project from GitHub.
2. Open it in development environment, for example Visual Studio Code.
3. Open terminal and move to root folder, like: git\vue-ugv-ui-prototype>
4. Run the command to start the program:
```sh
npm run dev
```
5. If needed to install some dependencies can use:
```sh
npm install
```
6. Go to the link and start using the program: http://localhost:5173/