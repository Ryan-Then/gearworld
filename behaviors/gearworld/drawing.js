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
		const drawingCanvas = new DrawingCanvasActor();
		drawingCanvas.name = "myDrawingCanvas";		
		
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
		
        if (!this._cardData.globalDrawing) {
            this._cardData.globalDrawing = []; //empties out canvas
            this._cardData.strokeLists = new Map(); //sets new Map (?)
        }

		
		this.unemMenu = this.createCard({
            name: 'label action menu',
            behaviorModules: ["Menu"],
            translation: [2.9, 0, 1.4],
			rotation: [0, -Math.PI / 2, 0],
            width: 0.6,
            height: 0.5,
            type: "2d",
            noSave: true,
			color: 0xcccccc,
			fullBright: true,
            depth: 0.01,
            cornerRadius: 0.05,
        });
		this.unemMenu.call("unemMenu$unemMenuActor", "show");
		this.subscribe(this.unemMenu.id, "doAction", "performAction");
		
		this.unemMenu2 = this.createCard({
            name: 'label action menu 2',
            behaviorModules: ["Menu"],
            translation: [2.9, 0, 2],
			rotation: [0, -Math.PI / 2, 0],
            width: 0.35,
            height: 0.5,
            type: "2d",
            noSave: true,
			color: 0xcccccc,
			fullBright: true,
            depth: 0.01,
            cornerRadius: 0.05,
        });
		this.unemMenu2.call("unemMenu2$unemMenuActor2", "show");
		this.subscribe(this.unemMenu2.id, "doAction2", "increaseDecrease");		
		
		this.clickToGenerate = this.createCard({
            name: 'label action menu 3',
            behaviorModules: ["Menu"],
            translation: [3, 0.8, 0],
			rotation: [0, -Math.PI / 2, 0],
            width: 0.7,
            height: 0.5,
            type: "2d",
            noSave: true,
			color: 0xcccccc,
			fullBright: true,
            depth: 0.01,
            cornerRadius: 0.05,
        });
		this.clickToGenerate.call("clickToGenerate$clickToGenerate", "show");
		this.subscribe(this.clickToGenerate.id, "doAction3", "checkIntersection");				

		this.precisionInput = this.createCard({
            name: 'precisionInput',
            behaviorModules: ["Menu"],
            translation: [2.9, 0.4, 2],
			rotation: [0, -Math.PI / 2, 0],
            width: 0.35,
            height: 0.2,
            type: "2d",
            noSave: true,
			color: 0xcccccc,
			fullBright: true,
            depth: 0.01,
            cornerRadius: 0.05,
        });
		this.precisionInput.call("precisionInput$precisionInputActor", "show");
		this.subscribe(this.precisionInput.id, "doAction4", "passData");			
		
        console.log("DrawingCanvasActor.setup");
    }
//end setup()

	passData(data){
		console.log("Data passed: ", data);
	}

	checkIntersection(data) {
		console.log("checkIntersection function triggered");
		if (data.action === "Extrude Polygon") {
			

			let startPoint2 = myAvatar.anArray.length - 2;
			let endPoint2 = myAvatar.anArray.length - 1;
			

		
			const startPoint1X = myAvatar.anArray[0][0];
			const startPoint1Y = myAvatar.anArray[0][1];
			const endPoint1X = myAvatar.anArray[1][0];
			const endPoint1Y = myAvatar.anArray[1][1];
			
			const startPoint2X = myAvatar.anArray[startPoint2][0];
			const startPoint2Y = myAvatar.anArray[startPoint2][1];
			const endPoint2X = myAvatar.anArray[endPoint2][0];
			const endPoint2Y = myAvatar.anArray[endPoint2][1];

			const m1 = (endPoint1Y - startPoint1Y) / (endPoint1X - startPoint1X);
			const c1 = startPoint1Y - m1 * startPoint1X;

			const m2 = (endPoint2Y - startPoint2Y) / (endPoint2X - startPoint2X);
			const c2 = startPoint2Y - m2 * startPoint2X;

			const x = (c2 - c1) / (m1 - m2);
			const y = m1 * x + c1;
			
			
			myAvatar.substituteArray = [];
			myAvatar.substituteArray.push([x, y]);
			
			for (let n = 1; n < myAvatar.anArray.length - 1; n++){
				myAvatar.substituteArray.push([myAvatar.anArray[n][0], myAvatar.anArray[n][1]]);
			}
			
			let limit = 0;
			console.log("myAvatar.substituteArray.length", myAvatar.substituteArray.length);
			if (myAvatar.substituteArray.length === 4){
				let limit = myAvatar.substituteArray.length;
				this.publish("canvasExtrude", "canvasExtrude", limit);
			} else {
				let limit = myAvatar.substituteArray.length;
				this.publish("canvasExtrude", "canvasExtrude", limit);
			}			
			
			
	
		
		}
	}

	
	performAction(data) {
		console.log("data.action registered");
        
        if (data.action === "Extrusion Steps") {
            myAvatar.anotherArrayChoice = 0;
			console.log("myAvatar.anotherArrayChoice in select0");
			console.log(myAvatar.anotherArrayChoice);
            return;
        }
        if (data.action === "Extrusion Depth") {
            myAvatar.anotherArrayChoice = 1;
			console.log("myAvatar.anotherArrayChoice in select0");
			console.log(myAvatar.anotherArrayChoice);
            return;
        }
        if (data.action === "Enable Bevel") {
            myAvatar.anotherArrayChoice = 2;
			console.log("myAvatar.anotherArrayChoice in select0");
			console.log(myAvatar.anotherArrayChoice);
            return;
        }        
		if (data.action === "Bevel Thickness") {
            myAvatar.anotherArrayChoice = 3;
			console.log("myAvatar.anotherArrayChoice in select0");
			console.log(myAvatar.anotherArrayChoice);
            return;
        }       
		if (data.action === "Bevel Size") {
            myAvatar.anotherArrayChoice = 4;
			console.log("myAvatar.anotherArrayChoice in select0");
			console.log(myAvatar.anotherArrayChoice);
            return;
        }        
		if (data.action === "Bevel Offset") {
            myAvatar.anotherArrayChoice = 5;
			console.log("myAvatar.anotherArrayChoice in select0");
			console.log(myAvatar.anotherArrayChoice);
            return;
        }
		if (data.action === "Bevel Segments") {
            myAvatar.anotherArrayChoice = 6;
			console.log("myAvatar.anotherArrayChoice in select0");
			console.log(myAvatar.anotherArrayChoice);
            return;
        }
    }
	
	increaseDecrease(data) {
		console.log("data.action registered 2");
			if (data.action === "Increase") {
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
			console.log("Successfully increased");
			this.publish("myDrawingCanvas", "clear");
			this.publish("myDrawingCanvas", "increaseDecrease", myAvatar.anotherArrayChoice);
            return;
        }
        if (data.action === "Decrease") {
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
			console.log("Successfully decreased");
			this.publish("myDrawingCanvas", "clear");
			if (myAvatar.anotherArrayChoice === 0){
				this.publish("myDrawingCanvas", "increaseDecrease", "NEGATIVEZERO");
			}
			else {
				this.publish("myDrawingCanvas", "increaseDecrease", -Math.abs(myAvatar.anotherArrayChoice));
			}
            return;
        }
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
		
		//make this pawn subscribe to message that initiates extrusion function
		this.subscribe("canvasExtrude", "canvasExtrude", this.canvasExtrude);
		
		//add interaction listener for setting points
		
		this.addEventListener("pointerTap", "setPoint");		

		//define array to store points (vertices)
		let myAvatar = this.getMyAvatar();
		myAvatar.anArray = [];
		
		myAvatar.points = [];

		//hard coded shortcut method of creating a new global array to store variables
		//these are the default values for the extrusionsettings
		//to change the value:
		//Click on text. listen() detects which box was clicked, sends a msg of text with the selected variable name
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
		//this.addEventListener("pointerTap", "setColor");

		//randomize pen colour when initiated (including when canvas is reset)
        this.color = this.randomColor();
        this.nib = 8; //pen nib diameter
        this.addEventListener("pointerDown", "pointerDown");

		let canvas = this.canvas;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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
		
		myAvatar.points.push( new THREE.Vector3( (offsetX * 0.001) - 0.5, 2.97, (offsetY * 0.001) - 0.5 ) );
		
		if (myAvatar.points.length > 1){
			
			const material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
			const geometry = new THREE.BufferGeometry().setFromPoints( myAvatar.points );
			const line = new THREE.Line( geometry, material );
			line.rotation.z = -Math.PI / 2;
			line.rotation.x = Math.PI / 2;
			
			scene.add( line );
		}
		
		console.log("myAvatar.anArray in setPoint(evt): ", myAvatar.anArray);
		
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
	
	
	
    canvasExtrude(limit) {	
		console.log("myAvatar.substituteArray: ", myAvatar.substituteArray);
		// Shape for extrusion
		const shape = new THREE.Shape();

		// Move or set the .currentPoint to moveTo(x, y)
		shape.moveTo(myAvatar.substituteArray[0][0] * 0.001, myAvatar.substituteArray[0][1] * 0.001);
		
		//loop to iterate through array to call shape.lineTo to connect last vertex to current vertex
		for (let n = 1; n < limit; n++) {
			const vertX = myAvatar.substituteArray[n][0] * 0.001;
			const vertY = myAvatar.substituteArray[n][1] * 0.001;
			
			shape.lineTo(vertX, vertY);
		}
		
		shape.lineTo(myAvatar.substituteArray[0][0] * 0.001, myAvatar.substituteArray[0][1] * 0.001);

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
		
		//correct the rotation of the object so that it corresponds to the orientation on the canvas
		newShape.rotation.x = Math.PI;
		newShape.rotation.y = -Math.PI / 2;
		newShape.translateX(1);
		newShape.translateZ(-4);
		
		for(let i = 0; i < myAvatar.points.length; i++){ 
			scene.remove(scene.children[scene.children.length - 1]); 
		}
		
		scene.add(newShape);
		console.log(newShape);
		
		myAvatar.points = [];
		myAvatar.anArray = [];
		
		console.log(myAvatar.anArray);
		//////END	

		console.log(myAvatar.points);
		
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
		shape.add(newShape);
		
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

        console.log("x, y:", x, y);

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


class unemMenuActor {
    show() {
        if (this.menu) {
            this.menu.destroy();
        }

        this.menu = this.createCard({
            name: 'unem menu',
            behaviorModules: ["Menu"],
            parent: this,
            type: "2d",
            noSave: true,
            depth: 0.01,
            cornerRadius: 0.05,
			translation: [0, 0, 0.02]
        });

        this.subscribe(this.menu.id, "itemsUpdated", "itemsUpdated");
        this.updateSelections();

        this.listen("fire", "doAction");
    }

    updateSelections() {
        console.log("action updateSelections");
        let items = [
            {label: "Extrusion Steps"},
            {label: "Extrusion Depth"},
            {label: "Enable Bevel"},
			{label: "Bevel Thickness"},
			{label: "Bevel Size"},
			{label: "Bevel Offset"},
			{label: "Bevel Segments"},
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

class unemMenuActor2 {
    show() {
        if (this.menu) {
            this.menu.destroy();
        }

        this.menu = this.createCard({
            name: 'unem menu 2',
            behaviorModules: ["Menu"],
            parent: this,
            type: "2d",
            noSave: true,
            depth: 0.01,
            cornerRadius: 0.05,
			translation: [0, 0, 0.02]
        });

        this.subscribe(this.menu.id, "itemsUpdated", "itemsUpdated");
        this.updateSelections();

        this.listen("fire", "doAction2");
    }

    updateSelections() {
        console.log("action updateSelections 2");
        let items = [
            {label: "Increase"},
            {label: "Decrease"},
        ];

        this.menu.call("Menu$MenuActor", "setItems", items);
    }

    doAction2(data) {
        this.publish(this.id, "doAction2", data);
    }

    itemsUpdated() {
        this.publish(this.id, "extentChanged", {x: this.menu._cardData.width, y: this.menu._cardData.height});
    }
}

class clickToGenerate {

    show() {
        if (this.menu) {
            this.menu.destroy();
        }

        this.menu = this.createCard({
            name: 'click to generate',
            behaviorModules: ["Menu"],
            parent: this,
            type: "2d",
            noSave: true,
            depth: 0.01,
            cornerRadius: 0.05,
			translation: [0, 0, 0.02]
        });

        this.subscribe(this.menu.id, "itemsUpdated", "itemsUpdated");
        this.updateSelections3();

        this.listen("fire", "doAction3");
    }

    updateSelections3() {
        console.log("action");
        let items = [
            {label: "Extrude Curved Shape"},
            {label: "Extrude Polygon"},
        ];

        this.menu.call("Menu$MenuActor", "setItems", items);
    }

    doAction3(data) {
        this.publish(this.id, "doAction3", data);
    }

    itemsUpdated() {
        this.publish(this.id, "extentChanged", {x: this.menu._cardData.width, y: this.menu._cardData.height});
    }
}

class smallDisplayPawn {
    setup() {
        this.initialDisplay();
		this.subscribe("myDrawingCanvas", "clear", this.clear);
		this.subscribe("myDrawingCanvas", "increaseDecrease", this.displayElement);
        //this.publish(this.id, "electionStatusRequested");
		
		let myAvatar = this.getMyAvatar();
		myAvatar.displayItemsArray = [];		
		myAvatar.displayItemsArray.push(3);//varSteps
		myAvatar.displayItemsArray.push(1);//varDepth
		myAvatar.displayItemsArray.push("X");//varBevelEnabled
		myAvatar.displayItemsArray.push(0);//varBevelThickness
		myAvatar.displayItemsArray.push(0);//varBevelSize
		myAvatar.displayItemsArray.push(0);//varBevelOffset
		myAvatar.displayItemsArray.push(0);//varBevelSegments		
		
    }

    initialDisplay() {
		
		//This sets the initial display
        let color = "#FFFFFF";
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "right";
        ctx.fillStyle = color;
        ctx.font = "100px Arial";
		 		
		
		//Sets the default display
		ctx.fillText(3, 240, 130);
		ctx.fillText(1, 240, 285);		
		ctx.fillText("X", 240, 440);
		ctx.fillText(0, 240, 595);		
		ctx.fillText(0, 240, 750);
		ctx.fillText(0, 240, 905);
		ctx.fillText(0, 240, 1060);
		
		this.texture.needsUpdate = true;
        this.publish(this.id, "setColor", color);
		//This sets the initial display
    }
	
    displayElement(arrayElement) {
		
		//This sets the initial display
        let color = "#FFFFFF";
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "right";
        ctx.fillStyle = color;
        ctx.font = "100px Arial";	
		
		for (let i = 0; i < myAvatar.displayItemsArray.length; i++) {
			//Incrementing display number each time the increase/decrease button is pressed
			//Note: "NEGATIVEZERO" is a special code for checking if the input is -0
			
			//If arrayElement is a positive integer or 0, and not 2, then increment
			if (arrayElement === i && arrayElement != 2 && arrayElement != "NEGATIVEZERO") {
				
				myAvatar.displayItemsArray[i]++;
			
			//If arrayElement is a negative integer (except -0, which is equal to 0 in JS), and not 2, then decrement			
			} else if (arrayElement === -Math.abs(i) && arrayElement != -2) {
				
				myAvatar.displayItemsArray[i]--;
				
			} else if (arrayElement === "NEGATIVEZERO"){
				myAvatar.displayItemsArray[0]--;
				//set arrayElement to "DISCARD" so that it no longer fulfills the `if` condition in subsequent iterations of the `for` loop
				arrayElement = "DISCARD";
			}
			
			//Special checking for bevel true/false condition
			//Flips the T/F statement regardless of whether the increase or decrease button was pressed
			console.log("arrayElement: ", arrayElement);
			if (Math.abs(arrayElement) === 2 && myAvatar.displayItemsArray[2] === "X"){
				myAvatar.displayItemsArray[2] = "✓";
			} else if (Math.abs(arrayElement) === 2 && myAvatar.displayItemsArray[2] === "✓"){
				myAvatar.displayItemsArray[2] = "X";
			}			
		  
			ctx.fillText(myAvatar.displayItemsArray[i], 240, 130 + i * 155);
			this.texture.needsUpdate = true;
			this.publish(this.id, "setColor", color);
		}
    }	

    clear() {
		console.log("Clear method triggered");	
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.texture.needsUpdate = true;
		
		return;
    }

    teardown() {
       
    }
}

class precisionInputActor {
	setup(){
		this.subscribe(this.id, "text", this.handleText);

	}
    show() {
        if (this.menu1) {
            this.menu1.destroy();
        }

        this.menu1 = this.createCard({
            name: 'click to submit',
            behaviorModules: ["Menu"],
            parent: this,
            type: "2d",
            noSave: true,
            depth: 0.01,
            cornerRadius: 0.05,
			translation: [0, 0, 0.02]
        });

        this.subscribe(this.menu1.id, "itemsUpdated", "itemsUpdated");
        this.updateSelections4();

        this.listen("fire", "doAction4");
    }

    updateSelections4() {
        console.log("action updateSelections4");
        let items = [
            {label: "Submit"}
        ];

        this.menu1.call("Menu$MenuActor", "setItems", items);
    }

    doAction4() {
		const plainText = this.value;
		console.log("this.value is: ", plainText);
		console.log("this.content is: ", this.content);
	}
	
	handleText(){
		console.log("handleText Triggered");
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
            name: "unemMenu",
            actorBehaviors: [unemMenuActor]
        },
		{
            name: "unemMenu2",
            actorBehaviors: [unemMenuActor2]
        },		
		{
            name: "clickToGenerate",
            actorBehaviors: [clickToGenerate]
        },
		{
            name: "smallDisplay",
            pawnBehaviors: [smallDisplayPawn]
        },
		{
            name: "precisionInput",
			actorBehaviors: [precisionInputActor]
            
        }
    ]
};

/* globals Microverse */