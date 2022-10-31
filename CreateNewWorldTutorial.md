# Create New World Tutorial (Step-by-step)

The easiest and most direct method to start creating your own worlds in Croquet is to install and initiate a Croquet Microverse via Node.js. 

First, install Node.js. This is a prerequisite for Croquet to run.

Create an empty folder anywhere you like. Inside the folder, click on the address bar and type "cmd". This brings up the terminal in this folder. 

Next, paste the following command into the terminal.

npm create croquet-microverse

Confirm with a 'y' when prompted. Just like that, a Croquet Microverse is installed on your machine. 

You can immediately start a session in a premade default world with the command:

npm start

Copy the Network URL (e.g. http://192.168.1.145:9684/) and paste it into your web browser. 

In Croquet, a World is a .js file containing a set of cards. You can find the default world in the "worlds" folder within the Croquet directory you created. To create your own world, you must create a new .js file in the "worlds" folder and name it. It is recommended that you copy the default world and add new cards into it.
