//Latest gearworld
export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite"
    ];

    Constants.UserBehaviorDirectory = "behaviors/gearworld";
    Constants.UserBehaviorModules = [
        "lights.js", "drawing.js", "gridFloor.js", "earth.js", "createCuboid.js", "createSphere.js", "createCylinder.js", "cascade.js", "rapier.js", "gearSpin.js", "gearCounterSpin.js"
         ];

    Constants.UseRapier = true;
    const frameColor = 0x888888;
    const cardHeight = 0.5;
    const baseY = 6;
    const bt = [-20, baseY, 64]; // bt for base translation
    const baseSize = [20, 1, 20];
    Constants.DefaultCards = [		
		{
            card: {
                name: "world model",
                behaviorModules: ["GridFloor"],
                layers: ["walk"],
                type: "object",
                translation: [0, -1.7, 0],
                shadow: true,
            }
        },
		

        {
            card: {
                name: "text editor 1",
                className: "TextFieldActor",
                translation: [2.9, 0.36, 1.16],
                rotation: [0, -Math.PI / 2, 0],
                depth: 0.0,
                type: "text",
                runs: [{text: "13"}],
                margins: {left: 20, top: 20, right: 20, bottom: 20},
                backgroundColor: 0xffffff,
                color: 0x000000,
                //color: 0xf4e056,
                frameColor: frameColor,
                width: 0.5,
                height: 0.15,
                textScale: 0.002,
                shadow: true,
				behaviorModules: ["precisionInput"],
            }
        },		
		
        {
            card: {
				type: "3d",
				modelType: "glb",
				name: "biggear",
                dataLocation: "./assets/3D/biggear.glb",
				rotation: [0, 0, 0],
				translation: [0, 2, 0],
				behaviorModules: ["gearCounterSpin"],
				scale: [0.5, 0.5, 0.5],
            }
        },
        {
            card: {
				type: "3d",
				modelType: "glb",
				name: "smallgear",
                dataLocation: "./assets/3D/smallgear.glb",
				rotation: [0, 0, 0],
				color: 0xaa6666,
				translation: [0, 2, -1.17],
				behaviorModules: ["gearSpin"],
				scale: [0.45, 0.45, 0.45],
            }
        },



		{		
		card: {
                name: "extrusion parameter display",
                translation: [2.9, 0, 1],
                rotation: [0, -Math.PI / 2, 0],
                scale: [0.5, 0.5, 0.5],
                type: "2d",
                textureType: "canvas",
                textureWidth: 375,
                textureHeight: 1125,
                width: 1.25,
                height: 3.75,
                frameColor: frameColor,
                // color: 0xffffff,
                
                behaviorModules: ["smallDisplay"],
            },
			
		},



		{
            card: {
                name: "drawing",
                layers: ["pointer"],
                type: "2d",
                textureType: "canvas",
                behaviorModules: ["DrawingCanvas"],
                textureWidth: 1024,
                textureHeight: 1024,
				rotation: [0, Math.PI/2, 0],
                translation: [3, 0, 0],
                fullBright: true,
                width: 4,
                height: 4
            }
		},			
        {
            card: {
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light"],
                clearColor: 0xaabbff,
            }
        },

        {
            card: {
                name: "portal button",
                translation: [0.5, 0.366177949493676, -2.566177949493676],
                behaviorModules: ["OpenRefineryPortalButton"],
				type: "object",
            }
        },
        {
            card: {
		        name: "cuboid label",
				translation: [0.5, 0, -2.566177949493676],
				type: "2d",
                textureType: "image",
                textureLocation: "./assets/images/cuboid.png",
                cardHilite: 0xffffaa,
                fullBright: true,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
            }
        },		
        {
            card: {
                name: "portal button sphere",
                translation: [2.5, 0.366177949493676, -2.566177949493676],
                behaviorModules: ["OpenRefineryPortalButtonSphere"],
                type: "object",
            }
        },
        {
            card: {
		        name: "sphere label",
				translation: [2.5, 0, -2.566177949493676],
				type: "2d",
                textureType: "image",
                textureLocation: "./assets/images/sphere.png",
                cardHilite: 0xffffaa,
                fullBright: true,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
            }
        },		
        {
            card: {
                name: "portal button cylinder",
                translation: [-1.5, 0.366177949493676, -2.566177949493676],
                behaviorModules: ["OpenRefineryPortalButtonCylinder"],
                type: "object",
            }
        },
        {
            card: {
		        name: "cylinder label",
				translation: [-1.5, 0, -2.566177949493676],
				type: "2d",
                textureType: "image",
                textureLocation: "./assets/images/cylinder.png",
                cardHilite: 0xffffaa,
                fullBright: true,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
            }
        }		


    ];
}