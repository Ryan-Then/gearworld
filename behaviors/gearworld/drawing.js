class DrawingCanvasActor {
    setup() {
		const drawingCanvas = new DrawingCanvasActor();
		drawingCanvas.name = "myDrawingCanvas";		
		
		this.addEventListener("pointerDown", "pointerDown");
		this.addEventListener("pointerEnter", "hilite");
		this.addEventListener("pointerLeave", "unhilite");
		
        this.subscribe(this.sessionId, "view-exit", "viewExit");
        this.listen("startLine", "startLine");
        this.listen("addLine", "addLine");
		
		this.subscribe("canvasExtrude", "canvasExtrude", this.canvasExtrude);
		
		this.subscribe("calculateData", "calculateData", this.calculateData);
		
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
            height: 0.25,
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
		
		//creates sphere
		
        console.log("DrawingCanvasActor.setup");
    }
//end setup()

    setColor() { // Changes colour to green when button is pressed
		console.log("setColor() triggered");
    }

    hilite() {
        this.entered = true;
        this.setColor();
    }

    unhilite() {
        this.entered = false;
        this.setColor();
    }

    pointerDown(evt) {
		console.log("in actor evt", evt);
		
		let vec3 = new Microverse.THREE.Vector3(...evt.xyz);
		
        let geometry = new Microverse.THREE.SphereGeometry(0.015, 16, 16);
        let material = new Microverse.THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        let vertexMarker = new Microverse.THREE.Mesh(geometry, material);
		vertexMarker.position.x = vec3.x;
		vertexMarker.position.y = vec3.y;
		vertexMarker.position.z = vec3.z;

		scene.add(vertexMarker);
		this.setColor();		
        
    }

	checkIntersection(data) {
		console.log("checkIntersection function triggered");
		if (data.action === "Extrude Polygon") {
			

			let startPoint2 = myAvatar.vertexPoints.length - 2;
			let endPoint2 = myAvatar.vertexPoints.length - 1;
			

		
			const startPoint1X = myAvatar.vertexPoints[0][0];
			const startPoint1Y = myAvatar.vertexPoints[0][1];
			const endPoint1X = myAvatar.vertexPoints[1][0];
			const endPoint1Y = myAvatar.vertexPoints[1][1];
			
			const startPoint2X = myAvatar.vertexPoints[startPoint2][0];
			const startPoint2Y = myAvatar.vertexPoints[startPoint2][1];
			const endPoint2X = myAvatar.vertexPoints[endPoint2][0];
			const endPoint2Y = myAvatar.vertexPoints[endPoint2][1];

			const m1 = (endPoint1Y - startPoint1Y) / (endPoint1X - startPoint1X);
			const c1 = startPoint1Y - m1 * startPoint1X;

			const m2 = (endPoint2Y - startPoint2Y) / (endPoint2X - startPoint2X);
			const c2 = startPoint2Y - m2 * startPoint2X;

			const x = (c2 - c1) / (m1 - m2);
			const y = m1 * x + c1;
			
			
			myAvatar.substituteArray = [];
			myAvatar.substituteArray.push([x, y]);
			
			for (let n = 1; n < myAvatar.vertexPoints.length - 1; n++){
				myAvatar.substituteArray.push([myAvatar.vertexPoints[n][0], myAvatar.vertexPoints[n][1]]);
			}
			
			//CHECK THIS AGAIN (TEMP)
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
	
    canvasExtrude(limit) {	
		console.log("canvasExtrude fired");
		
		let varSteps = myAvatar.extrusionParameters[0];
		let varDepth = myAvatar.extrusionParameters[1];
		
		var varBevelEnabled;
		if (myAvatar.extrusionParameters[2]){ //check if false
			console.log(myAvatar.extrusionParameters[2]);
			let varBevelEnabled = 1;
		}
		
		let varBevelThickness = myAvatar.extrusionParameters[3];
		let varBevelSize = myAvatar.extrusionParameters[4];
		let varBevelOffset = myAvatar.extrusionParameters[5];
		let varBevelSegments = myAvatar.extrusionParameters[6];
		
		let extrudeSettings = {
			steps: varSteps, //3
			depth: varDepth, //1
			bevelEnabled: varBevelEnabled, //false
			bevelThickness: varBevelThickness,//0
			bevelSize: varBevelSize,//0
			bevelOffset: varBevelOffset,//0
			bevelSegments: varBevelSegments//0
		};
		
		for(let i = 0; i < myAvatar.vector3Points.length * 2; i++){ 
			scene.remove(scene.children[scene.children.length - 1]); 
		}
		
		let dataArray1 = [... myAvatar.substituteArray];
		let dataArray2 = Object.assign({}, extrudeSettings);
		
		console.log("1 publishing to cardCreator");
		
		this.createCard({
			name:"userShape",
			type: "object",
			translation: [2.5, 1, -2.5],
			layers: ["pointer"],
			scale: [1, 1, 1],
			dataPackage1: dataArray1,
			dataPackage2: dataArray2,		
			behaviorModules: ["CardCreator"],
		});
		
		console.log("2 card created");
		
		myAvatar.vector3Points = [];
		myAvatar.vertexPoints = [];		
	}
		/*

		//perform extrusion using extrudeSettings
		const geometry1 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		const material1 = new THREE.MeshStandardMaterial( {color: 0xcccccc, metalness: 0.8} );
		const newShape = new THREE.Mesh( geometry1, material1 );
		
		//correct the rotation of the object so that it corresponds to the orientation on the canvas
		newShape.rotation.x = Math.PI;
		newShape.rotation.y = -Math.PI / 2;
		newShape.translateX(1);
		newShape.translateZ(-4);
		

		
		this.shape.add(newShape);
		console.log("with this.shape.add()", shape);
		
		//scene.add(newShape);
		//console.log("with scene.add", newShape);
		
		
		myAvatar.vector3Points = [];
		myAvatar.vertexPoints = [];
		//////END	 */
	
    		

	calculateData(){
		let polyVertices = myAvatar.vertexPoints.length - 1;

		const numPoints = myAvatar.vertexPoints.length;
		let polyArea = 0;

		for (let i = 0; i < numPoints; i++) {
			const [x1, y1] = myAvatar.vertexPoints[i];
			const [x2, y2] = myAvatar.vertexPoints[(i + 1) % numPoints];

			polyArea += (x1 * y2 - x2 * y1);
		}

		polyArea = Math.abs(polyArea) / 2;

		let polyVolume = polyArea * myAvatar.extrusionParameters[1] * 1000;

		
		console.log("myAvatar.density 1", myAvatar.density);
		
		let polyMass = polyVolume * myAvatar.density / 1000;	
		
		console.log("myAvatar.density 2", myAvatar.density);
		console.log("polyMass", polyMass);
		
	
		let data = [polyVertices, polyArea, polyVolume, polyMass]
		
		console.log("data", data);
		
		this.publish("polyData", "polyData", data);
	}
	
	performAction(data) {
		console.log("data.action registered");
        
        if (data.action === "Extrusion Steps") {
            myAvatar.extrusionParametersChoice = 0;
			console.log("myAvatar.extrusionParametersChoice in select0");
			console.log(myAvatar.extrusionParametersChoice);
            return;
        }
        if (data.action === "Extrusion Depth") {
            myAvatar.extrusionParametersChoice = 1;
			console.log("myAvatar.extrusionParametersChoice in select0");
			console.log(myAvatar.extrusionParametersChoice);
            return;
        }
        if (data.action === "Enable Bevel") {
            myAvatar.extrusionParametersChoice = 2;
			console.log("myAvatar.extrusionParametersChoice in select0");
			console.log(myAvatar.extrusionParametersChoice);
            return;
        }        
		if (data.action === "Bevel Thickness") {
            myAvatar.extrusionParametersChoice = 3;
			console.log("myAvatar.extrusionParametersChoice in select0");
			console.log(myAvatar.extrusionParametersChoice);
            return;
        }       
		if (data.action === "Bevel Size") {
            myAvatar.extrusionParametersChoice = 4;
			console.log("myAvatar.extrusionParametersChoice in select0");
			console.log(myAvatar.extrusionParametersChoice);
            return;
        }        
		if (data.action === "Bevel Offset") {
            myAvatar.extrusionParametersChoice = 5;
			console.log("myAvatar.extrusionParametersChoice in select0");
			console.log(myAvatar.extrusionParametersChoice);
            return;
        }
		if (data.action === "Bevel Segments") {
            myAvatar.extrusionParametersChoice = 6;
			console.log("myAvatar.extrusionParametersChoice in select0");
			console.log(myAvatar.extrusionParametersChoice);
            return;
        }
    }
	
	increaseDecrease(data) {
		console.log("data.action registered 2");
			if (data.action === "Increase") {
			let anotherArrayElement = myAvatar.extrusionParameters[myAvatar.extrusionParametersChoice];
			
			let trueOrFalse = Number.isInteger(anotherArrayElement);
			console.log(trueOrFalse);
			if (!trueOrFalse){
			if (anotherArrayElement == false){
				myAvatar.extrusionParameters[myAvatar.extrusionParametersChoice] = !anotherArrayElement;
			} 
			if (anotherArrayElement == true){
				myAvatar.extrusionParameters[myAvatar.extrusionParametersChoice] = !anotherArrayElement;
			}
			} else {
			anotherArrayElement++;
			myAvatar.extrusionParameters[myAvatar.extrusionParametersChoice] = anotherArrayElement;
			}
			console.log(anotherArrayElement);
			console.log("Successfully increased");
			this.publish("myDrawingCanvas", "clear");
			this.publish("myDrawingCanvas", "increaseDecrease", myAvatar.extrusionParametersChoice);
            return;
        }
        if (data.action === "Decrease") {
			let anotherArrayElement = myAvatar.extrusionParameters[myAvatar.extrusionParametersChoice];
			
			let trueOrFalse = Number.isInteger(anotherArrayElement);
			console.log(trueOrFalse);
			if (!trueOrFalse){
			if (anotherArrayElement == false){
				myAvatar.extrusionParameters[myAvatar.extrusionParametersChoice] = !anotherArrayElement;
			} 
			if (anotherArrayElement == true){
				myAvatar.extrusionParameters[myAvatar.extrusionParametersChoice] = !anotherArrayElement;
			}
			} else {
			anotherArrayElement--;
			myAvatar.extrusionParameters[myAvatar.extrusionParametersChoice] = anotherArrayElement;
			}
			console.log(anotherArrayElement);
			console.log("Successfully decreased");
			this.publish("myDrawingCanvas", "clear");
			if (myAvatar.extrusionParametersChoice === 0){
				this.publish("myDrawingCanvas", "increaseDecrease", "NEGATIVEZERO");
			}
			else {
				this.publish("myDrawingCanvas", "increaseDecrease", -Math.abs(myAvatar.extrusionParametersChoice));
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
		//this.subscribe("canvasExtrude", "canvasExtrude", this.canvasExtrude);
		
		this.subscribe("precisionInput", "precisionInputX", this.setPointPreciseX);
		this.subscribe("precisionInput", "precisionInputY", this.setPointPreciseY);
		this.subscribe("precisionInput", "precisionInputSubmit", this.setPointPrecise);
		
		this.subscribe("assignMass", "assignMass", this.assignMass);
		
		//add interaction listener for setting points
		
		this.addEventListener("pointerTap", "setPoint");		

		//define storage of arrays locally in avatar, and define arrays
		//hard coded shortcut method of creating a new global array to store variables
		let myAvatar = this.getMyAvatar();
		
		myAvatar.density = 0;
		
		//define array to store vertices on the canvas, then used to generate the 3D object
		//this array is a nested array. The points are defined as "x" and "y" floats, stored in a small array, stored in vertexPoints 
		myAvatar.vertexPoints = [];
		
		//define array to store ThreeJS Vector3 points, used to draw lines on canvas
		myAvatar.vector3Points = [];
		
		//array to store X and Y coordinates for drawing by using precise text input
		myAvatar.storeArrayX = [];
		myAvatar.storeArrayY = [];

		//array to store extrusion parameter settings
		myAvatar.extrusionParameters = [];
		
		//these are the default values for the extrusion settings, mapped to each extrusion parameter
		myAvatar.extrusionParameters.push(3);//varSteps
		myAvatar.extrusionParameters.push(1);//varDepth
		myAvatar.extrusionParameters.push(false);//varBevelEnabled
		myAvatar.extrusionParameters.push(0);//varBevelThickness
		myAvatar.extrusionParameters.push(0);//varBevelSize
		myAvatar.extrusionParameters.push(0);//varBevelOffset
		myAvatar.extrusionParameters.push(0);//varBevelSegments				

		//randomize pen colour when initiated (including when canvas is reset)
        this.color = this.randomColor();
        this.nib = 8; //pen nib diameter
        this.addEventListener("pointerDown", "pointerDown");

		this.drawCanvas();

        this.drawAll();
        console.log("DrawingCanvasPawn.setup");
    }
	
    resize(width, height) {
        console.log(width, height);
    }
	
	assignMass(density){
		myAvatar.density = density;
		console.log("myAvatar.density", myAvatar.density);
	}
	
	drawCanvas(){
		let canvas = this.canvas;
        let ctx = canvas.getContext('2d');
        //ctx.fillStyle = "white";
	
		const numSquares = 20;
		const squareSize = canvas.width / numSquares;
		const borderWidth = 1;

		// Loop through each square and draw the borders
		for (let row = 0; row < numSquares; row++) {
		  for (let col = 0; col < numSquares; col++) {
			const x = col * squareSize;
			const y = row * squareSize;

			// Draw the white tile
			ctx.fillStyle = 'white';
			ctx.fillRect(x, y, squareSize, squareSize);

			// Draw the black borders
			ctx.fillStyle = 'black';
			ctx.fillRect(x, y, squareSize, borderWidth); // Top border
			ctx.fillRect(x, y, borderWidth, squareSize); // Left border
			ctx.fillRect(x + squareSize - borderWidth, y, borderWidth, squareSize); // Right border
			ctx.fillRect(x, y + squareSize - borderWidth, squareSize, borderWidth); // Bottom border
		  }
		}		
		
	}
	
	
	//WORKING
	setPoint(evt){	
		//system to log x and y position on canvas based on pointerTap coordinate in 3D space in the world
		evt = this.cookEvent(evt);
		
		//define offsetx/y as being x/y coordinate of mouse at the moment the pointerTap event was logged
        let offsetX = evt.x;
        let offsetY = evt.y;
		myAvatar.vertexPoints.push([offsetX, offsetY]);
		
		//-0.5 is needed for proper alignment. Same is used in cookEvent(evt)
		myAvatar.vector3Points.push( new THREE.Vector3( (offsetX * 0.001) - 0.5, 2.974, (offsetY * 0.001) - 0.5 ) );
		
		if (myAvatar.vector3Points.length > 1){
			
			const material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
			const geometry = new THREE.BufferGeometry().setFromPoints( myAvatar.vector3Points );
			const line = new THREE.Line( geometry, material );
			line.rotation.z = -Math.PI / 2;
			line.rotation.x = Math.PI / 2;
			
			scene.add( line );
		}
		
		return;
	}

	setPointPreciseX(data){	
		myAvatar.storeArrayX.push(data);
	}		
	
	setPointPreciseY(data){	
		myAvatar.storeArrayY.push(data);
	}	
	
	setPointPrecise(){	
	
		let offsetX = myAvatar.storeArrayX[myAvatar.storeArrayX.length - 1];
		let offsetY = myAvatar.storeArrayY[myAvatar.storeArrayY.length - 1];
		myAvatar.vertexPoints.push([offsetX, offsetY]);
		
		myAvatar.vector3Points.push( new THREE.Vector3( (offsetX * 0.001) - 0.5, 2.97, (offsetY * 0.001) - 0.5 ) );
		
		if (myAvatar.vector3Points.length > 1){
			
			const material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
			const geometry = new THREE.BufferGeometry().setFromPoints( myAvatar.vector3Points );
			const line = new THREE.Line( geometry, material );
			line.rotation.z = -Math.PI / 2;
			line.rotation.x = Math.PI / 2;
			
			scene.add( line );
		}
		
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
	

    clear1() {	
/* 		//clear1 is the button on the LEFT. It generates CURVED shapes
		console.log("this is clear1");
		//////START
		const shape = new THREE.Shape();
		
		//Move or set the .currentPoint to moveTo(x, y)
		shape.moveTo( 0, 0 );
		
		//loop to iterate through array to call shape.lineTo for each element in the array

		let n = 2; 

		while (n < myAvatar.vertexPoints.length) { //n is for array
				let vert1X = myAvatar.vertexPoints[n-2][0] * 0.001; //variable assignment and downscaling vertex number, to reduce size of object when extruded
				let vert1Y = myAvatar.vertexPoints[n-2][1] * 0.001;

				let vert2X = myAvatar.vertexPoints[n-1][0] * 0.001; //variable assignment and downscaling vertex number, to reduce size of object when extruded
				let vert2Y = myAvatar.vertexPoints[n-1][1] * 0.001;	

				let vertX = myAvatar.vertexPoints[n][0] * 0.001; //variable assignment and downscaling vertex number, to reduce size of object when extruded
				let vertY = myAvatar.vertexPoints[n][1] * 0.001;			
			
			shape.bezierCurveTo( vert1X, vert1Y, vert2X, vert2Y, vertX, vertY );
			n++;
			n++;
			n++;
		}
		let varSteps = myAvatar.extrusionParameters[0];
		let varDepth = myAvatar.extrusionParameters[1];
		
		var varBevelEnabled;
		if (myAvatar.extrusionParameters[2]){ //check if false
			console.log(myAvatar.extrusionParameters[2]);
			let varBevelEnabled = 1;
		}
		
		let varBevelThickness = myAvatar.extrusionParameters[3];
		let varBevelSize = myAvatar.extrusionParameters[4];
		let varBevelOffset = myAvatar.extrusionParameters[5];
		let varBevelSegments = myAvatar.extrusionParameters[6];
		
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
		
		
		myAvatar.vertexPoints = [];
		console.log(myAvatar.vertexPoints);
		//////END			
		
        console.log("CLEAR1");
        let canvas = this.canvas;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.texture.needsUpdate = true; */
    }
	

    drawAll() {
        let global = this.actor._cardData.globalDrawing;
        if (!global) {return;}
		//this line calls the clear() method
        //this.clear();
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
		//This code creates a new instance of Microverse.THREE.Vector3 using the values from evt.xyz
		//then it clones the matrixWorld property of this.renderObject and then inverts the cloned matrix. 
        if (!evt.xyz) {return;}

        let vec = new Microverse.THREE.Vector3(...evt.xyz);
		
		//The resulting inverted matrix is stored in the inv variable.
        let inv = this.renderObject.matrixWorld.clone().invert();
		
		//It applies the inverted matrix (inv) to the vec vector using the applyMatrix4 method, resulting in a new transformed vector vec2.
		//applying the inverse matrix brings it into the local coordinate system of the object
        let vec2 = vec.applyMatrix4(inv);
		
		//It calculates the x and y coordinates for the texture mapping based on the transformed vector vec2
        let x = (vec2.x + 0.5) * this.actor._cardData.textureWidth;
        let y = (-vec2.y + 0.5) * this.actor._cardData.textureHeight;

        console.log("x, y:", x, y);

        return {x, y};
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
		console.log(myAvatar.vertexPoints);
		
		console.log("this is anotherArray");	
		console.log(myAvatar.extrusionParameters);		
		
		console.log("this is anotherArrayChoice before select0");	
		console.log(myAvatar.extrusionParametersChoice);
		
        this.publish(this._cardData.publishTo, this._cardData.publishMsg)
        //console.log("doit");
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
		this.publish("calculateData", "calculateData");
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
}

class polyDataDisplayPawn{
	setup(){
		this.subscribe("polyData", "polyData", this.displayData);
		//Sets the labels
        let color = "#FFFFFF";
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "left";
        ctx.fillStyle = color;
        ctx.font = "100px Arial";		

		ctx.fillText("Vertices: ", 40, 140);
		ctx.fillText("Area: ", 40, 320);		
		ctx.fillText("Volume: ", 40, 500);	
		ctx.fillText("Mass: ", 40, 680);
		
		this.texture.needsUpdate = true;
        this.publish(this.id, "setColor", color);	
	}

	displayData(data){
        let color = "#FFFFFF";
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "left";
        ctx.fillStyle = color;
        ctx.font = "100px Arial";	

		let polyArea = data[1].toFixed(2);
		let polyVolume = data[2].toFixed(2);
		let polyMass = data[3].toFixed(2);
	
		let msgVertices = String(data[0]);
		let msgArea = String(polyArea);
		let msgVolume = String(polyVolume);
	
		//Sets the data to the right of the labels
		ctx.fillText(msgVertices, 540, 140);
		ctx.fillText(msgArea + " mm²", 540, 320);		
		ctx.fillText(msgVolume + " mm³", 540, 500);
		ctx.fillText(polyMass + " g", 540, 680);
		
		
		this.texture.needsUpdate = true;
        this.publish(this.id, "setColor", color);		
	}	
	
}
	
	

class precisionInputActor {
	setup(){
		//event "changed" comes from TextFieldActor in text card. It is not published in this behaviour file 
		this.subscribe(this.id, "changed", this.init);
	}
	
	init() {
		//handles value from each text box separately, publishes to separate methods which store the value in separate arrays
		//hack method that uses myAvatar
		console.log("triggered init()");
		
		let	x = 0;
		let y = 0;
		
		if (this.name === "coordinate text bar") {
			
		  // work on data from upper text field (x-coordinate)
		  let x = this.value;
		  this.publish("precisionInput", "precisionInputX", x);
		  
		} else if (this.name === "coordinate text bar 2") {
			
		  // work on data from upper text field (y-coordinate)
		  let y = this.value;
		  this.publish("precisionInput", "precisionInputY", y);
		  
		} else if (this.name === "density text bar") {
			
		  let density = this.value;
		  console.log("density in init()", density);
		  this.publish("assignMass", "assignMass", density);
		  
		} 
		
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

        //this.subscribe(this.menu1.id, "itemsUpdated", "itemsUpdated");
        this.updateSelections4();

        this.listen("fire", "doAction4");
    }

    updateSelections4() {
        let items = [
            {label: "Submit"}
        ];

        this.menu1.call("Menu$MenuActor", "setItems", items);
    }
	
	
	//action method
    doAction4() { //handles y-coordinate
		this.publish("precisionInput", "precisionInputSubmit");
		
	}

	
    /* itemsUpdated() {
        this.publish(this.id, "extentChanged", {x: this.menu._cardData.width, y: this.menu._cardData.height});
    }	 */

}

/* class CardCreatorActor {
    setup() {

    }
} */

class CardCreatorPawn {
	setup(){	
		console.log("cardCreate has fired");
		console.log("this.id", this.id);
		console.log("this.actor.id", this.actor.id);
		
		console.log("this.service PawnManager", this.service("PawnManager"));
		console.log("this.service ThreeRenderManager", this.service("ThreeRenderManager"));
	
		let pointsArray = this.actor._cardData.dataPackage1; 
		let extrudeSettings = this.actor._cardData.dataPackage2;
		
		// Shape for extrusion
		const shape = new THREE.Shape();

		// Move or set the .currentPoint to moveTo(x, y)
		shape.moveTo(pointsArray[0][0] * 0.001, pointsArray[0][1] * 0.001);
		
		//loop to iterate through array to call shape.lineTo to connect last vertex to current vertex
		for (let n = 1; n < pointsArray.length; n++) {
			const vertX = pointsArray[n][0] * 0.001;
			const vertY = pointsArray[n][1] * 0.001;
			
			shape.lineTo(vertX, vertY);
		}
		
		shape.lineTo(pointsArray[0][0] * 0.001, pointsArray[0][1] * 0.001);	
	
		const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		const material = new THREE.MeshStandardMaterial( {color: 0xcccccc, metalness: 0.8} );
		const newShape = new THREE.Mesh( geometry, material );
		
		newShape.rotation.x = Math.PI;
		newShape.rotation.y = -Math.PI / 2;

		this.shape.add(newShape);
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
            name: "polyDataDisplay",
            pawnBehaviors: [polyDataDisplayPawn]
        },
		{
            name: "precisionInput",
			actorBehaviors: [precisionInputActor]
        },	
		{
            name: "CardCreator",
			pawnBehaviors: [CardCreatorPawn]
        }	
    ]
};

/* globals Microverse */