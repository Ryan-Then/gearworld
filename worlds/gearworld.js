//Latest gearworld
export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite"
    ];
	
    Constants.UserBehaviorDirectory = "behaviors/gearworld";
    Constants.UserBehaviorModules = [
        "lights.js", "drawing.js", "gridFloor.js", "earth.js", "createCuboid.js", "createSphere.js", "createCylinder.js", "cascade.js", "rapier.js", "gearSpin.js", "gearCounterSpin.js", "sticky.js"
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
		
		
		
		/* {		
		card: {
            name: 'menu label',
			
			translation: [3, 0, 1.5],
			rotation: [0, -Math.PI / 2, 0],
            depth: 0.05,
			type: "text",
			runs: [{text: "Thickness\n\nEnable Bevel\n\nBevel Thickness\n\nBevel Size\n"}],
			margins: {left: 20, top: 20, right: 20, bottom: 20},
			backgroundColor: 0x888888,
			color: 0x000000,
			//color: 0xf4e056,
			frameColor: frameColor,
			width: 0.8,
			height: 0.7,
			textScale: 0.002,
			shadow: true,
			}
		}, */

        

			
	
        
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
