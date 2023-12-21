# ETHEREUM TEAM PROJECT

Change directory to the “back” folder
cd back

Execute the yarn command
Yarn

And run de backend with the command:
npx nodemon app.js

Now for the frontend. Change the directory to the frontend folder in the Vs Code terminal
cd frontend 

Install the npm 
npm install 

And run the frontend with this command
npm run dev


Then go to the web browser and input
http:/localhost:5173

Click the button 
→ Create network in Interface


It wil automatically create the containers using the following command:
docker-compose -f ./back/datos/networks/demotest1/docker-compose.yml up


Configure Network in Metamask

Import miner account metamask
    getEthWalletAddress.js
		Change path - without back
	cd back
	node getEthWalletAddress.js
	


For error pool overlaps:
docker network prune



