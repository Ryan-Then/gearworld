class OpenRefineryPortalActor {
    setup() {
        this.addEventListener("pointerTap", "pressed");
    }

/*         let kinematic;
        let physicsType = this._cardData.physicsType;
        if (physicsType === "positionBased") {
            kinematic = Microverse.Physics.RigidBodyDesc.newKinematicPositionBased();
        } 
        this.call("Physics$PhysicsActor", "createRigidBody", kinematic); */
		

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
                name:"cylinder",
                type: "object",
                translation: [-1.5, 1, -2.566177949493676],
                layers: ["pointer"],
                physicsSize:[0.3, 0.5, 1],
                behaviorModules: ["Physics", "Cascade"],
                physicsShape: "cylinder",
                physicsType: "positionBased"
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
            name: "OpenRefineryPortalButtonCylinder",
            actorBehaviors: [OpenRefineryPortalActor],
            pawnBehaviors: [OpenRefineryPortalPawn]
        }
    ]
}

/* globals Microverse */
