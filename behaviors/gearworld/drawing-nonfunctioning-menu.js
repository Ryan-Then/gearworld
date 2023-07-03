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
		if (this.windows) {
            this.windows.forEach((w) => w.destroy());
        }
        this.windows = [];

        if (this.dismiss) {
            this.dismiss.destroy();
        }

        let extent = {x: this._cardData.width, y: this._cardData.height};
		//FROM PROPERTY SHEET END

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
        this.clearButton1 = this.createCard({
            name:"clearButton1",
            type: "object",
            layers: ["pointer"],
            translation: [0.3, 1, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "clear1",
            noSave: true
        });	

		//Select parameter buttons
		
		this.listen("select0", "select0");
        this.select0 = this.createCard({
            name:"select0",
            type: "object",
            layers: ["pointer"],
            translation: [-1.5, 0.6, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "select0",
            noSave: true
        });	

		this.listen("select1", "select1");
        this.select1 = this.createCard({
            name:"select1",
            type: "object",
            layers: ["pointer"],
            translation: [-1.5, 0.3, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "select1",
            noSave: true
        });	 

 		this.listen("select2", "select2");
        this.select2 = this.createCard({
            name:"select2",
            type: "object",
            layers: ["pointer"],
            translation: [-1.5, 0, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "select2",
            noSave: true
        });	 

 		this.listen("select3", "select3");
        this.select3 = this.createCard({
            name:"select3",
            type: "object",
            layers: ["pointer"],
            translation: [-1.5, -0.3, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "select3",
            noSave: true
        });	 		
		
		this.listen("select4", "select4");
        this.select4 = this.createCard({
            name:"select4",
            type: "object",
            layers: ["pointer"],
            translation: [-1.5, -0.6, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "select4",
            noSave: true
        });	 	

		this.listen("select5", "select5");
        this.select5 = this.createCard({
            name:"select5",
            type: "object",
            layers: ["pointer"],
            translation: [-1.5, -0.9, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "select5",
            noSave: true
        });	 		
		
		this.listen("select6", "select6");
        this.select6 = this.createCard({
            name:"select6",
            type: "object",
            layers: ["pointer"],
            translation: [-1.5, -1.2, 0],
            behaviorModules: ["Button"],
            color: 0xcccccc,
            shadow: true,
            parent: this,
	    publishTo: this.id,
	    publishMsg: "select6",
            noSave: true
        });	 		
		
		//Select parameter buttons		
		
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
		
		
		console.log("setObject");
        
	    /* this.createCard({
            name: 'action menu',
            behaviorModules: ["Menu"],
            translation: [3, 0, 1.5],
            width: this.actionMenuWindow._cardData.width,
            height: this.actionMenuWindow._cardData.height,
            type: "object",
            parent: this.actionMenuWindow,
            noSave: true,
            color: 0xcccccc,
            fullBright: true,
            target: target.id});	 */
		
		//this.subscribe(this.actionMenu.id, "doAction", "doAction");
        			
		
/*         this.createCard({
            name:'code editor',
            translation: [3, 0, 1.5],//data.pose.translation,
            rotation: [0, -Math.PI / 2, 0],
            layers: ['pointer'],
            type: "code",
            behaviorModule: "DrawingCanvas.DrawingCanvasPawn",
            margins: {left: 32, top: 32, right: 32, bottom: 32},
            textScale: 0.001,
            width: 1.5,
            height: 2,
            depth: 0.05,
            fullBright: true,
            frameColor: 0x888888,
            scrollBar: true,
        });	 */	
		
		this.createCard({
            name: 'action menu',
            behaviorModules: ["Menu"],
            translation: [2.9, 0, 1.4],
			rotation: [0, -Math.PI / 2, 0],
            width: 1.6,
            height: 2,
            type: "2d",
            noSave: true,
			fullBright: true,
            depth: 0.01,
            cornerRadius: 0.05,
        });
		this.actionMenu.call("ActionMenu$ActionMenuActor", "show");
		
        /* this.createCard({
            name: 'action menu',
            behaviorModules: ["Menu"],
            translation: [3, 0, 1.5],
            width: 1.5,
            height: 2,
            type: "object",
            //parent: this,
            noSave: true,
            color: 0xcccccc,
            fullBright: true,
            target: target.id}); */				
		
        console.log("DrawingCanvasActor.setup");
    }
//end setup()

    show() {
        if (this.menu) {
            this.menu.destroy();
        }

        /* this.createCard({
            name: 'action menu',
            behaviorModules: ["Menu"],
            translation: [3, 0, 1.5],
            width: 1.5,
            height: 2,
            type: "object",
            //parent: this,
            noSave: true,
            color: 0xcccccc,
            fullBright: true,
            target: target.id});	 */

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

    select0() {	
		console.log("this is select0");
		//////START
		
		myAvatar.anotherArrayChoice = 0;
		
		console.log("myAvatar.anotherArrayChoice in select0");
        console.log(myAvatar.anotherArrayChoice);
        
    }
	
    select1() {	
		console.log("this is select1");
		//////START
		
		myAvatar.anotherArrayChoice = 1;
		
		console.log("myAvatar.anotherArrayChoice in select0");
        console.log(myAvatar.anotherArrayChoice);
        
    }

    select2() {	//boolean
		console.log("this is select2");
		//////START
		
		myAvatar.anotherArrayChoice = 2;
		
		console.log("myAvatar.anotherArrayChoice in select0");
        console.log(myAvatar.anotherArrayChoice);
        
    }

    select3() {	
		console.log("this is select3");
		//////START
		
		myAvatar.anotherArrayChoice = 3;
		
		console.log("myAvatar.anotherArrayChoice in select0");
        console.log(myAvatar.anotherArrayChoice);
        
    }

    select4() {	
		console.log("this is select4");
		//////START
		
		myAvatar.anotherArrayChoice = 4;
		
		console.log("myAvatar.anotherArrayChoice in select0");
        console.log(myAvatar.anotherArrayChoice);
        
    }

    select5() {	
		console.log("this is select5");
		//////START
		
		myAvatar.anotherArrayChoice = 5;
		
		console.log("myAvatar.anotherArrayChoice in select0");
        console.log(myAvatar.anotherArrayChoice);
        
    }	    
	
	select6() {	
		console.log("this is select6");
		//////START
		
		myAvatar.anotherArrayChoice = 6;
		
		console.log("myAvatar.anotherArrayChoice in select6");
        console.log(myAvatar.anotherArrayChoice);
        
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

	increase() {
		let anotherArrayElement = myAvatar.anotherArray[myAvatar.anotherArrayChoice];
		
		let trueOrFalse = Number.isInteger(anotherArrayElement);
		console.log(trueOrFalse);
		if (!trueOrFalse){
		if (anotherArrayElement == false){
			myAvatar.anotherArray[myAvatar.anotherArrayChoice] = !anotherArrayElement;
		} 
		if (anotherArrayElement == true){
			myAvatar.anotherArray[myAvatar.anotherArrayChoice] = !anotherArrayElement;
		}
		} else {
		anotherArrayElement++;
		myAvatar.anotherArray[myAvatar.anotherArrayChoice] = anotherArrayElement;
		}
		console.log(anotherArrayElement);
	}	
	
	decrease() {
		let anotherArrayElement = myAvatar.anotherArray[myAvatar.anotherArrayChoice];
		
		let trueOrFalse = Number.isInteger(anotherArrayElement);
		console.log(trueOrFalse);
		if (!trueOrFalse){
		if (anotherArrayElement == false){
			myAvatar.anotherArray[myAvatar.anotherArrayChoice] = !anotherArrayElement;
		} 
		if (anotherArrayElement == true){
			myAvatar.anotherArray[myAvatar.anotherArrayChoice] = !anotherArrayElement;
		}
		} else {
		anotherArrayElement--;
		myAvatar.anotherArray[myAvatar.anotherArrayChoice] = anotherArrayElement;
		}
		console.log(anotherArrayElement);
	}		
	
	//work in progress
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
		
		//from text3D.js
		this.listen("updateShape", "generateText3D");
		
		
		//add interaction listener for setting points
		
		this.addEventListener("pointerTap", "setPoint");		

		//define array to store points (vertices)
		let myAvatar = this.getMyAvatar();
		myAvatar.anArray = [];
		
		//hard coded shortcut method of creating a new global array to store variables
		//these are the default values for the extrusionsettings
		//to change the value:
		//Click on text. listen() detects which box was clicked, sends a msg of text with the selected variable name
		//Click on increase or decrease. listen() detects if it was increase or decrease, and sends a msg to run a function
		//the function extracts the array element containing the selected variable, then subtracts 1 from it, and pushes the new variable back into the array
		
		myAvatar.anotherArray = [];
		myAvatar.anotherArray.push(3);//varSteps
		myAvatar.anotherArray.push(1);//varDepth
		myAvatar.anotherArray.push(false);//varBevelEnabled
		myAvatar.anotherArray.push(0);//varBevelThickness
		myAvatar.anotherArray.push(0);//varBevelSize
		myAvatar.anotherArray.push(0);//varBevelOffset
		myAvatar.anotherArray.push(0);//varBevelSegments	
		

		//this.makeButton();
		this.addEventListener("pointerTap", "setColor");

		//randomize pen colour when initiated (including when canvas is reset)
        this.color = this.randomColor();
        this.nib = 8; //pen nib diameter
        this.addEventListener("pointerDown", "pointerDown");

        this.drawAll();
        console.log("DrawingCanvasPawn.setup");
    }
	
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
		
		console.log("myAvatar.anArray in setPoint(evt)");
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
	
	//let myNumber = 10;
	//myNumber = decrementByOne(myNumber);
	//console.log(myNumber); // Output: 9	
	
    clear() {	
		//clear is the button on the RIGHT. It generates STRAIGHT-SIDED shapes
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
		
		console.log("anotherArray");
		console.log(myAvatar.anotherArray);
		
		let varSteps = myAvatar.anotherArray[0];
		let varDepth = myAvatar.anotherArray[1];
		
		var varBevelEnabled;
		if (myAvatar.anotherArray[2]){ //check if false
			console.log(myAvatar.anotherArray[2]);
			let varBevelEnabled = 1;
		}
		
		let varBevelThickness = myAvatar.anotherArray[3];
		let varBevelSize = myAvatar.anotherArray[4];
		let varBevelOffset = myAvatar.anotherArray[5];
		let varBevelSegments = myAvatar.anotherArray[6];
		
		let extrudeSettings = {
			steps: varSteps, //3
			depth: varDepth, //1
			bevelEnabled: varBevelEnabled, //false
			bevelThickness: varBevelThickness,//0
			bevelSize: varBevelSize,//0
			bevelOffset: varBevelOffset,//0
			bevelSegments: varBevelSegments//0
		};

		//perform extrusion using extrudeSettings
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
		//clear1 is the button on the LEFT. It generates CURVED shapes
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
		let varSteps = myAvatar.anotherArray[0];
		let varDepth = myAvatar.anotherArray[1];
		
		var varBevelEnabled;
		if (myAvatar.anotherArray[2]){ //check if false
			console.log(myAvatar.anotherArray[2]);
			let varBevelEnabled = 1;
		}
		
		let varBevelThickness = myAvatar.anotherArray[3];
		let varBevelSize = myAvatar.anotherArray[4];
		let varBevelOffset = myAvatar.anotherArray[5];
		let varBevelSegments = myAvatar.anotherArray[6];
		
		let extrudeSettings = {
			steps: varSteps, //3
			depth: varDepth, //1
			bevelEnabled: varBevelEnabled, //false
			bevelThickness: varBevelThickness,//0
			bevelSize: varBevelSize,//0
			bevelOffset: varBevelOffset,//0
			bevelSegments: varBevelSegments//0
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
		console.log("this is anArray");	
		console.log(myAvatar.anArray);
		
		console.log("this is anotherArray");	
		console.log(myAvatar.anotherArray);		
		
		console.log("this is anotherArrayChoice before select0");	
		console.log(myAvatar.anotherArrayChoice);
		
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

class BehaviorMenuActor {
    show() {
        if (this.menu) {
            this.menu.destroy();
        }

        let editIconLocation = "3rAfsLpz7uSBKuKxcjHvejhWp9mTBWh8hsqN7UnsOjJoGgYGAgFIXV0UGx4XAVwHAVwRAB0DBxcGXBsdXQddNRYkEAseOwEzGSMRMCoWQTUKEwQLBSc5JSsrQF0bHVwRAB0DBxcGXB8bEQAdBBcAARddKwMGHktLKksKNjocPyIiFBMfJRkzIyRKND4zIAZGRUVGCjECAEEFHRM6N10WEwYTXTUnEQYFHTsXOUQaAxUVFgVERR4kNxY8A0QiBAsQX0dDHTslBipENh83HQU";

        this.menu = this.createCard({
            name: 'behavior menu',
			translation: [3, 0, 1.5],
            behaviorModules: ["Menu"],
            multiple: true,
            parent: this,
            type: "2d",
            noSave: true,
            depth: 0.01,
            cornerRadius: 0.05,
            menuIcons: {"_": editIconLocation, "apply": null, "------------": null},
        }); 

        this.subscribe(this.menu.id, "itemsUpdated", "itemsUpdated");
        this.updateSelections();

        this.listen("fire", "setBehaviors");
        this.subscribe(this._cardData.target, "behaviorUpdated", "updateSelections");
    }

    updateSelections() {
        console.log("updateSelections");
        let target = this.service("ActorManager").get(this._cardData.target);
        let items = [];

        this.targetSystemModules = [];
        let behaviorModules = [...this.behaviorManager.modules];

        behaviorModules.forEach(([k, v]) => {
            if (!v.systemModule) {
                let selected = target._behaviorModules?.indexOf(k) >= 0;
                let obj = {label: k, selected};
                items.push(obj);
            } else {
                if (target._behaviorModules?.indexOf(k) >= 0) {
                    this.targetSystemModules.push({label: k, selected: true});
                }
            }
        });

        items.push({label: "------------"});
        items.push({label: 'apply'});
        this.menu.call("Menu$MenuActor", "setItems", items);
    }

    setBehaviors(data) {
        console.log("setBehaviors");
        let target = this.service("ActorManager").get(this._cardData.target);
        let selection = [ ...this.targetSystemModules, ...data.selection];
        let behaviorModules = [];

        selection.forEach((obj) => {
            let {label, selected} = obj;
            if (target.behaviorManager.modules.get(label)) {
                if (selected) {
                    behaviorModules.push(label);
                }
            }
        });
        target.updateBehaviors({behaviorModules});
    }

    itemsUpdated() {
        this.publish(this.id, "extentChanged", {x: this.menu._cardData.width, y: this.menu._cardData.height});
    }
}

class ActionMenuActor {
    show() {
        if (this.menu) {
            this.menu.destroy();
        }

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
            name: "BehaviorMenu",
            actorBehaviors: [BehaviorMenuActor]
        },
		{
            name: "ActionMenu",
            actorBehaviors: [ActionMenuActor]
        }
    ]
};

/* globals Microverse */