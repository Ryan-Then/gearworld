/**
A stroke object looks to have the following schema, if we define an actual class for it.
However, we use plain JS objects in the actual implementation.
class Stroke {
    constructor() {
        this.done = true;
        this.segments = [];
    }
    addSegment(segment) {
        this.segments.push(segment);
    }
    undo() {
        this.done = false;
    }
    redo() {
        this.done = true;
    }
}
strokeLists is a Map keyed by the viewId so that undo request from a user can be handled.
globals is an ordered list that stores all strokes since the beginning of the session.
*/

class DrawingCanvasActor {
    setup() {
        this.subscribe(this.sessionId, "view-exit", "viewExit");
        this.listen("startLine", "startLine");
        this.listen("addLine", "addLine");
		
		//FROM PROPERTY SHEET
		//this.listen("launchCodeEditor", "launchCodeEditor");

		//the Clear button is created inside the DrawingCanvasActor class so that it is attached to the canvas. 
		//When gizmo.js is used to move the canvas, the button will move along with it.
		
		//button 1
		//START
		
		//initiate "clear" method
        this.listen("clear", "clear");
		
        if (!this._cardData.globalDrawing) {
            this._cardData.globalDrawing = []; //empties out canvas
            this._cardData.strokeLists = new Map(); //sets new Map (?)
        }

        if (this.clearButton) {
            this.clearButton.destroy();
        }
        this.clearButton = this.createCard({
            name:"clearButton",
            type: "object",
            layers: ["pointer"],
            translation: [-0.3, 1, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "clear",
            noSave: true
        });
		
		//button 2
        this.listen("clear1", "clear1");
        if (!this._cardData.globalDrawing) {
            this._cardData.globalDrawing = [];
            this._cardData.strokeLists = new Map();
        }

        if (this.clearButton1) {
            this.clearButton1.destroy();
        }
		
		//Arrows
		this.listen("increase", "increase");
        this.clearButton1 = this.createCard({
            name:"increaseButton",
            type: "object",
            layers: ["pointer"],
            translation: [-2.1, 0.2, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "increase",
            noSave: true
        });	

		this.listen("decrease", "decrease");
        this.clearButton1 = this.createCard({
            name:"decreaseButton",
            type: "object",
            layers: ["pointer"],
            translation: [-2.1, -0.2, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "decrease",
            noSave: true
        });	
		//Arrows		
		
		
		//Work in progress
		let extent = {x: this._cardData.width, y: this._cardData.height};
		
		//Work in progress
		placeActionMenu();
		
        console.log("DrawingCanvasActor.setup");
    }

//Work in progress
	newWindow(extent, position) {		
	
		let sheetWindow = this.createCard({
            name: 'window',
            //behaviorModules: ["PropertySheetWindow"],
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
//Work in progress end	

//Work in progress
	placeActionMenu() {
		let menu = this.createCard({
			name: "property panel",
			behaviorModules: ["PropertySheet"],
			translation: pose.translation,
			rotation: pose.rotation,
			type: "object",
			fullBright: true,
			color: 0xffffff,
			frameColor: 0x666666,
			width: 3,
			height: 3.2,
			cornerRadius: 0.02,
			depth: 0.02,
			noSave: true,
			target: this.id,
		});
		menu.call("PropertySheet$PropertySheetActor", "setObject", this);		
		
		console.log("placeActionMenu");
		this.target = target;
		
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
		
		this.actionMenuWindow = this.newWindow({x: 0.8, y: 0.6}, {x: 0.9, y: -1.1});
        this.actionMenu = this.createCard({
            name: 'action menu',
            behaviorModules: ["ActionMenu"],
            translation: [0, 0, 0.08],
            width: this.actionMenuWindow._cardData.width,
            height: this.actionMenuWindow._cardData.height,
            type: "object",
            parent: this.actionMenuWindow,
            noSave: true,
            color: 0xcccccc,
            fullBright: true,
            target: target.id});
			
		this.subscribe(this.actionMenu.id, "extentChanged", "actionMenuExtentChanged")
        this.subscribe(this.actionMenu.id, "doAction", "doAction")
        this.actionMenu.call("ActionMenu$ActionMenuActor", "show");
        this.listen("dismiss", "dismiss");			
			
	}
//Work in progress end

    setData(data) {
        let {global, strokeLists} = data;
        this._cardData.globalDrawing = global;
        this._cardData.strokeLists = strokeLists;
    }

    viewExit(viewId) {
        this._cardData.strokeLists.delete(viewId);
    }

    addLine(data) {
        let {viewId, x0, y0, x1, y1, color, nib, under, isNew} = data;

        let global = this._cardData.globalDrawing;
        let strokeLists = this._cardData.strokeLists;
        let strokes = strokeLists.get(viewId);
        if (!strokes) {
            strokes = [];
            strokeLists.set(viewId, strokes);
        }

        let stroke;
        if (isNew) {
            stroke = {done: true, segments: []};
            global.push(stroke);
            strokes.push(stroke);
        } else {
            stroke = strokes[strokes.length - 1];
        }

        let segment = {x0, y0, x1, y1, color, nib, under, viewId};
        stroke.segments.push(segment);
        this.say("drawLine", segment);
    }

    clear(_viewId) {
        // this._get("global").length = 0;
        // this._get("strokeLists").clear();
        this._cardData.globalDrawing = [];
        this._cardData.strokeLists = new Map();
        this.say("drawAll");
    }

    clear1(_viewId) {
        // this._get("global").length = 0;
        // this._get("strokeLists").clear();
        this._cardData.globalDrawing = [];
        this._cardData.strokeLists = new Map();
        this.say("drawAll1");
    }	
	
	setObject() {console.log("set object");}
}

class DrawingCanvasPawn {
    setup() {
        this.listen("drawLine", "drawLineAndMove");
        this.listen("drawAll", "drawAll");
		this.listen("drawAll1", "drawAll1");
        this.listen("resizeAndDraw", "resizeAndDraw");
        this.listen("colorSelected", "colorSelected");
        this.listen("nibSelected", "nibSelected");
		
		//add interaction listener for setting points
		
		this.addEventListener("pointerTap", "setPoint");		

		//define array to store points (vertices)
		let myAvatar = this.getMyAvatar();
		myAvatar.anArray = [];

		this.makeButton();
		this.addEventListener("pointerTap", "setColor");

		//randomize pen colour when initiated (including when canvas is reset)
        this.color = this.randomColor();
        this.nib = 8; //pen nib diameter
        this.addEventListener("pointerDown", "pointerDown");

        this.drawAll();
        console.log("DrawingCanvasPawn.setup");
    }
	
/*     setColor() { // Changes colour to green when button is pressed
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
    }	 */

    resize(width, height) {
        console.log(width, height);
    }

	
	//WORKING
	setPoint(evt){	
		//system to log x and y position on canvas based on pointerTap coordinate in 3D space in the world
		evt = this.cookEvent(evt);
		
		//define offsetx/y as being x/y coordinate of mouse at the moment the pointerTap event was logged
        let offsetX = evt.x;
        let offsetY = evt.y;
		myAvatar.anArray.push([offsetX, offsetY]);
			
		console.log(myAvatar.anArray);	
		return;
	}	

    resizeAndDraw() {
        /*
        let width = this.model._get("width");
        let height = this.model._get("height");
        if (width && height) {
            this.resize(width, height);
        }
        */
        this.drawAll();
    }

    colorSelected(color) {
        this.color = color;
    }

    nibSelected(nib) {
        this.nib = nib;
    }
	
    clear() {	
		//////START
		const shape = new THREE.Shape();
		
		//Move or set the .currentPoint to moveTo(x, y)
		shape.moveTo( myAvatar.anArray[0][0] * 0.001, myAvatar.anArray[0][1] * 0.001 );
		
		//loop to iterate through array to call shape.lineTo for each element in the array
		let n = 1; 
		let limit = myAvatar.anArray.length;

		while (n < limit) { //n is for array
			let vertX = myAvatar.anArray[n][0] * 0.001; //variable assignment and downscaling vertex number, to reduce size of object when extruded
			let vertY = myAvatar.anArray[n][1] * 0.001;
			
			console.log(vertX);
			console.log(vertY);
			
			//.lineTo ( x : Float, y : Float )
			shape.lineTo( vertX, vertY );
			n++;
		}
		
		//ExtrudeGeometry
		console.log(shape.getPoints());
		const extrudeSettings = {
			steps: 3, //number of connections
			depth: 1, //depth means thickness
			bevelEnabled: false, //true
			bevelThickness: 0,//1
			bevelSize: 0,//1
			bevelOffset: 0,
			bevelSegments: 0//1
		};

		const geometry1 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		const material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const newShape = new THREE.Mesh( geometry1, material1 ) ;
		this.shape.add(newShape);
		
		myAvatar.anArray = [];
		console.log(myAvatar.anArray);
		//////END			
		
        console.log("CLEAR")
        let canvas = this.canvas;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.texture.needsUpdate = true;
    }	

    clear1() {	
		console.log("this is clear1");
		//////START
		const shape = new THREE.Shape();
		
		//Move or set the .currentPoint to moveTo(x, y)
		shape.moveTo( 0, 0 );
		
		//loop to iterate through array to call shape.lineTo for each element in the array

		let n = 2; 

		while (n < myAvatar.anArray.length) { //n is for array
				let vert1X = myAvatar.anArray[n-2][0] * 0.001; //variable assignment and downscaling vertex number, to reduce size of object when extruded
				let vert1Y = myAvatar.anArray[n-2][1] * 0.001;

				let vert2X = myAvatar.anArray[n-1][0] * 0.001; //variable assignment and downscaling vertex number, to reduce size of object when extruded
				let vert2Y = myAvatar.anArray[n-1][1] * 0.001;	

				let vertX = myAvatar.anArray[n][0] * 0.001; //variable assignment and downscaling vertex number, to reduce size of object when extruded
				let vertY = myAvatar.anArray[n][1] * 0.001;			
			
			//.quadraticCurveTo ( cpX : Float, cpY : Float, x : Float, y : Float )
			shape.bezierCurveTo( vert1X, vert1Y, vert2X, vert2Y, vertX, vertY );
			n++;
			n++;
			n++;
		}


		const extrudeSettings = {
			steps: 3, //number of connections
			depth: 1, //depth means thickness
			bevelEnabled: false, //true
			bevelThickness: 0,//1
			bevelSize: 0,//1
			bevelOffset: 0,
			bevelSegments: 0//1
		};

		const geometry1 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		const material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const newShape = new THREE.Mesh( geometry1, material1 ) ;
		this.shape.add(newShape);
		
		myAvatar.anArray = [];
		console.log(myAvatar.anArray);
		//////END			
		
        console.log("CLEAR1");
        let canvas = this.canvas;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.texture.needsUpdate = true;
    }

    drawAll() {
        let global = this.actor._cardData.globalDrawing;
        if (!global) {return;}
		//this line calls the clear() method
        this.clear();
        this.drawStrokes(global);
    }
	
    drawAll1() {
        let global = this.actor._cardData.globalDrawing;
        if (!global) {return;}
		//this line calls the clear1() method
        this.clear1();
        this.drawStrokes(global);
    }	

    drawStrokes(strokes) {
        strokes.forEach((stroke) => {
            if (!stroke.done) {return;}
            stroke.segments.forEach((segment) => {
                this.drawLine(segment);
            });
        });
        this.texture.needsUpdate = true;
    }

    drawLineAndMove(segment) {
        this.drawLine(segment);
        this.texture.needsUpdate = true;
    }

    drawLine(segment) {
        let {x0, y0, x1, y1, color, under, nib} = segment;

        let p0 = this.invertPoint(x0, y0);
        let p1 = this.invertPoint(x1, y1);

        let ctx = this.canvas.getContext("2d");

        let rule = "source-over";
        let c = color || "black";
        if (color === "#00000000") {
            rule = "destination-out";
            c = "green";
        }
        if (under) {
            rule = "destinationover";
        }
        ctx.globalCompositeOperation = rule;
        ctx.lineWidth = nib || 8;
        ctx.lineCap = "round";
        ctx.strokeStyle = c;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    }

    pointerDown(evt) {
        if (evt.buttons !== 1) {return;}
        if (this.disabled) {return;}

        evt = this.cookEvent(evt);

        this.addEventListener("pointerMove", "pointerMove");
        this.addEventListener("pointerUp", "pointerUp");

        let offsetX = evt.x;
        let offsetY = evt.y;
        let p = this.transformPoint(offsetX, offsetY);
        this.lastPoint = p;
        this.isNew = true;
    }

    pointerMove(evt) {
        if (evt.buttons !== 1) {return;}
        if (this.disabled) {return;}

        evt = this.cookEvent(evt);

        if (this.lastPoint) {
            let x0 = this.lastPoint.x;
            let y0 = this.lastPoint.y;

            let p = this.transformPoint(evt.x, evt.y);

            let color = this.color;
            let nibScale = this.parentNode ? this.parentNode.scale : 1;
            if (!nibScale) {
                nibScale = 1;
            }
            let nib = this.nib / nibScale;
            this.lastPoint = p;
            let isNew = this.isNew;
            this.isNew = false;
            this.say("addLine", {viewId: this.viewId, x0, y0, x1: p.x, y1: p.y, color, nib, isNew});
        }
    }

    pointerUp(evt) {
        if (!this.lastPoint) {return;}
        if (this.disabled) {return;}
        console.log("pointerUp");

        let cooked = this.cookEvent(evt);
        let p = this.transformPoint(cooked.x, cooked.y);
        let last = this.lastPoint;
        if (last && last.x === p.x && last.y === p.y) {
            this.pointerMove({buttons: evt.buttons,
                              offsetX: cooked.x + 0.01,
                              offsetY: cooked.y});
            this.publish(this.sessionId, "triggerPersist");
        }
        this.lastPoint = null;

        this.removeEventListener("pointerUp", "pointerUp");
        this.removeEventListener("pointerMove", "pointerMove");
    }

    cookEvent(evt) {
        if (!evt.xyz) {return;}
        let vec = new Microverse.THREE.Vector3(...evt.xyz);
        let inv = this.renderObject.matrixWorld.clone().invert();
        let vec2 = vec.applyMatrix4(inv);

        let x = (vec2.x + 0.5) * this.actor._cardData.textureWidth;
        let y = (-vec2.y + 0.5) * this.actor._cardData.textureHeight;

        console.log(x, y);

        return {x, y};

        /*
        let width = this.plane.geometry.parameters.width;
        let height = this.plane.geometry.parameters.height;
        let x = ((width / 2) + vec2.x) / this.textScale();
        let y = ((height / 2) - vec2.y + this.getScrollTop(height)) / this.textScale();
        return {x, y};
        */
    }

    transformPoint(x, y) {
        return {x, y};
    }

    invertPoint(x, y) {
        return {x, y};
    }

    teardown() {
        this.removeEventListener("pointerUp", "pointerUp");
        this.removeEventListener("pointerMove", "pointerMove");
        this.removeEventListener("pointerDown", "pointerDown");
    }

//randomize pen colour
    randomColor() {
        let h = Math.floor(Math.random() * 360);
        return `hsl(${h} 75% 75%)`;
    }
}

class ButtonActor {
	//Actors are the model part of the M-V-C system
	//ButtonActor serves to detect a user click/touch/hold event on the button
	//Once detected, the actor triggers the cardData to publish a message, which will in turn trigger a method in the DrawingCanvasPawn class
    setup() {
        this.addEventListener("pointerDown", "doit");
    }

    doit() {
		console.log("this is the array");	
		console.log(myAvatar.anArray);
		
	
		
        this.publish(this._cardData.publishTo, this._cardData.publishMsg)
        //console.log("doit");
    }

    teardown() {
    }
}

class ButtonPawn {
	//Recall that pawns are the view part of the M-V-C system
	//Button visual parameters are defined here
	//Same Button class is used for both buttons at the moment. Can duplicate the class and change the pawn in the duplicate, to create different button
    setup() {
        [...this.shape.children].forEach((c) => this.shape.remove(c));

        let s = 0.2;
        let geometry = new Microverse.THREE.BoxGeometry(s, s, s);
        let material = new Microverse.THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0xff0000});
        this.obj = new Microverse.THREE.Mesh(geometry, material);
        this.obj.castShadow = this.actor._cardData.shadow;
        this.obj.receiveShadow = this.actor._cardData.shadow;
        this.shape.add(this.obj);		
		
    }
}

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
            name: "DrawingCanvas",
            actorBehaviors: [DrawingCanvasActor],
            pawnBehaviors: [DrawingCanvasPawn],
        },
        {
            name: "Button",
            actorBehaviors: [ButtonActor],
            pawnBehaviors: [ButtonPawn],
        },
        {
            name: "ActionMenu",
            actorBehaviors: [ActionMenuActor]
        }
    ]
};

/* globals Microverse */