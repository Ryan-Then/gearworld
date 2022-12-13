
export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite"
    ];
	
    Constants.UserBehaviorDirectory = "behaviors/gearworld";
    Constants.UserBehaviorModules = [
        "lights.js", "gridFloor.js", "earth.js", "openPortal.js", "openPortalSphere.js", "openPortalCylinder.js", "cascade.js", "rapier.js"
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
