//Latest gearworld
export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite"
    ];

    Constants.UserBehaviorDirectory = "behaviors/gearworld";
    Constants.UserBehaviorModules = [
        "urlLink.js", "lights.js", "drawing.js", "gridFloor.js", "earth.js", "createCuboid.js", "createSphere.js", "createCylinder.js", "cascade.js", "rapier.js", "gearSpin.js", "gearCounterSpin.js"
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
                name: "depth text bar",
                className: "TextFieldActor",
                translation: [2.9, -0.44, -2.5],
                rotation: [0, -Math.PI / 2, 0],
                depth: 0.01,
                type: "text",
                runs: [{text: "Depth"}],
                margins: {left: 20, top: 20, right: 20, bottom: 20},
                backgroundColor: 0xffffff,
                color: 0x000000,
                frameColor: frameColor,
                width: 0.5,
                height: 0.15,
                textScale: 0.0015,
                shadow: true,
				behaviorModules: ["PresetParaInput"],
            }
        },	        
		{
            card: {
                name: "radius text bar",
                className: "TextFieldActor",
                translation: [2.9, -0.6, -2.5],
                rotation: [0, -Math.PI / 2, 0],
                depth: 0.01,
                type: "text",
                runs: [{text: "Radius"}],
                margins: {left: 20, top: 20, right: 20, bottom: 20},
                backgroundColor: 0xffffff,
                color: 0x000000,
                frameColor: frameColor,
                width: 0.5,
                height: 0.15,
                textScale: 0.0015,
                shadow: true,
				behaviorModules: ["PresetParaInput"],
            }
        },	       
		{
            card: {
                name: "material text bar",
                className: "TextFieldActor",
                translation: [2.9, 0.66, -1.95],
                rotation: [0, -Math.PI / 2, 0],
                depth: 0.01,
                type: "text",
                runs: [{text: "Material name"}],
                margins: {left: 20, top: 20, right: 20, bottom: 20},
                backgroundColor: 0xffffff,
                color: 0x000000,
                frameColor: frameColor,
                width: 0.77,
                height: 0.15,
                textScale: 0.0015,
                shadow: true,
				behaviorModules: ["materialInput"],
            }
        },	
		
        {
            card: {
                name: "density text bar",
                className: "TextFieldActor",
                translation: [2.9, 0.5, -1.95],
                rotation: [0, -Math.PI / 2, 0],
                depth: 0.01,
                type: "text",
                runs: [{text: "Density (kg/m³)"}],
                margins: {left: 20, top: 20, right: 20, bottom: 20},
                backgroundColor: 0xffffff,
                color: 0x000000,
                frameColor: frameColor,
                width: 0.77,
                height: 0.15,
                textScale: 0.0015,
                shadow: true,
				behaviorModules: ["materialInput"],
            }
        },	
		
		{
            card: {
                name: "metalness text bar",
                className: "TextFieldActor",
                translation: [2.9, 0.34, -1.95],
                rotation: [0, -Math.PI / 2, 0],
                depth: 0.01,
                type: "text",
                runs: [{text: "Metalness (0.0-1.0)"}],
                margins: {left: 20, top: 20, right: 20, bottom: 20},
                backgroundColor: 0xffffff,
                color: 0x000000,
                frameColor: frameColor,
                width: 0.77,
                height: 0.15,
                textScale: 0.0015,
                shadow: true,
				behaviorModules: ["materialInput"],
            }
        },	
		
        {
            card: {
                name: "coordinate text bar",
                className: "TextFieldActor",
                translation: [2.9, 0.52, 1.3],
                rotation: [0, -Math.PI / 2, 0],
                depth: 0.01,
                type: "text",
                runs: [{text: "X"}],
                margins: {left: 20, top: 20, right: 20, bottom: 20},
                backgroundColor: 0xffffff,
                color: 0x000000,
                frameColor: frameColor,
                width: 0.77,
                height: 0.15,
                textScale: 0.002,
                shadow: true,
				behaviorModules: ["precisionInput"],
            }
        },	

        {
            card: {
                name: "coordinate text bar 2",
                className: "TextFieldActor",
                translation: [2.9, 0.36, 1.3],
                rotation: [0, -Math.PI / 2, 0],
                depth: 0.01,
                type: "text",
                runs: [{text: "Y"}],
                margins: {left: 20, top: 20, right: 20, bottom: 20},
                backgroundColor: 0xffffff,
                color: 0x000000,
                frameColor: frameColor,
                width: 0.77,
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
                name: "3d object parameter display",
                translation: [2.9, 0.4, -1],
                rotation: [0, -Math.PI / 2, 0],
                scale: [0.5, 0.5, 0.5],
                type: "2d",
                textureType: "canvas",
                textureWidth: 1600,
                textureHeight: 800,
                width: 4,
                height: 2,
                frameColor: frameColor,
                // color: 0xffffff,
                
                behaviorModules: ["polyDataDisplay"],
            }
			
		},
		
		{		
		card: {
                name: "object materials display",
                translation: [2.9, 0.63, -1],
                rotation: [0, -Math.PI / 2, 0],
                scale: [0.5, 0.5, 0.5],
                type: "2d",
                textureType: "canvas",
                textureWidth: 1600,
                textureHeight: 600,
                width: 4,
                height: 1.5,
                frameColor: frameColor,
                // color: 0xffffff,
                
                behaviorModules: ["Materials Display"],
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
		        name: "canvas axis label underlay",
				translation: [3, 0, 0],
				rotation: [0, -Math.PI / 2, 0],
				type: "2d",
				width: 1,
				height: 1,
				scale: [1.2, 1.2, 0.5],
                textureType: "image",
                textureLocation: "./assets/images/underlay.png",
                color: 0xcccccc,
                fullBright: true,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
            }
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

		


    ];
}