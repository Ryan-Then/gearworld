
export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite"
    ];
	
    Constants.UserBehaviorDirectory = "behaviors/gearworld";
    Constants.UserBehaviorModules = [
        "lights.js", "gridFloor.js", "gearSpin.js", "gearCounterSpin.js"
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
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light"],
                clearColor: 0xaabbff,
            }
        },
        
        {
            card: {
                name:"big gear",
				behaviorModules: ["gearSpin"],
                translation: [0, cardHeight, -6],
                type: "3d",
                fileName: "/biggear.glb",
                dataLocation: "./assets/3D/biggear.glb",
                dataScale: [0.566177949493676, 0.566177949493676, 0.566177949493676],
                modelType: "glb",
                dataRotation: [Math.PI / 2, Math.PI * 2, 0],
                shadow: true,
                singleSided: true,
            }
		},
		{
            card: {
                name:"small gear",
				behaviorModules: ["gearCounterSpin"],
                translation: [1.4, cardHeight, -6],
                type: "3d",
                fileName: "/smallgear.glb",
                dataLocation: "./assets/3D/smallgear.glb",
                dataScale: [0.566177949493676, 0.566177949493676, 0.566177949493676],
                modelType: "glb",
                dataRotation: [Math.PI / 2, Math.PI * 2, 0],
                shadow: true,
                singleSided: true,
            }			
        }
    ];
}		