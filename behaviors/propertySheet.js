// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io

/*

PropertySheet holds a few other "windows" as if it is a traditional
2.5 D display area. By default, it contains a menu (MenuActor) for the
list of available modules, another menu for typical actions, and a
text area where the user can enter a card spec to modify the card.

The content of the card spec area is not evaluated as JavaScript
code. Rather it splits the content into lines, and then each line is
splited at a colon (":"). The second part is parsed by JSON.parse()
and used as a value for the property name specified by the first part.

Properties known to
contain a rotation are special cased so that if the value is an array of
3-elements, it is converted to a quaternion.

*/

class PropertySheetActor {
    setup() {
        if (this.windows) {
            this.windows.forEach((w) => w.destroy());
        }
        this.windows = [];

        if (this.dismiss) {
            this.dismiss.destroy();
        }

        let extent = {x: this._cardData.width, y: this._cardData.height};
        this.dismiss = this.createCard({
            translation: [extent.x / 2 - 0.05, extent.y / 2 - 0.05, 0.041],
            name: 'dismiss',
            behaviorModules: ["PropertySheetDismiss"],
            parent: this,
            type: "object",
            noSave: true,
        });
        this.subscribe(this.dismiss.id, "dismiss", "dismissSheet");
    }
	
    dismissSheet(_id) {
        if (this.dismiss) {
            this.dismiss.destroy();
        }

        if (this.windows) {
            this.windows.forEach((w) => w.destroy());
        }
        this.destroy();
    }	


    newWindow(extent, position) {
        let sheetWindow = this.createCard({
            name: 'window',
            behaviorModules: ["PropertySheetWindow"],
            parent: this,
            width: extent.x,
            height: extent.y,
            type: "object",
            fullBright: true,
            color: 0xcccccc,
            backgroundColor: 0xcccccc,
            noSave: true,
        });

        sheetWindow.set({translation: [position.x, position.y, 0.05]});
        return sheetWindow;
    }

    setObject(target) {
        console.log("setObject");
        this.target = target;
        // this.menuWindow = this.newWindow({x: 1, y: 1.5}, {x: 0.9, y: 0.4});

        this.cardSpecWindow = this.newWindow({x: 1.8, y: 2.8}, {x: -0.55, y: 0});

        this.cardSpec = this.createCard({
            className: "TextFieldActor",
            name: 'card spec',
            translation: [-0.05, 0, 0.025],
            parent: this.cardSpecWindow,
            type: "text",
            margins: {left: 8, top: 8, right: 8, bottom: 8},
            textScale: 0.0014,
            backgroundColor: 0xcccccc,
            scrollBar: true,
            barColor: 0x888888,
            knobColor: 0x606060,
            width: 1.7 - 0.04,
            height: 2.8 - 0.04,
            depth: 0.002,
            autoResize: false,
            noDismissButton: true,
            borderRadius: 0.013,
            fullBright: true,
            cornerRadius: 0,
            runs: [{text: ""}],
            noSave: true,
        });

        let cardDataString = this.cardSpecString(target);
        this.cardSpec.loadAndReset(cardDataString);
        this.subscribe(this.cardSpec.id, "text", "cardSpecAccept");

        this.actionMenuWindow = this.newWindow({x: 0.8, y: 0.6}, {x: 0.9, y: -1.1});
		
        this.actionMenu = this.createCard({
            name: 'action menu',
            behaviorModules: ["ActionMenu"],
            translation: [0, 0, 0.08],
            width: this.actionMenuWindow._cardData.width, //this gives the card the same width as the card window
            height: this.actionMenuWindow._cardData.height, //this gives the card the same height as the card window
            type: "object",
            parent: this.actionMenuWindow,
            noSave: true,
            color: 0xcccccc,
            fullBright: true,
            target: target.id});
		

        this.subscribe(this.behaviorMenu.id, "extentChanged", "menuExtentChanged")
        

        
        this.subscribe(this.actionMenu.id, "extentChanged", "actionMenuExtentChanged")
        this.subscribe(this.actionMenu.id, "doAction", "doAction")
        this.actionMenu.call("ActionMenu$ActionMenuActor", "show");
        this.listen("dismiss", "dismiss");
    }

    menuExtentChanged(data) {
        console.log("menuExtentChanged", data);
        if (this.behaviorMenu) {
            this.behaviorMenu.setCardData({
                width: data.x,
                height: data.y,
            });
        }
    }

    actionMenuExtentChanged(data) {
        if (this.actionMenuWindow) {
            this.actionMenuWindow.setCardData({width: data.x + 0.05, height: data.y + 0.05});
        }
    }

    doAction(data) {
		console.log("data.action registered");
        if (!this.target) {return;}
        if (data.action === "Delete") {
            this.target.destroy();
            this.destroy();
            return;
        }
        if (data.action === "Duplicate") {
            this.target.duplicate(data);
            return;
        }
        if (data.action === "Save") {
            this.target.saveCard(data);
            return;
        }
    }

    cardSpecString(target) {
        let data = target.collectCardData();
        let intrinsic = this.intrinsicProperties();

        let result = [];
        // okay! risking to be over engineering, I'll make the display nicer.

        intrinsic.forEach((p) => {
            let value = data[p];
            if (value === undefined) {return;}
            result.push("    ");
            result.push(p);
            result.push(": ");
            result.push(this.specValue(p, value));
            result.push(",\n");
        });

        let keys = Object.keys(data);
        keys.sort();
        keys.forEach((p) => {
            if (intrinsic.includes(p)) {return;}
            let value = data[p];
            result.push("    ");
            result.push(p);
            result.push(": ");
            result.push(this.specValue(p, value));
            result.push(",\n");
        });

        return result.join('');
    }

    specValue(p, value) {
        if (Array.isArray(value)) {
            let frags = value.map((v) => JSON.stringify(v));
            return `[${frags.join(', ')}]`;
        }

        return JSON.stringify(value);
    }

    cardSpecAccept(data) {
        let {text} = data;

        let array = text.split('\n');
        let simpleRE = /^[ \t]*([^:]+)[ \t]*:[ \t]*(.*)$/;
        let spec = {};

        let something = false;
        let errored = false;

        array.forEach((line) => {
            let match = simpleRE.exec(line);
            if (match) {
                something = true;
                let key = match[1];
                let value = match[2];
                if (value && value.endsWith(",")) {
                    value = value.slice(0, value.length - 1);
                }
                try {
                    value = JSON.parse(value);
                } catch(e) {
                    console.log(e);
                    errored = true;
                }
                if (key === "parent") {
                    if (typeof value === "string") {
                        let actor = this.getModel(value);
                        value = actor;
                    }
                }
                if (key === "rotation" || key === "dataRotation") {
                    if (Array.isArray(value) && value.length === 3) {
                        value = Microverse.q_euler(...value);
                    }
                }
                spec[key] = value;
            }
        });

        if (!something) {return;}
        if (errored) {return;}
        if (!this.target.doomed) {
            this.target.updateOptions(spec);
        }
    }
}

class PropertySheetPawn {
    setup() {
        if (this.frame) {
            this.shape.remove(this.frame);
            this.frame = null;
        }

        if (this.back) {
            this.shape.remove(this.back);
            this.back = null;
        }

        let extent = {x: this.actor._cardData.width, y: this.actor._cardData.height};

        let frameGeometry = this.roundedCornerGeometry(extent.x, extent.y, 0.04, 0.02);
        let frameMaterial = this.makePlaneMaterial(0.02, 0xcccccc, 0xcccccc, false);

        this.frame = new Microverse.THREE.Mesh(frameGeometry, frameMaterial);
        this.shape.add(this.frame);

        let backGeometry = this.roundedCornerGeometry(extent.x - 0.02, extent.y - 0.02, 0.0001, 0.02);
        let color = this.actor._cardData.frameColor || 0x525252;
        let frameColor = this.actor._cardData.frameColor || 0x525252;
        let backMaterial = this.makePlaneMaterial(0.02, color, frameColor, true);

        this.back = new Microverse.THREE.Mesh(backGeometry, backMaterial);
        this.back.position.set(0, 0, 0.04);
        this.shape.add(this.back);

        this.addEventListener("pointerMove", "pointerMove");
        this.listen("translationSet", "translated");
        this.listen("rotationSet", "translated");

        this.scrollAreaPawn = [...this.children].find((c) => {
            return c.actor._behaviorModules && c.actor._behaviorModules.indexOf("ScrollArea") >= 0;
        });

        this.addEventListener("pointerDown", "pointerDown");
        this.addEventListener("pointerUp", "pointerUp");
    }

    translated(_data) {
        this.scrollAreaPawn.say("updateDisplay");
    }

    moveMyself(evt) {
        if (!evt.ray) {return;}

        let {THREE, v3_add, v3_sub} = Microverse;

        let origin = new THREE.Vector3(...evt.ray.origin);
        let direction = new THREE.Vector3(...evt.ray.direction);
        let ray = new THREE.Ray(origin, direction);

        let dragPoint = ray.intersectPlane(
            this._dragPlane,
            new Microverse.THREE.Vector3()
        );

        let down = this.downInfo.downPosition;
        let drag = dragPoint.toArray();

        let diff = v3_sub(drag, down);
        let newPos = v3_add(this.downInfo.translation, diff);

        this.set({translation: newPos});
    }

    pointerMove(evt) {
        if (!this.downInfo) {return;}

        if (!this.downInfo.child) {
            return this.moveMyself(evt);
        }

        if (!evt.xyz) {return;}
        let vec = new Microverse.THREE.Vector3(...evt.xyz);
        let pInv = this.renderObject.matrixWorld.clone().invert();
        vec = vec.applyMatrix4(pInv);

        let origDownPoint = this.downInfo.downPosition;
        let origTranslation = this.downInfo.childTranslation;

        let deltaX = vec.x - origDownPoint.x;
        let deltaY = vec.y - origDownPoint.y;

        this.downInfo.child.translateTo([origTranslation[0] + deltaX, origTranslation[1] + deltaY, origTranslation[2]]);
        // console.log(this.downInfo, pVec2);
    }

    pointerDown(evt) {
        if (!evt.xyz) {return;}
        let {THREE} = Microverse;

        this._dragPlane = new THREE.Plane();

        this._dragPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(...evt.ray.direction),
            new THREE.Vector3(...evt.xyz)
        );

        this.downInfo = {translation: this.translation, downPosition: evt.xyz};
        let avatar = this.getMyAvatar();
        if (avatar) {
            avatar.addFirstResponder("pointerMove", {}, this);
        }
    }

    pointerUp(_evt) {
        this._dragPlane = null;
        let avatar = this.getMyAvatar();
        if (avatar) {
            avatar.removeFirstResponder("pointerMove", {}, this);
        }
    }
}

/*

PropertySheetWindow is an area on the PropertySheet. It allows the
user to drag it on the PropertySheet by picking a narrow band from the
edge. (But as of writing, the pointer is not "captured" so it stops
moving when the pointer moves with in the area that also handles
pointerMove.

*/

class PropertySheetWindowActor {
    setup() {
        if (this.dismiss) {
            this.dismiss.destroy();
        }

        this.dismiss = this.createCard({
            translation: this.dismissButtonPosition(),
            name: 'dismiss window',
            behaviorModules: ["PropertySheetDismiss"],
            parent: this,
            type: "object",
            noSave: true,
        });
        this.subscribe(this.dismiss.id, "dismiss", "dismissWindow");
    }

    dismissButtonPosition() {
        return [this._cardData.width / 2 - (0.062), this._cardData.height / 2 - (0.062), 0.031];
    }

    dismissWindow(_id) {
        this.destroy();
    }

    setObject() {console.log("set object");}
}

class PropertySheetWindowPawn {
    setup() {
        if (this.frame) {
            this.shape.remove(this.frame);
            this.frame = null;
        }

        if (this.back) {
            this.shape.remove(this.back);
            this.back = null;
        }

        let extent = {x: this.actor._cardData.width, y: this.actor._cardData.height};

        let frameGeometry = this.roundedCornerGeometry(extent.x, extent.y, 0.0001, 0.02);
        let frameMaterial = this.makePlaneMaterial(0.02, 0x000000, 0x000000, false);
        this.frame = new Microverse.THREE.Mesh(frameGeometry, frameMaterial);
        this.frame.position.set(0, 0, 0.021);
        this.shape.add(this.frame);

        let backGeometry = this.roundedCornerGeometry(extent.x - 0.02, extent.y - 0.02, 0.0001, 0.02);
        let color = this.actor._cardData.color || 0xcccccc;
        let frameColor = this.actor._cardData.frameColor || 0xcccccc;
        let backMaterial = this.makePlaneMaterial(0.02, color, frameColor, true);
        this.back = new Microverse.THREE.Mesh(backGeometry, backMaterial);
        this.back.position.set(0, 0, 0.022);
        this.shape.add(this.back);

        this.addEventListener("pointerDown", "pointerDown");
        this.addEventListener("pointerUp", "pointerUp");
        this.listen("cardDataSet", "cardDataUpdated");
    }

    cardDataUpdated() {
        console.log(this.actor._cardData.width, this.actor._cardData.height);
    }

    pointerDown(evt) {
        if (!evt.xyz) {return;}
        let vec = new Microverse.THREE.Vector3(...evt.xyz);
        let inv = this.renderObject.matrixWorld.clone().invert();
        vec = vec.applyMatrix4(inv);

        let extent = {x: this.actor._cardData.width, y: this.actor._cardData.height};
        let edge = {};

        if (vec.x < -(extent.x / 2) + 0.05) {edge.x = "left";}
        if (vec.x > (extent.x / 2) - 0.05) {edge.x = "right";}
        if (vec.y < -(extent.y / 2) + 0.05) {edge.y = "bottom";}
        if (vec.y > (extent.y / 2) - 0.05) {edge.y = "top";}

        if (!edge.x && !edge.y) {return;}

        let parent = this._parent;
        let vec2 = new Microverse.THREE.Vector3(...evt.xyz);
        let pInv = parent.renderObject.matrixWorld.clone().invert();
        vec2 = vec2.applyMatrix4(pInv);

        let downInfo = {...edge, child: this, childTranslation: this._translation, downPosition: vec2};
        this._parent.downInfo = downInfo

        this.didSetDownInfo = true;

        let avatar = this.service("PawnManager").get(evt.avatarId);
        if (avatar) {
            avatar.addFirstResponder("pointerMove", {}, this._parent);
        }
    }

    pointerUp(evt) {
        if (this.didSetDownInfo && this._parent) {
            delete this._parent.downInfo;
            let avatar = this.service("PawnManager").get(evt.avatarId);
            if (avatar) {
                avatar.removeFirstResponder("pointerMove", {}, this._parent);
            }
        }
    }
}



/*

PropertySheetDismissButton publishes a dismiss event. The container is
expected to subscribe to it to destroy itself.

*/

class ActionMenuActor {
    show() {
        if (this.menu) {
            this.menu.destroy();
        }

        this.menu = this.createCard({
            name: 'action menu',
            behaviorModules: ["Menu"],
            parent: this,
            type: "2d",
            noSave: true,
            depth: 0.01,
            cornerRadius: 0.05,
        });

        this.subscribe(this.menu.id, "itemsUpdated", "itemsUpdated");
        this.updateSelections();

        this.listen("fire", "doAction");
    }

    updateSelections() {
        console.log("action updateSelections");
        let items = [
            {label: "actions"},
            {label: "------------"},
            {label: "Duplicate"},
            {label: "Delete"},
            {label: "Save"},
        ];

        this.menu.call("Menu$MenuActor", "setItems", items);
    }

    doAction(data) {
        this.publish(this.id, "doAction", data);
    }

    itemsUpdated() {
        this.publish(this.id, "extentChanged", {x: this.menu._cardData.width, y: this.menu._cardData.height});
    }
}

export default {
    modules: [
        {
            name: "PropertySheet",
            actorBehaviors: [PropertySheetActor],
            pawnBehaviors: [PropertySheetPawn]
        },		
        {
            name: "PropertySheetWindow",
            actorBehaviors: [PropertySheetWindowActor],
            pawnBehaviors: [PropertySheetWindowPawn]
        },
        {
            name: "ActionMenu",
            actorBehaviors: [ActionMenuActor]
        }
    ]
}
/*globals Microverse */
