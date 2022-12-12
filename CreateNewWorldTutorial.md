# Creating A New World (Step-by-step Tutorial)

The easiest and most direct method to start creating your own worlds in Croquet is to install and initiate a Croquet Microverse via Node.js. 

First, install Node.js. This is a prerequisite for Croquet to run. The latest available releases of the Node.js installer are free to download on https://nodejs.org/en/ the Node.js website. It is recommended that the 18.12.0 LTS version is used. Proceed to run the installer, and it will install both Node.js and NPM on your machine. 

Next, create an empty folder anywhere you like. Inside the folder, click on the address bar and type "cmd". This brings up the terminal in this folder. 

Next, paste the following command into the terminal.

npm create croquet-microverse

Confirm with a 'y' when prompted. Just like that, a Croquet Microverse is installed on your machine. 

You can immediately start a session in a premade default world with the command:

npm start

Copy the Network URL (e.g. http://192.168.1.145:9684/) and paste it into your web browser. 

In Croquet, a World is a .js file containing a set of cards. You can find the default world in the "worlds" folder within the Croquet directory you created. To create your own world, you must create a new .js file in the "worlds" folder and name it. It is recommended that you copy the default world and add new cards into it.


# Creating An Shape-Generating Button (Step-by-step Tutorial)

To create a clickable button, we must have a card in the world file to define the appearance of the button and a behaviour module to link it to an event. We will define the card for the shape created by the button within the behaviour module itself.

The card for the button can be very simple. It can have only a name, a translation parameter, a behaviour module, and a type. An example of a card for a button is shown below:

card: {
  name: "portal button",
  translation: [x, y, z],
  behaviorModules: [string],
  type: "object"
}

Next, we must define the behaviour of the button. We can use the existing OpenPortal.js behaviour module as a template.

We need to define the shape card within the object created by the pressed() function. The "physicsSize" parameter defines the size of the shape, and the "physicsShape" parameter defines the shape. You may use three pre-existing shapes - cuboid, ball and cylinder.

pressed() {
    this.check();
    if (this.hasOpened) {return;}
    this.hasOpened = true;

this.createCard({
    name: " ",
    type: "object",
    translation: [x, y, z],
    layers: ["pointer"],
    scale: [x, y, z],
    behaviorModules: [" "],
    physicsSize:  ,
    physicsShape: " ",
    physicsType: "positionBased"
  });
}

This is all you need to make a basic interactive shape generator. 
