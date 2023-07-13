class DrawingCanvasActor {
    setup() {
		const drawingCanvas = new DrawingCanvasActor();
		drawingCanvas.name = "myDrawingCanvas";		
		
		this.userShapes = [];
		this.vertexList = [];
		this.lineList = [];
		
		//vertexList and lineList are responsible for storing the vertex and line data used to form the shape of the user-made card
		
		this.materialsArray = {
			"Aluminium": [2710, 0.1], 
			"Steel": [7850, 0.6], 
			"Gray Iron": [7150, 0.9]
			};			
			
		this.userMaterial;
		this.userDensity;
		this.userMetalnessValue;	
		
		//this is responsible for adding vertices on the canvas
		this.addEventListener("pointerTap", "pointerTap");
		
		this.subscribe("drawNewLine", "drawNewLine", this.drawNewLine);
		
		this.subscribe("newLine", "newLine", this.vertexLine);
		
        this.subscribe(this.sessionId, "view-exit", "viewExit");
        this.listen("startLine", "startLine");
        this.listen("addLine", "addLine");
		
		this.subscribe("canvasExtrude", "canvasExtrude", this.canvasExtrude);
		
		this.subscribe("calculateData", "calculateData", this.calculateData);
		
		this.subscribe("assignMaterial", "assignMaterial", this.assignMaterial);
		this.subscribe("assignDensity", "assignDensity", this.assignDensity);
		this.subscribe("assignMetalness", "assignMetalness", this.assignMetalness);	

		this.density = 0;
		
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

		
		this.SelectExtrusionParameter = this.createCard({
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
		this.SelectExtrusionParameter.call("SelectExtrusionParameter$SelectExtrusionParameterActor", "show");
		this.subscribe(this.SelectExtrusionParameter.id, "doAction", "selectParameter");
		
		this.ExtrusionParametersControl = this.createCard({
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
		this.ExtrusionParametersControl.call("ExtrusionParametersControl$ExtrusionParametersControlActor", "show");
		this.subscribe(this.ExtrusionParametersControl.id, "doAction2", "increaseDecrease");		
		
		this.createMaterialPresetsMenu();
		
		this.NewMaterialsMenu = this.createCard({
            name: 'label action menu 4',
            behaviorModules: ["Menu"],
            translation: [2.9, 0.5, -1.41],
			rotation: [0, -Math.PI / 2, 0],
            width: 0.3,
            height: 0.48,
            type: "2d",
            noSave: true,
			color: 0xcccccc,
			fullBright: true,
            depth: 0.01,
            cornerRadius: 0.05,
        });
		this.NewMaterialsMenu.call("NewMaterialsMenu$NewMaterialsActor", "show");
		this.subscribe(this.NewMaterialsMenu.id, "doAction", "setNewMaterial");			
		
		this.ShapePresetsMenu = this.createCard({
            name: 'label action menu 5',
            behaviorModules: ["Menu"],
            translation: [2.9, -0.05, -2.5],
			rotation: [0, -Math.PI / 2, 0],
            width: 0.5,
            height: 0.6,
            type: "2d",
            noSave: true,
			color: 0xcccccc,
			fullBright: true,
            depth: 0.01,
            cornerRadius: 0.05,
        });
		this.ShapePresetsMenu.call("ShapePresetsMenu$shapePresetsMenuActor", "show");
		//this.subscribe(this.ShapePresetsMenu.id, "doAction", "generateShapePreset");	
		this.subscribe("generateShapePreset", "generateShapePreset", "generateShapePreset")		
		
		this.clickToGenerate = this.createCard({
            name: 'label action menu 4',
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
		this.clickToGenerate.call("clickToGenerate$clickToGenerateActor", "show");
		this.subscribe(this.clickToGenerate.id, "doAction", "checkIntersection");				

		this.precisionInput = this.createCard({
            name: 'precisionInput',
            behaviorModules: ["Menu"],
            translation: [2.9, 0.4, 2.1],
			rotation: [0, -Math.PI / 2, 0],
            width: 0.3,
            height: 0.15,
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

	assignRadius(data){
		this.radius = data.action;
	}	
	
	assignDepth(data){
		this.depth = data.action;
	}

	generateShapePreset(data){
		if (data.action === "Sphere") {
			this.createCard({
				name:"base",
				type: "object",
				layers: ["pointer", "walk"],
				rotation: [-Math.PI / 2, 0, 0],
				translation: [2.975, 0, -1.5],
				behaviorModules: ["Earth", "SingleUser"],
				scale: [0.1, 0.1, 0.1],
				color: 0x997777,
				physicsShape: "ball",
				physicsType: "positionBased",
            });		
		}		
		if (data.action === "Cylinder") {
			this.createCard({
				name:"base",
				type: "object",
				layers: ["pointer", "walk"],
				rotation: [-Math.PI / 2, 0, 0],
				translation: [2.975, 0, -1.5],
				behaviorModules: ["Physics", "Cascade"],
				scale: [0.1, 0.1, 0.1],
				color: 0x997777,
				physicsShape: "cylinder",
                physicsType: "positionBased"
            });		
		}			
			
		if (data.action === "Cylindrical Pipe") {
			this.createCard({
				name:"base",
				type: "object",
				layers: ["pointer", "walk"],
				rotation: [-Math.PI / 2, 0, 0],
				translation: [2.975, 0, -1.5],
				behaviorModules: ["Physics", "CylinderCreator"],
				scale: [0.1, 0.1, 0.1],
				color: 0x997777,
				depth: this.depth,
            });		
		}			
			
		if (data.action === "Cuboid") {
			this.createCard({
				name:"base",
				type: "object",
				layers: ["pointer", "walk"],
				rotation: [-Math.PI / 2, 0, 0],
				translation: [2.975, 0, -1.5],
				behaviorModules: ["Physics", "Cascade"],
				scale: [0.9, 0.2, 0.2],
				color: 0x997777,
				physicsShape: "cuboid",
				physicsType: "positionBased",
            });		
		}
		
	}

	createMaterialPresetsMenu(){
		this.MaterialPresetsMenu = this.createCard({
            name: 'label action menu 3',
            behaviorModules: ["Menu"],
            translation: [2.9, 0.5, -2.54],
			rotation: [0, -Math.PI / 2, 0],
            width: 0.4,
            height: 0.48,
            type: "2d",
            noSave: true,
			color: 0xcccccc,
			fullBright: true,
            depth: 0.01,
            cornerRadius: 0.05,
			materialsList: this.materialsArray,
        });
		this.MaterialPresetsMenu.call("MaterialPresetsMenu$MaterialPresetsActor", "show");
		this.subscribe(this.MaterialPresetsMenu.id, "doAction3", "setMaterial");			
		
		
	}

    pointerTap(evt) {
		console.log("in actor evt", evt);
		
		//assign card with its own vertexList index number
		let index =  this.vertexList.length;
		console.log("vertex index", index);
		
		let vertex = this.createCard({
			name:"vertex marker",
			type: "object",
			layers: ["pointer"],
			cardHilite: 0xffffff,
            behaviorModules: ["Vertex Marker", "URLLink"],
			vec3Position: evt,
			vertexIndex: index,
		});		
		
		//create visual vertex marker, not the vertex used to form the shape of the user card
		this.vertexList.push(vertex);
		
		//triggers the vertexLine method
		this.publish("newLine", "newLine");
		this.publish("vertexLocation", "vertexLocation", evt);
		
		console.log("published newLine in pointerdown");
    }
	
	vertexLine(){
		//if there is more than one vertex, a line will be drawn between the previous and latest vertex
		if (this.vertexList.length > 0) {
			
			let line = this.createCard({
				name:"vertex line",
				type: "object",
				layers: ["pointer"],
				behaviorModules: ["Draw Line"],
			});			
			
			this.lineList.push( line );
		}
	}

	drawNewLine(){
		console.log("lines", this.lineList);
		
		this.lineList.forEach((c) => c.destroy());
		
		console.log("lines after destruction", this.lineList);
		
		console.log("myAvatar.vector3Points in drawnewline", myAvatar.vector3Points);
		
		//triggers the vertexLine(evt) method
		this.publish("newLine", "newLine");
		
		//triggers DrawLinePawn to generate view of line in the world space 
		this.publish("newLine", "newLine");	
	}

	checkIntersection(data) {
		console.log("checkIntersection function triggered");
		if (data.action === "Extrude Polygon") {
			console.log("in checkIntersection, myAvatar.vertexPoints", myAvatar.vertexPoints);

			let startPoint2 = myAvatar.vertexPoints.length - 2;
			let endPoint2 = myAvatar.vertexPoints.length - 1;
			
			//this calculates the intersection based on the start and end points of the first and last lines
			
			//this are the hardcoded start and end points of the first line
			const startPoint1X = myAvatar.vertexPoints[0][0];
			const startPoint1Y = myAvatar.vertexPoints[0][1];
			const endPoint1X = myAvatar.vertexPoints[1][0];
			const endPoint1Y = myAvatar.vertexPoints[1][1];
			
			//this are the hardcoded start and end points of the last line
			const startPoint2X = myAvatar.vertexPoints[startPoint2][0];
			const startPoint2Y = myAvatar.vertexPoints[startPoint2][1];
			const endPoint2X = myAvatar.vertexPoints[endPoint2][0];
			const endPoint2Y = myAvatar.vertexPoints[endPoint2][1];

			//this calculates whether the first and last lines intersect
			const m1 = (endPoint1Y - startPoint1Y) / (endPoint1X - startPoint1X);
			const c1 = startPoint1Y - m1 * startPoint1X;

			const m2 = (endPoint2Y - startPoint2Y) / (endPoint2X - startPoint2X);
			const c2 = startPoint2Y - m2 * startPoint2X;

			const x = (c2 - c1) / (m1 - m2);
			const y = m1 * x + c1;
			
			//add if statement to handle shapes that don't have a closed loop by automatically closing the loop
			//work on it!
			
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
		
		
		console.log("vertexList before destroy", this.vertexList);
		console.log("lineList before destroy", this.lineList);
		this.vertexList.forEach((c) => c.destroy());
		this.vertexList = [];
		this.lineList.forEach((c) => c.destroy());
		this.lineList = [];
		this.publish("removePopup", "removePopup");
		
		let dataBox1 = [... myAvatar.substituteArray];
		let dataBox2 = Object.assign({}, extrudeSettings);
		let dataBox3 = this.metalnessValue;
		
		console.log("1 publishing to cardCreator");
		
		let userShape = this.createCard({
			name:"userShape",
			type: "object",
			translation: [2.975, 0, -1.5],
			layers: ["pointer"],
			scale: [1, 1, 1],
			dataPackage1: dataBox1,
			dataPackage2: dataBox2,
			dataPackage3: dataBox3,
			
			behaviorModules: ["CardCreator"],
		});
        this.userShapes.push(userShape);
		
		console.log("cards", this.userShapes);
		
		console.log("2 card created");
	}

	calculateData(){
		console.log("in calculateData, vertexPoints", myAvatar.vertexPoints);
		let polyVertices = myAvatar.vertexPoints.length - 1;

		const numPoints = myAvatar.vertexPoints.length;
		let polyArea = 0;
		
		//calculate cross-sectional area of the polygonal object (face area of shape on canvas)
		for (let i = 0; i < numPoints; i++) {
			const [x1, y1] = myAvatar.vertexPoints[i];
			const [x2, y2] = myAvatar.vertexPoints[(i + 1) % numPoints]; 

			polyArea += (x1 * y2 - x2 * y1);
		}
		
		//calculate the area of the extruded sides of the polygonal object
		const depth = myAvatar.extrusionParameters[1] * 1000; //extrusion depth

		for (let i = 0; i < numPoints - 1; i++) {
			//get current vertex and next vertex
			const [x1, y1] = myAvatar.vertexPoints[i];
			const [x2, y2] = myAvatar.vertexPoints[(i + 1) % numPoints]; 
			
			//Euclidean distance formula between the current vertex and the next vertex
			const sideLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
			const sideArea = sideLength * depth;
			console.log("sidearea", sideArea);
			polyArea += sideArea;
			console.log("polyArea when adding sides", polyArea);
		}		 

		polyArea = Math.abs(polyArea);

		let polyVolume = polyArea * myAvatar.extrusionParameters[1] * 1000; //extrusion depth

		console.log("this.density 1", this.density);
		
		let polyMass = polyVolume * (this.density / 1000000);	
		
		console.log("this.density 2", this.density);
		
		console.log("polyMass", polyMass);
		
	
		let data = [polyVertices, polyArea, polyVolume, polyMass]
		
		console.log("data", data);
		
		this.publish("polyData", "polyData", data);
		myAvatar.vector3Points = [];
		myAvatar.vertexPoints = [];				
		
	}
	
	selectParameter(data) {
		console.log("data.action registered");
        
        if (data.action === "Extrusion Steps") {
            myAvatar.extrusionParametersChoice = 0;
            return;
        }
        if (data.action === "Extrusion Depth") {
            myAvatar.extrusionParametersChoice = 1;
            return;
        }
        if (data.action === "Enable Bevel") {
            myAvatar.extrusionParametersChoice = 2;
            return;
        }        
		if (data.action === "Bevel Thickness") {
            myAvatar.extrusionParametersChoice = 3;
            return;
        }       
		if (data.action === "Bevel Size") {
            myAvatar.extrusionParametersChoice = 4;
            return;
        }        
		if (data.action === "Bevel Offset") {
            myAvatar.extrusionParametersChoice = 5;
            return;
        }
		if (data.action === "Bevel Segments") {
            myAvatar.extrusionParametersChoice = 6;
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
	
	assignMaterial(data){
		console.log("userMaterial data", data);
		this.userMaterial = data;
		console.log("this.userMaterial", this.userMaterial);	
	}
	
	assignDensity(data){
		this.userDensity = data;
		console.log("this.userDensity", this.userDensity);
	}	
	
	assignMetalness(data){
		this.userMetalnessValue = data;
		console.log("this.userMetalnessValue", this.userMetalnessValue);
	}	
	
	setNewMaterial(data){
		//material name
		let material = this.userMaterial;
		
		//this is the only variable relevant to the polyData calculation, everything else is cosmetic
		let density = this.userDensity;
		
		let metalnessValue = this.userMetalnessValue;
		//colour
		
		let newData = [material, density, metalnessValue];
		
		this.publish("polyMaterial", "polyMaterial", newData);
		

		this.materialsArray[material] = [density, metalnessValue];
	
		
		console.log("this.materialsArray", this.materialsArray);
		
		this.publish("addNewMaterial", "addNewMaterial");
		
		this.MaterialPresetsMenu.destroy();
		this.createMaterialPresetsMenu();		
	}
	
	setMaterial(data){
		console.log("set material fired!");
		console.log("data", data);
		let materialName = data.action;
		console.log("materialName", materialName);
		
		if (materialName in this.materialsArray) {	
			let matData = [materialName];
			let tempArray = this.materialsArray[materialName];
			matData.push(tempArray[0]);
			matData.push(tempArray[1]);
			
			console.log("matData", matData);
			this.publish("polyMaterial", "polyMaterial", matData);
            return;
		}
		
		/* if (data.action === "Aluminium") {
            this.metalnessValue = 0.1;
			this.density = 2710;
			//this.publish("getMetalness", "getMetalness", this.metalnessValue);
			let matData = [this.materialName, this.density, this.metalnessValue];
			this.publish("polyMaterial", "polyMaterial", matData);
            return;
        } */
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
		
		this.subscribe("newPosition", "newPosition", this.setNewPosition);
		
		this.subscribe("vertexLocation", "vertexLocation", this.drawShapeLine);
		
		//from text3D.js
		this.listen("updateShape", "generateText3D");
		
		//make this pawn subscribe to message that initiates extrusion function
		//this.subscribe("canvasExtrude", "canvasExtrude", this.canvasExtrude);
		
		this.subscribe("precisionInput", "precisionInputX", this.setPointPreciseX);
		this.subscribe("precisionInput", "precisionInputY", this.setPointPreciseY);
		this.subscribe("precisionInput", "precisionInputSubmit", this.setPointPrecise);	

		//define storage of arrays locally in avatar, and define arrays
		//hard coded shortcut method of creating a new global array to store variables
		let myAvatar = this.getMyAvatar();
		
		//define array to store vertices on the canvas, then used to generate the 3D object
		
		//This array is a nested array used for storing the vertices on the canvas (2D) 
		//The points are defined as "x" and "y" floats, stored in a small 2-element array
		//This array is used for determining if the lines drawn by the user can form a loop 
		//by calculating the intercept point between the first and last lines
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
		
		//this.metalnessValue = 0;
		//this.subscribe("getMetalness", "getMetalness", this.setMetalness);

		//randomize pen colour when initiated (including when canvas is reset)
        this.color = this.randomColor();
        this.nib = 8; //pen nib diameter
        this.addEventListener("pointerDown", "pointerDown");

		this.drawCanvas();

        this.drawAll();
        console.log("DrawingCanvasPawn.setup");
    }
	
	setNewPosition(data){
		console.log("setNewPosition activated");
		console.log("data.vertexIndex", data.vertexIndex);
		console.log("data.XYZ", data.XYZ);
		
		let vec3 = data.XYZ.xyz;		
		
		let cooked = this.cookEvent(data.XYZ);
		let newPosition = [cooked.x, cooked.y];		
		
		myAvatar.vertexPoints[data.vertexIndex] = newPosition;
		myAvatar.vector3Points[data.vertexIndex] = new THREE.Vector3( (vec3[0]) , (vec3[1]), (vec3[2])  );
		console.log("myAvatar.vertexPoints[data.vertexIndex]", myAvatar.vertexPoints[data.vertexIndex]);
		
		this.publish("drawNewLine", "drawNewLine");
	}	
	
    resize(width, height) {
        console.log(width, height);
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
	
	drawShapeLine(evt){
		console.log("drawShapeLine", evt);
		
		//system to log x and y position on canvas based on pointerTap coordinate in 3D space in the world
		let evt2D = this.cookEvent(evt);
		
        let offsetX = evt2D.x;
        let offsetY = evt2D.y;
		myAvatar.vertexPoints.push([offsetX, offsetY]);	
		//this is necessary for the line interception system
		
		let vec3 = evt.xyz;
		
		myAvatar.vector3Points.push( new THREE.Vector3( (vec3[0]) , (vec3[1]), (vec3[2])  ) );		
		
		//let data = {rawEvt: evt, cookedEvt: evt2D};
		
		this.publish("newLine", "newLine");	
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
		
		let data = [offsetX, offsetY];
		let uncooked = this.uncook(data);
		
		console.log("uncooked x y and z", uncooked.x, uncooked.y, uncooked.z);
		
		//myAvatar.vector3Points.push( new THREE.Vector3( uncooked.x , 2.97499999, uncooked.z  ));
		
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
		console.log("evt in cookEvent", evt);
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

        console.log("cookevent x, y:", x, y);

        return {x, y};
    }
	
	uncook(data) {
		//just figure out what inverting the matrixworld does
		const x = data[0];
		const y = data[1];
		
		console.log("data in uncook", data);

		// Calculate the texture dimensions
		let textureWidth = this.actor._cardData.textureWidth;
		let textureHeight = this.actor._cardData.textureHeight;

		console.log("textureWidth", textureWidth);
		console.log("textureHeight", textureHeight);

		// Convert x and y back to their original values
		let newZ = (x / textureWidth) - 0.5;
		let newY = -(y / textureHeight) + 0.5;

		console.log("newX", newZ);
		console.log("newY", newY);

		// Create a vector with the transformed x and y values
		let vec = new Microverse.THREE.Vector3(newZ, newY, 0);

		console.log("vec", vec);

		// Clone and invert the matrixWorld
		let inv = this.renderObject.matrixWorld.clone().invert();

		console.log("inv", inv);

		// Apply the inverted matrix to the vector
		let vec2 = vec.applyMatrix4(inv);

		console.log("vec2", vec2);

		// Extract the transformed x, y, and z values
		let finalX =  2.9749999;
		let finalY = vec2.y;
		let finalZ = vec2.z;

		// Return an object with the calculated xyz values
		return { finalX, finalY, finalZ };
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


class SelectExtrusionParameterActor {
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

class ExtrusionParametersControlActor {
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

        this.listen("fire", "doAction");
    }

    updateSelections() {
        console.log("action updateSelections 2");
        let items = [
            {label: "Increase"},
            {label: "Decrease"},
        ];

        this.menu.call("Menu$MenuActor", "setItems", items);
    }

    doAction(data) {
        this.publish(this.id, "doAction2", data);
    }

    itemsUpdated() {
        this.publish(this.id, "extentChanged", {x: this.menu._cardData.width, y: this.menu._cardData.height});
    }
}

class MaterialPresetsActor {
	//this class permits the user to add additional materials to the default list
	setup(){
		this.subscribe("addNewMaterial", "addNewMaterial", this.addNewMaterial);	
	}
	
	addNewMaterial(){
		//this.items.push({label: data[0]});
		console.log("items in material presets list", this.items);
		console.log("this._cardData.materialsList", this._cardData.materialsList);
		this.updateSelections();
		//no publish statement yet
		//no concept for material submission mechanism yet (use textbox)
		
		//it seems that it isn't possible to dynamically add new labels to the `items` array of a menu within the actor, so I was wondering 
		//if it's possible to dynamically create new menus entirely, populated by new labels using user-inputted data
		
	}
	
    show() {
        if (this.menu) {
            this.menu.destroy();
        }

        this.menu = this.createCard({
            name: 'unem menu 3',
            behaviorModules: ["Menu"],
            parent: this,
            type: "2d",
            noSave: true,
            depth: 0.01,
            cornerRadius: 0.05,
			translation: [0, 0, 0.02],
			
        });
        this.subscribe(this.menu.id, "itemsUpdated", "itemsUpdated");
        this.updateSelections();

        this.listen("fire", "doAction");
    }

	updateSelections() {
		// Get the materials list from the card
		const materialsList = this._cardData.materialsList || [];
		const materials = Object.keys(materialsList);
		// Generate the items array dynamically based on the materials list
		this.items = materials.map((material) => {
			return { label: material, selected: false };
		});

		this.menu.call("Menu$MenuActor", "setItems", this.items);
	}

    doAction(data) {
        this.publish(this.id, "doAction3", data);
    }

    itemsUpdated() {
        this.publish(this.id, "extentChanged", {x: this.menu._cardData.width, y: this.menu._cardData.height});
    }
}

class NewMaterialsActor {
    show() {
        if (this.menu) {
            this.menu.destroy();
        }

        this.menu = this.createCard({
            name: 'unem menu 4',
            behaviorModules: ["Menu"],
            parent: this,
            type: "2d",
            noSave: true,
            depth: 0.01,
            cornerRadius: 0.05,
			translation: [0, 0, 0.01]
        });

        this.subscribe(this.menu.id, "itemsUpdated", "itemsUpdated");
        this.updateSelections();

        this.listen("fire", "doAction");
    }

    updateSelections() {
        console.log("action updateSelections 4");
        this.items = [
            {label: "Submit"}
        ];	
        this.menu.call("Menu$MenuActor", "setItems", this.items);
    }

    doAction(data) {
        this.publish(this.id, "doAction", data);
    }

    itemsUpdated() {
        this.publish(this.id, "extentChanged", {x: this.menu._cardData.width, y: this.menu._cardData.height});
    }
}

class clickToGenerateActor {

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

        this.listen("fire", "doAction");
    }

    updateSelections3() {
        console.log("action");
        let items = [
            {label: "Extrude Polygon"},
        ];

        this.menu.call("Menu$MenuActor", "setItems", items);
    }

    doAction(data) {
        this.publish(this.id, "doAction", data);
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
		//Sets the labels
		this.dataTypeDisplay();
		this.subscribe("polyData", "polyData", this.clear);
		this.subscribe("polyData", "polyData", this.displayData);
		
	}
	
	dataTypeDisplay(){
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
		
	}

	displayData(data){
        let color = "#FFFFFF";
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "left";
        ctx.fillStyle = color;
        ctx.font = "100px Arial";	
		
		this.dataTypeDisplay();

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
	
class MaterialsDisplayPawn{
	setup(){
		//Sets the labels
		this.dataTypeDisplay();
		this.subscribe("polyMaterial", "polyMaterial", this.clear);
		this.subscribe("polyMaterial", "polyMaterial", this.displayData);
	}
	
	dataTypeDisplay(){
        let color = "#FFFFFF";
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "left";
        ctx.fillStyle = color;
        ctx.font = "100px Arial";		

		ctx.fillText("Material: ", 40, 140);
		ctx.fillText("Density: ", 40, 320);		
		ctx.fillText("Metalness: ", 40, 500);		
		
		this.texture.needsUpdate = true;
		
	}	

	displayData(data){
		console.log("matData in data", data);
        let color = "#FFFFFF";
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "left";
        ctx.fillStyle = color;
        ctx.font = "100px Arial";	
		
		this.dataTypeDisplay();

		let material = data[0];
		let density = data[1];
		let metalness = data[2];
	
		let polyMaterial = String(material);
		let polyDensity = String(density);
		let polyMetalness = String(metalness);
	
		//Sets the data to the right of the labels
		ctx.fillText(polyMaterial, 540, 140);
		ctx.fillText(polyDensity + " kg/m³", 540, 320);	
		ctx.fillText(polyMetalness, 540, 500);		
		
		
		this.texture.needsUpdate = true;	
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

class precisionInputActor {
	//this class is responsible for providing a textbox for user inputs to two tools:
	//1. precise inputs of new vertex coordinates on the canvas
	//2. the material and density input for extrusion
	setup(){
		//event "changed" comes from TextFieldActor in text card. It is not published in this behaviour file 
		this.subscribe(this.id, "changed", this.init);
	}
	
	init() {
		//handles value from each text box separately, publishes to separate methods which store the value in separate arrays
		console.log("triggered init()");
		
		let	x = 0;
		let y = 0;
		
		if (this.name === "coordinate text bar") {
			
			// work on data from upper text field (x-coordinate)
			let x = this.value;
			this.publish("precisionInput", "precisionInputX", x);
		  
		} else if (this.name === "coordinate text bar 2") {
			
			// work on data from lower text field (y-coordinate)
			let y = this.value;
			this.publish("precisionInput", "precisionInputY", y);
		  
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

class materialInputActor {
	//this class is responsible for providing a textbox for user inputs to two tools:
	//1. precise inputs of new vertex coordinates on the canvas
	//2. the material and density input for extrusion
	setup(){
		//event "changed" comes from TextFieldActor in text card. It is not published in this behaviour file 
		this.subscribe(this.id, "changed", this.init);
	}
	
	init() {
		//handles value from each text box separately, publishes to separate methods which store the value in separate arrays
		console.log("triggered init()");

		if (this.name === "material text bar") {
			
			let material = this.value;
			console.log("material in init()", material);
			this.publish("assignMaterial", "assignMaterial", material);
		  
		} else if (this.name === "density text bar") {
			
			let density = this.value;
			console.log("density in init()", density);
			this.publish("assignDensity", "assignDensity", density);
		  
		} else if (this.name === "metalness text bar") {
			
			let metalness = this.value;
			console.log("metalness in init()", metalness);
			this.publish("assignMetalness", "assignMetalness", metalness);
		  
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

class PresetParaInput {
	setup(){
		//event "changed" comes from TextFieldActor in text card. It is not published in this behaviour file 
		this.subscribe(this.id, "changed", this.init);
	}
	
	init() {
		//handles value from each text box separately, publishes to separate methods which store the value in separate arrays
		console.log("triggered init()");

		if (this.name === "depth text bar") {
			
			let depth = this.value;
			console.log("depth in init()", depth);
			this.publish("assignDepth", "assignDepth", depth);
		  
		} else if (this.name === "radius text bar") {
			
			let radius = this.value;
			console.log("radius in init()", radius);
			this.publish("assignRadius", "assignRadius", radius);
		  
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
    doAction4() { 
		this.publish("generateShapePreset", "generateShapePreset");
		
	}

	
    /* itemsUpdated() {
        this.publish(this.id, "extentChanged", {x: this.menu._cardData.width, y: this.menu._cardData.height});
    }	 */

}

class CardCreatorPawn {
	setup(){	
		console.log("cardCreate has fired");
	
		let pointsArray = this.actor._cardData.dataPackage1; 
		let extrudeSettings = this.actor._cardData.dataPackage2;
		let metalnessValue = this.actor._cardData.dataPackage3;
		
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
		const material = new THREE.MeshStandardMaterial( {color: 0xcccccc, metalness: metalnessValue} );
		const newShape = new THREE.Mesh( geometry, material );
		
		newShape.rotation.x = Math.PI;
		newShape.rotation.y = -Math.PI / 2;

		this.shape.add(newShape);
	}	
	
}

class CylinderCreatorPawn{
	setup(){	
		var arcShape = new THREE.Shape();
		arcShape.absarc(0, 0, 1, Math.PI * 2, 0, false);
		//.absarc ( x : Float, y : Float, radius : Float, startAngle : Float, endAngle : Float, clockwise : Boolean )
	/*  x, y -- The absolute center of the arc.
		radius -- The radius of the arc.
		startAngle -- The start angle in radians.
		endAngle -- The end angle in radians.
		clockwise -- Sweep the arc clockwise. Defaults to false 
	*/
		
		let extrudeSettings = {
			depth: 0.1
		};

		var holePath = new THREE.Path();
		holePath.absarc(0, 0, 0.8, 0, Math.PI * 2, true);
		arcShape.holes.push(holePath);

		var geometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);

		const material = new THREE.MeshStandardMaterial( {color: 0xcccccc, metalness: 0.5} );
		const newShape = new THREE.Mesh( geometry, material );

		newShape.rotation.x = Math.PI;
		newShape.rotation.y = -Math.PI / 2;

		this.shape.add(newShape); 
	}
}

class VertexMarkerActor{
	setup(){
		this.popupCards = [];
		this.addEventListener("pointerMove", "nop");
		this.addEventListener("pointerEnter", this.generatePopupCard);
		
		this.addEventListener("pointerLeave", "unhilite");
		this.addEventListener("pointerDown", "removePopup");
		this.subscribe("removePopup", "removePopup", "removePopup");
		this.addEventListener("pointerUp", "setNewPosition");
		
		console.log("position of the vertex is", this._cardData.vertexIndex);
		console.log("this._cardData.vec3Position is", this._cardData.vec3Position);
		
		//set popup card translation so that it is just above the vertex
		this.vec3 = new Microverse.THREE.Vector3(...this._cardData.vec3Position.xyz);
	}	
	
	//code to spawn a pop-up card that will display the coordinates of the vertex that the user has mouse-overed
	//currently non-functioning
	generatePopupCard() {
		let popupTranslation = [this.vec3.x, this.vec3.y + 0.1, this.vec3.z];
		let index = this._cardData.vertexIndex;
		
		this.entered = true;
		let popupCard = this.createCard({
			name:"popup box",
			translation: popupTranslation,
			rotation: [0, -Math.PI / 2, 0],
			scale: [0.5, 0.5, 0.5],
			type: "2d",
			textureType: "canvas",
			textureWidth: 1600,
			textureHeight: 400,
			width: 4,
			height: 1,
			frameColor: 0x888888,
            behaviorModules: ["Popup Display", "SingleUser"],
			popupIndex: this._cardData.vertexIndex,
		});
		this.popupCards.push( popupCard );	
		return;
	}
	
	unhilite(evt) {
		console.log("evt in unhilite", evt);
        this.popupCards.forEach((c) => c.destroy());
		this.popupCards = [];
	}
	
	removePopup(){
		this.popupCards.forEach((c) => c.destroy());
		this.popupCards = [];
	}
	
	setNewPosition(evt){
		this.vec3 = new Microverse.THREE.Vector3(...evt.xyz);;
		console.log("current evt", evt);
		let v = this._cardData.vertexIndex;
		
		const newPosition = { vertexIndex: v, XYZ: evt};
		this.publish("newPosition", "newPosition", newPosition);
	}
    	
}

class VertexMarkerPawn {
	setup(){	
		this.addVertexMarker();
        this.addEventListener("pointerMove", "pointerMove");
        this.addEventListener("pointerDown", "pointerDown");
        this.addEventListener("pointerUp", "pointerUp");
        //this.listen("translationSet", "translated");
        //this.listen("rotationSet", "translated");				
	}	
	
	//to add vertex marker itself onto the canvas. This marker is draggable
	addVertexMarker(){
		let evt = this.actor._cardData.vec3Position;
		let vec3 = new Microverse.THREE.Vector3(...evt.xyz);
	
		const shape = new THREE.Shape();
        let geometry = new Microverse.THREE.SphereGeometry(0.015, 16, 16);
        let material = new Microverse.THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        let vertexMarker = new Microverse.THREE.Mesh(geometry, material);
		
		vertexMarker.position.x = vec3.x;
		vertexMarker.position.y = vec3.y;
		vertexMarker.position.z = vec3.z;			
		
		this.shape.add(vertexMarker);

		//this.popupCards = [];		
	}
	
	//all drag function code from here on
	/* translated(_data) {
        this.scrollAreaPawn.say("updateDisplay");
    }	 */
	
    moveMyself(evt) {
        //move the snowball itself. 
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

        let [x,y,z] = newPos; //find movement vector from mouse position

        this.set({translation: [0,y,z]}); // x value is always 12!
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
    }

    pointerDown(evt) {
        if (!evt.xyz) {return;}
        let {THREE, q_yaw, v3_rotateY} = Microverse;

        let avatar = this.getMyAvatar();
        let yaw = q_yaw(avatar.rotation);
        let normal = v3_rotateY([0, 0, -1], yaw);

        this._dragPlane = new THREE.Plane();
        this._dragPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(...normal),
            new THREE.Vector3(...evt.xyz)
        );

        this.downInfo = {translation: this.translation, downPosition: evt.xyz};
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

class DrawLinePawn {
	setup(){
		const shape = new THREE.Shape();
		
		const material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
		const geometry = new THREE.BufferGeometry().setFromPoints( myAvatar.vector3Points );
		const line = new THREE.Line( geometry, material );
		//line.rotation.y = -90 * Math.PI / 180;
		//line.translateX(-3);
		console.log("line drawn here");
		this.shape.add( line );			
		
	}
}

class PopupPawn {
	setup(){	
		
		console.log("myAvatar.vertexPoints in popup pawn", myAvatar.vertexPoints);
	
        let color = "#FFFFFF";
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "left";
        ctx.fillStyle = color;
        ctx.font = "100px Arial";		

		ctx.fillText("X: ", 40, 140);
		ctx.fillText("Y: ", 40, 320);		
		
		this.texture.needsUpdate = true;	
		this.displayData();
	}	

	displayData(data){
		let index = this.actor._cardData.popupIndex;

		this.x = myAvatar.vertexPoints[index][0];
		this.y = myAvatar.vertexPoints[index][1];
		
        let color = "#FFFFFF";
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "left";
        ctx.fillStyle = color;
        ctx.font = "100px Arial";	
	
		let msgX = String(this.x);
		let msgY = String(this.y);
		
		//Sets the data to the right of the labels
		ctx.fillText(msgX, 540, 140);
		ctx.fillText(msgY, 540, 320);		
		
		this.texture.needsUpdate = true;	
	}	
	
}

class shapePresetsMenuActor{
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
            {label: "Sphere"},
            {label: "Cylinder"},
            {label: "Cylindrical Pipe"},
			{label: "Cuboid"},
			//{label: "Bevel Size"},
			//{label: "Bevel Offset"},
			//{label: "Bevel Segments"},
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
            name: "SelectExtrusionParameter",
            actorBehaviors: [SelectExtrusionParameterActor]
        },
		{
            name: "ExtrusionParametersControl",
            actorBehaviors: [ExtrusionParametersControlActor]
        },			
		{
            name: "MaterialPresetsMenu",
            actorBehaviors: [MaterialPresetsActor]
        },		
		{
            name: "NewMaterialsMenu",
            actorBehaviors: [NewMaterialsActor]
        },		
		{
            name: "clickToGenerate",
            actorBehaviors: [clickToGenerateActor]
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
            name: "Materials Display",
            pawnBehaviors: [MaterialsDisplayPawn]
        },
		{
            name: "precisionInput",
			actorBehaviors: [precisionInputActor]
        },
		{
            name: "materialInput",
			actorBehaviors: [materialInputActor]
        },	
		{
            name: "CardCreator",
			pawnBehaviors: [CardCreatorPawn]
        },
		{
            name: "Vertex Marker",
			actorBehaviors: [VertexMarkerActor],
			pawnBehaviors: [VertexMarkerPawn]
        },			
		{
            name: "Draw Line",
			pawnBehaviors: [DrawLinePawn]
        },	
		{
            name: "Popup Display",
			pawnBehaviors: [PopupPawn]
        },			
		{
            name: "ShapePresetsMenu",
			actorBehaviors: [shapePresetsMenuActor]
        },			
		{
            name: "CylinderCreator",
			pawnBehaviors: [CylinderCreatorPawn]
        },			
		
    ]
};

/* globals Microverse */