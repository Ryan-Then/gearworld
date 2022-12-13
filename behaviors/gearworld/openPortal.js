class OpenRefineryPortalActor {
    setup() {
        this.addEventListener("pointerTap", "pressed");
    }

    check() {
        let cards = this.queryCards({methodName: "isPortal"}, this);
        this.hasOpened = cards.length > 0;
    }

    isPortal(card) {
        return card.layers.includes("portal");
    } 

    pressed() {
        this.check();
        if (this.hasOpened) {return;}
        this.hasOpened = true;

		this.createCard({
			name:"base",
			type: "object",
			layers: ["pointer", "walk"],
			rotation: [-Math.PI / 6, 0, 0],
			translation: [0.5, 1, -2.5],
			behaviorModules: ["Physics", "Cascade"],
		        physicsSize: [0.7, 0.7, 0.7],
			color: 0x997777,
			physicsShape: "cuboid",
			physicsType: "positionBased",
                });
    }
}

class OpenRefineryPortalPawn {
    setup() {
        this.addEventListener("pointerMove", "nop");
        this.addEventListener("pointerEnter", "hilite");
        this.addEventListener("pointerLeave", "unhilite");
        this.makeButton();
        this.listen("portalChanged", "setColor");
    }

    setColor() { // Changes colour to green when button is pressed
        let baseColor = !this.actor.hasOpened
            ? (this.entered ? 0xeeeeee : 0xcccccc)
            : 0x22ff22;

        if (this.shape.children[0] && this.shape.children[0].material) {
            this.shape.children[0].material.color.setHex(baseColor);
        }
    }

    makeButton() {
        [...this.shape.children].forEach((c) => this.shape.remove(c));

        let geometry = new Microverse.THREE.SphereGeometry(0.15, 16, 16);
        let material = new Microverse.THREE.MeshStandardMaterial({color: 0xcccccc, metalness: 0.8});
        let button = new Microverse.THREE.Mesh(geometry, material);
        this.shape.add(button);
        this.setColor();
    }

    hilite() {
        this.entered = true;
        this.setColor();
    }

    unhilite() {
        this.entered = false;
        this.setColor();
    }
}

export default {
    modules: [
        {
            name: "OpenRefineryPortalButton",
            actorBehaviors: [OpenRefineryPortalActor],
            pawnBehaviors: [OpenRefineryPortalPawn]
        }
    ]
}

/* globals Microverse */
