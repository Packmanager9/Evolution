
window.addEventListener('DOMContentLoaded', (event) => {


    let pomaoimg = new Image()
    pomaoimg.src = 'rcpomao.png'

    const squaretable = {} // this section of code is an optimization for use of the hypotenuse function on Line and LineOP objects
    for (let t = 0; t < 10000000; t++) {
        squaretable[`${t}`] = Math.sqrt(t)
        if (t > 999) {
            t += 9
        }
    }
    let video_recorder
    let recording = 0
    function CanvasCaptureToWEBM(canvas, bitrate) {
        // the video_recorder is set to  '= new CanvasCaptureToWEBM(canvas, 4500000);' in the setup, 
        // it uses the same canvas as the rest of the file.
        // to start a recording call .record() on video_recorder
        /*
        for example, 
        if(keysPressed['-'] && recording == 0){
            recording = 1
            video_recorder.record()
        }
        if(keysPressed['='] && recording == 1){
            recording = 0
            video_recorder.stop()
            video_recorder.download('File Name As A String.webm')
        }
        */
        this.record = Record
        this.stop = Stop
        this.download = saveToDownloads
        let blobCaptures = []
        let outputFormat = {}
        let recorder = {}
        let canvasInput = canvas.captureStream()
        if (typeof canvasInput == undefined || !canvasInput) {
            return
        }
        const video = document.createElement('video')
        video.style.display = 'none'

        function Record() {
            let formats = [
                "video/webm\;codecs=h264",
                "video/webm\;codecs=vp8",
                'video/vp8',
                "video/webm",
                'video/webm,codecs=vp9',
                "video/webm\;codecs=daala",
                "video/mpeg"
            ];

            for (let t = 0; t < formats.length; t++) {
                if (MediaRecorder.isTypeSupported(formats[t])) {
                    outputFormat = formats[t]
                    break
                }
            }
            if (typeof outputFormat != "string") {
                return
            } else {
                let videoSettings = {
                    mimeType: outputFormat,
                    videoBitsPerSecond: bitrate || 2000000 // 2Mbps
                };
                blobCaptures = []
                try {
                    recorder = new MediaRecorder(canvasInput, videoSettings)
                } catch (error) {
                    return;
                }
                recorder.onstop = handleStop
                recorder.ondataavailable = handleAvailableData
                recorder.start(100)
            }
        }
        function handleAvailableData(event) {
            if (event.data && event.data.size > 0) {
                blobCaptures.push(event.data)
            }
        }
        function handleStop() {
            const superBuffer = new Blob(blobCaptures, { type: outputFormat })
            video.src = window.URL.createObjectURL(superBuffer)
        }
        function Stop() {
            recorder.stop()
            video.controls = true
        }
        function saveToDownloads(input) { // specifying a file name for the output
            const name = input || 'video_out.webm'
            const blob = new Blob(blobCaptures, { type: outputFormat })
            const url = window.URL.createObjectURL(blob)
            const storageElement = document.createElement('a')
            storageElement.style.display = 'none'
            storageElement.href = url
            storageElement.download = name
            document.body.appendChild(storageElement)
            storageElement.click()
            setTimeout(() => {
                document.body.removeChild(storageElement)
                window.URL.revokeObjectURL(url)
            }, 100)
        }
    }
    const gamepadAPI = {
        controller: {},
        turbo: true,
        connect: function (evt) {
            if (navigator.getGamepads()[0] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[1] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[2] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[3] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            }
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i] === null) {
                    continue;
                }
                if (!gamepads[i].connected) {
                    continue;
                }
            }
        },
        disconnect: function (evt) {
            gamepadAPI.turbo = false;
            delete gamepadAPI.controller;
        },
        update: function () {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.buttonsCache = [];// clear the buttons cache
            for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {// move the buttons status from the previous frame to the cache
                gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
            }
            gamepadAPI.buttonsStatus = [];// clear the buttons status
            var c = gamepadAPI.controller || {}; // get the gamepad object
            var pressed = [];
            if (c.buttons) {
                for (var b = 0, t = c.buttons.length; b < t; b++) {// loop through buttons and push the pressed ones to the array
                    if (c.buttons[b].pressed) {
                        pressed.push(gamepadAPI.buttons[b]);
                    }
                }
            }
            var axes = [];
            if (c.axes) {
                for (var a = 0, x = c.axes.length; a < x; a++) {// loop through axes and push their values to the array
                    axes.push(c.axes[a].toFixed(2));
                }
            }
            gamepadAPI.axesStatus = axes;// assign received values
            gamepadAPI.buttonsStatus = pressed;
            // console.log(pressed); // return buttons for debugging purposes
            return pressed;
        },
        buttonPressed: function (button, hold) {
            var newPress = false;
            for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {// loop through pressed buttons
                if (gamepadAPI.buttonsStatus[i] == button) {// if we found the button we're looking for...
                    newPress = true;// set the boolean variable to true
                    if (!hold) {// if we want to check the single press
                        for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {// loop through the cached states from the previous frame
                            if (gamepadAPI.buttonsCache[j] == button) { // if the button was already pressed, ignore new press
                                newPress = false;
                            }
                        }
                    }
                }
            }
            return newPress;
        },
        buttons: [
            'A', 'B', 'X', 'Y', 'LB', 'RB', 'Left-Trigger', 'Right-Trigger', 'Back', 'Start', 'Axis-Left', 'Axis-Right', 'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right', "Power"
        ],
        buttonsCache: [],
        buttonsStatus: [],
        axesStatus: []
    };
    let canvas
    let canvas_context
    let keysPressed = {}
    let FLEX_engine
    let TIP_engine = {}
    let XS_engine
    let YS_engine
    class Point {
        constructor(x, y) {
            this.x = x
            this.y = y
            this.radius = 0
        }
        pointDistance(point) {
            return (new LineOP(this, point, "transparent", 0)).hypotenuse()
        }
    }

    class Vector { // vector math and physics if you prefer this over vector components on circles
        constructor(object = (new Point(0, 0)), xmom = 0, ymom = 0) {
            this.xmom = xmom
            this.ymom = ymom
            this.object = object
        }
        isToward(point) {
            let link = new LineOP(this.object, point)
            let dis1 = link.squareDistance()
            let dummy = new Point(this.object.x + this.xmom, this.object.y + this.ymom)
            let link2 = new LineOP(dummy, point)
            let dis2 = link2.squareDistance()
            if (dis2 < dis1) {
                return true
            } else {
                return false
            }
        }
        rotate(angleGoal) {
            let link = new Line(this.xmom, this.ymom, 0, 0)
            let length = link.hypotenuse()
            let x = (length * Math.cos(angleGoal))
            let y = (length * Math.sin(angleGoal))
            this.xmom = x
            this.ymom = y
        }
        magnitude() {
            return (new Line(this.xmom, this.ymom, 0, 0)).hypotenuse()
        }
        normalize(size = 1) {
            let magnitude = this.magnitude()
            this.xmom /= magnitude
            this.ymom /= magnitude
            this.xmom *= size
            this.ymom *= size
        }
        multiply(vect) {
            let point = new Point(0, 0)
            let end = new Point(this.xmom + vect.xmom, this.ymom + vect.ymom)
            return point.pointDistance(end)
        }
        add(vect) {
            return new Vector(this.object, this.xmom + vect.xmom, this.ymom + vect.ymom)
        }
        subtract(vect) {
            return new Vector(this.object, this.xmom - vect.xmom, this.ymom - vect.ymom)
        }
        divide(vect) {
            return new Vector(this.object, this.xmom / vect.xmom, this.ymom / vect.ymom) //be careful with this, I don't think this is right
        }
        draw() {
            let dummy = new Point(this.object.x + this.xmom, this.object.y + this.ymom)
            let link = new LineOP(this.object, dummy, "#FFFFFF", 1)
            link.draw()
        }
    }
    class Line {
        constructor(x, y, x2, y2, color, width) {
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        angle() {
            return Math.atan2(this.y1 - this.y2, this.x1 - this.x2)
        }
        squareDistance() {
            let xdif = this.x1 - this.x2
            let ydif = this.y1 - this.y2
            let squareDistance = (xdif * xdif) + (ydif * ydif)
            return squareDistance
        }
        hypotenuse() {
            let xdif = this.x1 - this.x2
            let ydif = this.y1 - this.y2
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            if (hypotenuse < 10000000 - 1) {
                if (hypotenuse > 1000) {
                    return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
                } else {
                    return squaretable[`${Math.round(hypotenuse)}`]
                }
            } else {
                return Math.sqrt(hypotenuse)
            }
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.x1, this.y1)
            canvas_context.lineTo(this.x2, this.y2)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }
    class LineOP {
        constructor(object, target, color, width) {
            this.object = object
            this.target = target
            this.color = color
            this.width = width
        }
        squareDistance() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let squareDistance = (xdif * xdif) + (ydif * ydif)
            return squareDistance
        }
        hypotenuse() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            if (hypotenuse < 10000000 - 1) {
                if (hypotenuse > 1000) {
                    return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
                } else {
                    return squaretable[`${Math.round(hypotenuse)}`]
                }
            } else {
                return Math.sqrt(hypotenuse)
            }
        }
        angle() {
            return Math.atan2(this.object.y - this.target.y, this.object.x - this.target.x)
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.object.x, this.object.y)
            canvas_context.lineTo(this.target.x, this.target.y)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }
    class Triangle {
        constructor(x, y, color, length, fill = 0, strokeWidth = 0, leg1Ratio = 1, leg2Ratio = 1, heightRatio = 1) {
            this.x = x
            this.y = y
            this.color = color
            this.length = length
            this.x1 = this.x + this.length * leg1Ratio
            this.x2 = this.x - this.length * leg2Ratio
            this.tip = this.y - this.length * heightRatio
            this.accept1 = (this.y - this.tip) / (this.x1 - this.x)
            this.accept2 = (this.y - this.tip) / (this.x2 - this.x)
            this.fill = fill
            this.stroke = strokeWidth
        }
        draw() {
            canvas_context.strokeStyle = this.color
            canvas_context.stokeWidth = this.stroke
            canvas_context.beginPath()
            canvas_context.moveTo(this.x, this.y)
            canvas_context.lineTo(this.x1, this.y)
            canvas_context.lineTo(this.x, this.tip)
            canvas_context.lineTo(this.x2, this.y)
            canvas_context.lineTo(this.x, this.y)
            if (this.fill == 1) {
                canvas_context.fill()
            }
            canvas_context.stroke()
            canvas_context.closePath()
        }
        isPointInside(point) {
            if (point.x <= this.x1) {
                if (point.y >= this.tip) {
                    if (point.y <= this.y) {
                        if (point.x >= this.x2) {
                            this.accept1 = (this.y - this.tip) / (this.x1 - this.x)
                            this.accept2 = (this.y - this.tip) / (this.x2 - this.x)
                            this.basey = point.y - this.tip
                            this.basex = point.x - this.x
                            if (this.basex == 0) {
                                return true
                            }
                            this.slope = this.basey / this.basex
                            if (this.slope >= this.accept1) {
                                return true
                            } else if (this.slope <= this.accept2) {
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }
    class Rectangle {
        constructor(x, y, width, height, color, fill = 1, stroke = 0, strokeWidth = 1) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
            this.stroke = stroke
            this.strokeWidth = strokeWidth
            this.fill = fill
        }
        draw() {
            canvas_context.fillStyle = this.color
            canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move() {
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point) {
            if (point.x >= this.x) {
                if (point.y >= this.y) {
                    if (point.x <= this.x + this.width) {
                        if (point.y <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            if (point.x + point.radius >= this.x) {
                if (point.y + point.radius >= this.y) {
                    if (point.x - point.radius <= this.x + this.width) {
                        if (point.y - point.radius <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle {
        constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0, strokeWidth = 0, strokeColor = "transparent") {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.friction = friction
            this.reflect = reflect
            this.strokeWidth = strokeWidth
            this.strokeColor = strokeColor
        }
        draw() {
            canvas_context.lineWidth = this.strokeWidth
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath();
            if (this.radius > 0) {
                canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
                canvas_context.fillStyle = this.color
                canvas_context.fill()
                canvas_context.stroke();
            } else {
                console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
            }
        }
        move() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
        }
        unmove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x -= this.xmom
            this.y -= this.ymom
        }
        frictiveMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
            this.xmom *= this.friction
            this.ymom *= this.friction
        }
        frictiveunMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.xmom /= this.friction
            this.ymom /= this.friction
            this.x -= this.xmom
            this.y -= this.ymom
        }
        isPointInside(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
                return true
            }
            return false
        }
        doesPerimeterTouch(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
                return true
            }
            return false
        }
    } class Polygon {
        constructor(x, y, size, color, sides = 3, xmom = 0, ymom = 0, angle = 0, reflect = 0) {
            if (sides < 2) {
                sides = 2
            }
            this.reflect = reflect
            this.xmom = xmom
            this.ymom = ymom
            this.body = new Circle(x, y, size - (size * .293), "transparent")
            this.nodes = []
            this.angle = angle
            this.size = size
            this.color = color
            this.angleIncrement = (Math.PI * 2) / sides
            this.sides = sides
            for (let t = 0; t < sides; t++) {
                let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
        }
        isPointInside(point) { // rough approximation
            this.body.radius = this.size - (this.size * .293)
            if (this.sides <= 2) {
                return false
            }
            this.areaY = point.y - this.body.y
            this.areaX = point.x - this.body.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.body.radius * this.body.radius)) {
                return true
            }
            return false
        }
        move() {
            if (this.reflect == 1) {
                if (this.body.x > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.body.y > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.body.x < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.body.y < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.body.x += this.xmom
            this.body.y += this.ymom
        }
        draw() {
            this.nodes = []
            this.angleIncrement = (Math.PI * 2) / this.sides
            this.body.radius = this.size - (this.size * .293)
            for (let t = 0; t < this.sides; t++) {
                let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
            canvas_context.strokeStyle = this.color
            canvas_context.fillStyle = this.color
            canvas_context.lineWidth = 0
            canvas_context.beginPath()
            canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
            for (let t = 1; t < this.nodes.length; t++) {
                canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
            }
            canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
            canvas_context.fill()
            canvas_context.stroke()
            canvas_context.closePath()
        }
    }
    class Shape {
        constructor(shapes) {
            this.shapes = shapes
        }
        draw() {
            for (let t = 0; t < this.shapes.length; t++) {
                this.shapes[t].draw()
            }
        }
        isPointInside(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].isPointInside(point)) {
                    return true
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].doesPerimeterTouch(point)) {
                    return true
                }
            }
            return false
        }
        innerShape(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].doesPerimeterTouch(point)) {
                    return this.shapes[t]
                }
            }
            return false
        }
        isInsideOf(box) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (box.isPointInside(this.shapes[t])) {
                    return true
                }
            }
            return false
        }
        adjustByFromDisplacement(x, y) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (typeof this.shapes[t].fromRatio == "number") {
                    this.shapes[t].x += x * this.shapes[t].fromRatio
                    this.shapes[t].y += y * this.shapes[t].fromRatio
                }
            }
        }
        adjustByToDisplacement(x, y) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (typeof this.shapes[t].toRatio == "number") {
                    this.shapes[t].x += x * this.shapes[t].toRatio
                    this.shapes[t].y += y * this.shapes[t].toRatio
                }
            }
        }
        mixIn(arr) {
            for (let t = 0; t < arr.length; t++) {
                for (let k = 0; k < arr[t].shapes.length; k++) {
                    this.shapes.push(arr[t].shapes[k])
                }
            }
        }
        push(object) {
            this.shapes.push(object)
        }
    }

    class Spring {
        constructor(x, y, radius, color, body = 0, length = 1, gravity = 0, width = 1) {
            if (body == 0) {
                this.body = new Circle(x, y, radius, color)
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
                this.length = length
            } else {
                this.body = body
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
                this.length = length
            }
            this.gravity = gravity
            this.width = width
        }
        balance() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
            if (this.beam.hypotenuse() < this.length) {
                this.body.xmom += (this.body.x - this.anchor.x) / this.length
                this.body.ymom += (this.body.y - this.anchor.y) / this.length
                this.anchor.xmom -= (this.body.x - this.anchor.x) / this.length
                this.anchor.ymom -= (this.body.y - this.anchor.y) / this.length
            } else {
                this.body.xmom -= (this.body.x - this.anchor.x) / this.length
                this.body.ymom -= (this.body.y - this.anchor.y) / this.length
                this.anchor.xmom += (this.body.x - this.anchor.x) / this.length
                this.anchor.ymom += (this.body.y - this.anchor.y) / this.length
            }
            let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
            let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
            this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
            this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
            this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
            this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
        }
        draw() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
            this.beam.draw()
            this.body.draw()
            this.anchor.draw()
        }
        move() {
            this.anchor.ymom += this.gravity
            this.anchor.move()
        }

    }
    class SpringOP {
        constructor(body, anchor, length, width = 3, color = body.color) {
            this.body = body
            this.anchor = anchor
            this.beam = new LineOP(body, anchor, color, width)
            this.length = length
        }
        balance() {
            if (this.beam.hypotenuse() < this.length) {
                this.body.xmom += ((this.body.x - this.anchor.x) / this.length)
                this.body.ymom += ((this.body.y - this.anchor.y) / this.length)
                this.anchor.xmom -= ((this.body.x - this.anchor.x) / this.length)
                this.anchor.ymom -= ((this.body.y - this.anchor.y) / this.length)
            } else if (this.beam.hypotenuse() > this.length) {
                this.body.xmom -= (this.body.x - this.anchor.x) / (this.length)
                this.body.ymom -= (this.body.y - this.anchor.y) / (this.length)
                this.anchor.xmom += (this.body.x - this.anchor.x) / (this.length)
                this.anchor.ymom += (this.body.y - this.anchor.y) / (this.length)
            }

            let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
            let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
            this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
            this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
            this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
            this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
        }
        draw() {
            this.beam.draw()
        }
        move() {
            //movement of SpringOP objects should be handled separate from their linkage, to allow for many connections, balance here with this object, move nodes independently
        }
    }

    class Color {
        constructor(baseColor, red = -1, green = -1, blue = -1, alpha = 1) {
            this.hue = baseColor
            if (red != -1 && green != -1 && blue != -1) {
                this.r = red
                this.g = green
                this.b = blue
                if (alpha != 1) {
                    if (alpha < 1) {
                        this.alpha = alpha
                    } else {
                        this.alpha = alpha / 255
                        if (this.alpha > 1) {
                            this.alpha = 1
                        }
                    }
                }
                if (this.r > 255) {
                    this.r = 255
                }
                if (this.g > 255) {
                    this.g = 255
                }
                if (this.b > 255) {
                    this.b = 255
                }
                if (this.r < 0) {
                    this.r = 0
                }
                if (this.g < 0) {
                    this.g = 0
                }
                if (this.b < 0) {
                    this.b = 0
                }
            } else {
                this.r = 0
                this.g = 0
                this.b = 0
            }
        }
        normalize() {
            if (this.r > 255) {
                this.r = 255
            }
            if (this.g > 255) {
                this.g = 255
            }
            if (this.b > 255) {
                this.b = 255
            }
            if (this.r < 0) {
                this.r = 0
            }
            if (this.g < 0) {
                this.g = 0
            }
            if (this.b < 0) {
                this.b = 0
            }
        }
        randomLight() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 12) + 4)];
            }
            var color = new Color(hash, 55 + Math.random() * 200, 55 + Math.random() * 200, 55 + Math.random() * 200)
            return color;
        }
        randomDark() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 12))];
            }
            var color = new Color(hash, Math.random() * 200, Math.random() * 200, Math.random() * 200)
            return color;
        }
        random() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 16))];
            }
            var color = new Color(hash, Math.random() * 255, Math.random() * 255, Math.random() * 255)
            return color;
        }
    }
    class Softbody { //buggy, spins in place
        constructor(x, y, radius, color, members = 10, memberLength = 5, force = 10, gravity = 0) {
            this.springs = []
            this.pin = new Circle(x, y, radius, color)
            this.spring = new Spring(x, y, radius, color, this.pin, memberLength, gravity)
            this.springs.push(this.spring)
            for (let k = 0; k < members; k++) {
                this.spring = new Spring(x, y, radius, color, this.spring.anchor, memberLength, gravity)
                if (k < members - 1) {
                    this.springs.push(this.spring)
                } else {
                    this.spring.anchor = this.pin
                    this.springs.push(this.spring)
                }
            }
            this.forceConstant = force
            this.centroid = new Point(0, 0)
        }
        circularize() {
            this.xpoint = 0
            this.ypoint = 0
            for (let s = 0; s < this.springs.length; s++) {
                this.xpoint += (this.springs[s].anchor.x / this.springs.length)
                this.ypoint += (this.springs[s].anchor.y / this.springs.length)
            }
            this.centroid.x = this.xpoint
            this.centroid.y = this.ypoint
            this.angle = 0
            this.angleIncrement = (Math.PI * 2) / this.springs.length
            for (let t = 0; t < this.springs.length; t++) {
                this.springs[t].body.x = this.centroid.x + (Math.cos(this.angle) * this.forceConstant)
                this.springs[t].body.y = this.centroid.y + (Math.sin(this.angle) * this.forceConstant)
                this.angle += this.angleIncrement
            }
        }
        balance() {
            for (let s = this.springs.length - 1; s >= 0; s--) {
                this.springs[s].balance()
            }
            this.xpoint = 0
            this.ypoint = 0
            for (let s = 0; s < this.springs.length; s++) {
                this.xpoint += (this.springs[s].anchor.x / this.springs.length)
                this.ypoint += (this.springs[s].anchor.y / this.springs.length)
            }
            this.centroid.x = this.xpoint
            this.centroid.y = this.ypoint
            for (let s = 0; s < this.springs.length; s++) {
                this.link = new Line(this.centroid.x, this.centroid.y, this.springs[s].anchor.x, this.springs[s].anchor.y, 0, "transparent")
                if (this.link.hypotenuse() != 0) {
                    this.springs[s].anchor.xmom += (((this.springs[s].anchor.x - this.centroid.x) / (this.link.hypotenuse()))) * this.forceConstant
                    this.springs[s].anchor.ymom += (((this.springs[s].anchor.y - this.centroid.y) / (this.link.hypotenuse()))) * this.forceConstant
                }
            }
            for (let s = 0; s < this.springs.length; s++) {
                this.springs[s].move()
            }
            for (let s = 0; s < this.springs.length; s++) {
                this.springs[s].draw()
            }
        }
    }
    class Observer {
        constructor(x, y, radius, color, range = 100, rays = 10, angle = (Math.PI * .125)) {
            this.body = new Circle(x, y, radius, color)
            this.color = color
            this.ray = []
            this.rayrange = range
            this.globalangle = Math.PI
            this.gapangle = angle
            this.currentangle = 0
            this.obstacles = []
            this.raymake = rays
        }
        beam() {
            this.currentangle = this.gapangle / 2
            for (let k = 0; k < this.raymake; k++) {
                this.currentangle += (this.gapangle / Math.ceil(this.raymake / 2))
                let ray = new Circle(this.body.x, this.body.y, 1, "white", (((Math.cos(this.globalangle + this.currentangle)))), (((Math.sin(this.globalangle + this.currentangle)))))
                ray.collided = 0
                ray.lifespan = this.rayrange - 1
                this.ray.push(ray)
            }
            for (let f = 0; f < this.rayrange; f++) {
                for (let t = 0; t < this.ray.length; t++) {
                    if (this.ray[t].collided < 1) {
                        this.ray[t].move()
                        for (let q = 0; q < this.obstacles.length; q++) {
                            if (this.obstacles[q].isPointInside(this.ray[t])) {
                                this.ray[t].collided = 1
                            }
                        }
                    }
                }
            }
        }
        draw() {
            this.beam()
            this.body.draw()
            canvas_context.lineWidth = 1
            canvas_context.fillStyle = this.color
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath()
            canvas_context.moveTo(this.body.x, this.body.y)
            for (let y = 0; y < this.ray.length; y++) {
                canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
                canvas_context.lineTo(this.body.x, this.body.y)
            }
            canvas_context.stroke()
            canvas_context.fill()
            this.ray = []
        }
    }
    function setUp(canvas_pass, style = "#000000") {
        canvas = canvas_pass
        video_recorder = new CanvasCaptureToWEBM(canvas2, 2500000);
        canvas_context = canvas.getContext('2d', {willReadFrequently:true});
        canvas.style.background = style
        window.setInterval(function () {
            main()
        }, 1)
        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            delete keysPressed[event.key];
        });
        window.addEventListener('pointerdown', e => {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine*(canvas.width/canvas2.width)
            TIP_engine.y = YS_engine*(canvas.width/canvas2.width)
            TIP_engine.body = TIP_engine

        let food = new Food(Math.floor(TIP_engine.x), Math.floor(TIP_engine.y), Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255))
        foods.push(food)


            // example usage: if(object.isPointInside(TIP_engine)){ take action }
            window.addEventListener('pointermove', continued_stimuli);
        });
        window.addEventListener('pointerup', e => {
            window.removeEventListener("pointermove", continued_stimuli);
        })
        function continued_stimuli(e) {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine
            TIP_engine.y = YS_engine
            TIP_engine.body = TIP_engine
        }
    }
    function gamepad_control(object, speed = 1) { // basic control for objects using the controler
        //         console.log(gamepadAPI.axesStatus[1]*gamepadAPI.axesStatus[0]) //debugging
        if (typeof object.body != 'undefined') {
            if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
                if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                    object.body.x += (gamepadAPI.axesStatus[0] * speed)
                    object.body.y += (gamepadAPI.axesStatus[1] * speed)
                }
            }
        } else if (typeof object != 'undefined') {
            if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
                if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                    object.x += (gamepadAPI.axesStatus[0] * speed)
                    object.y += (gamepadAPI.axesStatus[1] * speed)
                }
            }
        }
    }
    function control(object, speed = 1) { // basic control for objects
   
            if (keysPressed['w']) {
                object.y -= speed
            }
            if (keysPressed['d']) {
                object.x += speed
            }
            if (keysPressed['s']) {
                object.y += speed
            }
            if (keysPressed['a']) {
                object.x -= speed
            }
    }
    function getRandomLightColor() { // random color that will be visible on  black background
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12) + 4)];
        }
        return color;
    }
    function getRandomColor() { // random color
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 16) + 0)];
        }
        return color;
    }
    function getRandomDarkColor() {// color that will be visible on a black background
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12))];
        }
        return color;
    }
    function castBetween(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
        let limit = granularity
        let shape_array = []
        for (let t = 0; t < limit; t++) {
            let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
            circ.toRatio = t / limit
            circ.fromRatio = (limit - t) / limit
            shape_array.push(circ)
        }
        return (new Shape(shape_array))
    }

    function castBetweenPoints(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
        let limit = granularity
        let shape_array = []
        for (let t = 0; t < limit; t++) {
            let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
            circ.toRatio = t / limit
            circ.fromRatio = (limit - t) / limit
            shape_array.push(circ)
        }
        return shape_array
    }

    class Disang {
        constructor(dis, ang) {
            this.dis = dis
            this.angle = ang
        }
    }

    class BezierHitbox {
        constructor(x, y, cx, cy, ex, ey, color = "red") { // this function takes a starting x,y, a control point x,y, and a end point x,y
            this.color = color
            this.x = x
            this.y = y
            this.cx = cx
            this.cy = cy
            this.ex = ex
            this.ey = ey
            this.metapoint = new Circle((x + cx + ex) / 3, (y + cy + ey) / 3, 3, "#FFFFFF")
            this.granularity = 100
            this.body = [...castBetweenPoints((new Point(this.x, this.y)), (new Point(this.ex, this.ey)), this.granularity, 0)]

            let angle = (new Line(this.x, this.y, this.ex, this.ey)).angle()

            this.angles = []
            for (let t = 0; t < this.granularity; t++) {
                this.angles.push(angle)
            }
            for (let t = 0; t <= 1; t += 1 / this.granularity) {
                this.body.push(this.getQuadraticXY(t))
                this.angles.push(this.getQuadraticAngle(t))
            }
            this.hitbox = []
            for (let t = 0; t < this.body.length; t++) {
                let link = new LineOP(this.body[t], this.metapoint)
                let disang = new Disang(link.hypotenuse(), link.angle() + (Math.PI * 2))
                this.hitbox.push(disang)
            }
            this.constructed = 1
        }
        isPointInside(point) {
            let link = new LineOP(point, this.metapoint)
            let angle = (link.angle() + (Math.PI * 2))
            let dis = link.hypotenuse()
            for (let t = 1; t < this.hitbox.length; t++) {
                if (Math.abs(this.hitbox[t].angle - this.hitbox[t - 1].angle) > 1) {
                    continue
                }
                if (angle.between(this.hitbox[t].angle, this.hitbox[t - 1].angle)) {
                    if (dis < (this.hitbox[t].dis + this.hitbox[t - 1].dis) * .5) {
                        return true
                    }
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            let link = new LineOP(point, this.metapoint)
            let angle = (link.angle() + (Math.PI * 2))
            let dis = link.hypotenuse()
            for (let t = 1; t < this.hitbox.length; t++) {
                if (Math.abs(this.hitbox[t].angle - this.hitbox[t - 1].angle) > 1) {
                    continue
                }
                if (angle.between(this.hitbox[t].angle, this.hitbox[t - 1].angle)) {
                    if (dis < ((this.hitbox[t].dis + this.hitbox[t - 1].dis) * .5) + point.radius) {
                        return this.angles[t]
                    }
                }
            }
            return false
        }
        draw() {
            this.metapoint.draw()
            let tline = new Line(this.x, this.y, this.ex, this.ey, this.color, 3)
            tline.draw()
            canvas_context.beginPath()
            this.median = new Point((this.x + this.ex) * .5, (this.y + this.ey) * .5)
            let angle = (new LineOP(this.median, this.metapoint)).angle()
            let dis = (new LineOP(this.median, this.metapoint)).hypotenuse()
            canvas_context.bezierCurveTo(this.x, this.y, this.cx - (Math.cos(angle) * dis * .38), this.cy - (Math.sin(angle) * dis * .38), this.ex, this.ey)

            canvas_context.fillStyle = this.color
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = 3
            canvas_context.stroke()
        }
        getQuadraticXY(t) {
            return new Point((((1 - t) * (1 - t)) * this.x) + (2 * (1 - t) * t * this.cx) + (t * t * this.ex), (((1 - t) * (1 - t)) * this.y) + (2 * (1 - t) * t * this.cy) + (t * t * this.ey))
        }
        getQuadraticAngle(t) {
            var dx = 2 * (1 - t) * (this.cx - this.x) + 2 * t * (this.ex - this.cx);
            var dy = 2 * (1 - t) * (this.cy - this.y) + 2 * t * (this.ey - this.cy);
            return -Math.atan2(dx, dy) + 0.5 * Math.PI;
        }
    }
    
    Number.prototype.between = function (a, b, inclusive) {
        var min = Math.min(a, b),
            max = Math.max(a, b);
        return inclusive ? this >= min && this <= max : this > min && this < max;
    }

    let setup_canvas = document.getElementById('canvas') //getting canvas from document
    let canvas2 = document.getElementById('canvas2') //getting canvas from document
    
    let canvas2_context = canvas2.getContext('2d', {willReadFrequently:true});
    let textbox = document.getElementById('text') //getting canvas from document

    setUp(setup_canvas) // setting up canvas refrences, starting timer. 

    let pix = canvas_context.getImageData(0,0,canvas.width, canvas.height)
    let pix2 = canvas_context.getImageData(0,0,canvas.width, canvas.height)

    class Animal {
        constructor(x,y,r,g,b, rsize = 3, gsize = 3, bsize = 3, a=1,b2=1,c=1){
            this.x = x
            this.y = y
            this.xdir = Math.sign(Math.random()-.5)
            this.ydir = Math.sign(Math.random()-.5)
            this.stepcount = 0
            this.age = 0
            while(r+g+b > (128*3)){
                r*=.999
                g*=.999
                b*=.999
            }
            this.r = r
            this.g = g
            this.b = b
            this.link = new LineOP(this, this)
            this.tlink = new LineOP(this, {x:0,y:0})
            this.brainrate = 10
            this.count=0
            this.track = 0
            this.rsize = Math.max(1,rsize)
            this.gsize = Math.max(1,gsize)
            this.bsize = Math.max(1,bsize)
            this.brain = [a,b2,c]
            this.braincounter = 0
            this.assessment = 20
        }
        red(w,k){
            // let s1 = Math.sign(this.xdir*w)
            // let s2 = Math.sign(this.ydir*k)
            // return Math.sign(s1*s2)

            let cos = Math.cos((w*k))
            return (cos)
        }
        green(w,k){
            let cos = Math.cos((w*k))
            return cos
        }
        blue(w,k){
            let cos = Math.cos((w*k))
            return cos
        }
        draw(){
            let t = (((this.x)+(this.y*canvas.width))*4)
            // pix.data[t] = this.r
            // pix.data[t+1] = this.g
            // pix.data[t+2] = this.b
            pix.data[t+3] = 255

            for(let w = -this.rsize*2;w<this.rsize*2+1;w++){
                for(let k = -this.rsize*2;k<this.rsize*2+1;k++){
                    t = (((this.x+w)+((this.y+k)*canvas.width))*4)
                    pix.data[t] += ((this.r/1) *this.red(w,k))
                }
            }
            for(let w = -this.gsize*2;w<this.gsize*2+1;w++){
                for(let k = -this.gsize*2;k<this.gsize*2+1;k++){
                    t = (((this.x+w)+((this.y+k)*canvas.width))*4)
                    pix.data[t+1] += ((this.g/1)*this.green(w,k))
                }
            }
            for(let w = -this.bsize*2;w<this.bsize*2+1;w++){
                for(let k = -this.bsize*2;k<this.bsize*2+1;k++){
                    t = (((this.x+w)+((this.y+k)*canvas.width))*4)
                    pix.data[t+2] += ((this.b/1)*this.blue(w,k))
                }
            }


            this.move()
        }
        move(){
            this.count++

            // let q =  this.tlink.hypotenuse() 

            this.brainrate = 2//   Math.ceil(((750)/this.g)*(animals.length/150))

            // if(Math.random() < .01){
            //     this.mode = Math.floor(Math.random() *3)
            // }

            this.braincounter++
            if(this.braincounter%this.assessment == 0){
                let top = this.brain[0]+this.brain[1]+this.brain[2]
                let modemaker = Math.random()*top
                if(modemaker<(this.brain[0])){
                    this.mode = 0
                }else if(modemaker<(this.brain[0]+this.brain[1])){
                    this.mode = 1
                }else if(modemaker<(this.brain[0]+this.brain[1]+this.brain[2])){
                    this.mode = 2
                }
            }
            
            
            if(this.count%this.brainrate == 0){//// || q<=this.size*3){

                let min = 999999999

                if(this.mode == 0){

                    for(let t = 0;t<animals.length;t++){
                        if(this!=animals[t] && animals[t].parent != this){
                            if(this.r > animals[t].b && this.b > animals[t].r){
                            this.link.target = animals[t]
                            let k = this.link.hypotenuse() 
                            if(k < min){
                                min = k
                                this.tlink.target = animals[t]
                                this.track = 1
                                this.xdir = Math.sign( animals[t].x - this.x )
                                this.ydir =   Math.sign(animals[t].y - this.y )
                            }
                            if(k <= Math.max((this.rsize + this.bsize) - (animals[t].rsize + animals[t].bsize), 3)  ){
                                    animals.splice(t,1)
                                    this.split()
                                }
                            }else{
        
                        //         if(Math.random()<.5){
                        //         if(this.r < animals[t].b && this.b < animals[t].r){
        
        
        
                        //         this.link.target = animals[t]
                        //         let k = this.link.hypotenuse() 
                        //         if(k < min){
                        //             min = k
                        //             this.xdir = -Math.sign( animals[t].x - this.x )
                        //             this.ydir =   -Math.sign(animals[t].y - this.y )
                        //         }
                        //     }
                        // }
                            }
                        }
                    }
                }else if(this.mode == 1){

                    for(let t = 0;t<foods.length;t++){
                        this.link.target = foods[t]
                        let k = this.link.hypotenuse() 
                        if(k < min ){
                            min = k
                            this.tlink.target = foods[t]
                            this.track = -1
                            this.xdir = Math.sign( foods[t].x - this.x )
                            this.ydir =   Math.sign(foods[t].y - this.y )
                        }
                        if(k <= this.gsize){
                            foods.splice(t,1)
                            this.split()
                        }
                    }
                }else{

                    for(let t = 0;t<animals.length;t++){
                        if(this!=animals[t] && animals[t].parent != this && this.parent != animals[t]){
                            if(this.r > animals[t].b && this.b > animals[t].r){
                            // this.link.target = animals[t]
                            // let k = this.link.hypotenuse() 
                            // if(k < min ){
                            //     min = k
                            //     this.tlink.target = animals[t]
                            //     this.track = 1
                            //     this.xdir = Math.sign( animals[t].x - this.x )
                            //     this.ydir =   Math.sign(animals[t].y - this.y )
                            // }
                            // if(k <= 5){
                            //         animals.splice(t,1)
                            //         this.split()
                            //     }
                            }else{
                                if(Math.random()<.5){
                                    if(this.r < animals[t].b && this.b < animals[t].r){
                                this.link.target = animals[t]
                                let k = this.link.hypotenuse() 
                                if(k < min){
                                    min = k
                                    this.xdir = -Math.sign( animals[t].x - this.x )
                                    this.ydir =   -Math.sign(animals[t].y - this.y )
                                }
                            }
                        }
                            }
                        }
                    }
                }
    
    
            }


            if(this.x < 5){
                this.xdir = 1
                this.x =  5
            }
            if(this.x > canvas.width-5){
                this.xdir = -1
                this.x = canvas.width-5
            }
            if(this.y < 5){
                this.ydir = 1
                this.y = 5
            }
            if(this.y > canvas.height-5){
                this.ydir = -1
                this.y = canvas.height-5
            }

            this.stepcount+=(((this.g/(128)))+.25)
            while(this.stepcount >= 1){
                this.stepcount--
                this.x+=this.xdir
                this.y+=this.ydir
            }

        }
        split(){
            this.age*=.4
            this.mut = 30
            let newanimal = new Animal(this.x, this.y, (this.r+(this.mut*(Math.random()-.5))),    (this.g+(this.mut*(Math.random()-.5))),    (this.b+(this.mut*(Math.random()-.5))), (this.rsize + (Math.floor((Math.random()-.5)*3)))    , (this.gsize + (Math.floor((Math.random()-.5)*3)))    , (this.bsize + (Math.floor((Math.random()-.5)*3))), Math.max(0, ((Math.random()-.5)*.1)*this.brain[0]),Math.max(0, ((Math.random()-.5)*.1)*this.brain[1]),Math.max(0, ((Math.random()-.5)*.1)*this.brain[2])   )
            newanimal.parent = this
            if(animals.length < 1500){
                animals.unshift(newanimal)
            }
        }
    }

    class Food {
        constructor(x,y,r,g,b){
            this.x = Math.min(Math.max(5,x),canvas.width-5)
            this.y = Math.min(Math.max(5,y),canvas.height-5)
            this.xdir = 0
            this.ydir = 0
            this.stepcount = 0
            this.r = 255
            this.g = 255
            this.b = 255
            this.pulse = 0
        }
        draw(){
            let t = (((this.x)+(this.y*canvas.width))*4)
            this.xsto = this.x
            this.ysto = this.y
            this.pulse+=.05
            pix.data[t] = this.r
            pix.data[t+1] = this.g
            pix.data[t+2] = this.b
            pix.data[t+3] = 255
            // for(let w = -2;w<3;w++){
            //     for(let k = -2;k<3;k++){
            //         t = (((this.x+w)+((this.y+k)*canvas.width))*4)
            //         pix.data[t] += (27 *Math.cos(this.pulse))/((Math.abs(w)+1)*(Math.abs(k)+1))
            //         pix.data[t+1] += (27*Math.cos(this.pulse))/((Math.abs(w)+1)*(Math.abs(k)+1))
            //         pix.data[t+2] += (27*Math.cos(this.pulse))/((Math.abs(w)+1)*(Math.abs(k)+1))
            //         pix.data[t+3] = 255
            //     }
            // }

            //  t = (((this.x)+(this.y*canvas.width))*4)
            // this.xsto = this.x
            // this.ysto = this.y
            // this.pulse+=.3
            // pix.data[t] = this.r
            // pix.data[t+1] = this.g
            // pix.data[t+2] = this.b
            // pix.data[t+3] = 255
            // this.move()
        }
        move(){
            this.stepcount+=(this.g/255)
            if(this.stepcount >= 1){
                this.stepcount--
                this.x+=this.xdir
                this.y+=this.ydir
            }

        }
    }

    let player = new Circle(350,350, 3, "#FFFFFF88")
    let player2 = new Circle(350,350, 8, "#FFFFFF33")
    let player3 = new Circle(350,350, 13, "#FFFFFF44")
    let player4 = new Circle(350,350, 13, "#FFFFFF44")
    let animals = []
    for(let t = 0;t<1;t++){
        let animal = new Animal(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height), Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255))
        let yp = Math.floor(Math.random()*3)
        // if(yp == 0){
            animal.r = 100
            animal.g = 100
            animal.b = 100
        // }
        // if(yp == 1){
        //     animal.r = 0
        //     animal.g = 200
        //     animal.b = 0
        // }
        // if(yp == 2){
        //     animal.r = 0
        //     animal.g = 0
        //     animal.b = 200
        // }
       if(Math.abs(animal.x-350)+Math.abs(animal.y-350) > 50){
        animals.push(animal)
       }
    }
    let foods = []
    for(let t = 0;t<10;t++){
        let food = new Food(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height), Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255))
        foods.push(food)
    }

     let foodcount  =0 

    // object instantiation and creation happens here 

    let mote = new Audio()
    mote.src = "threebeat.mp3"
    mote.volume = .5
    function main() {
        canvas_context.clearRect(0, 0, canvas.width, canvas.height)  // refreshes the image
        // // mag_canvas_context.clearRect(0, 0, mag_canvas.width, mag_canvas.height)  // refreshes the image
        // mote.play()
        gamepadAPI.update() //checks for button presses/stick movement on the connected controller)
        // // // game code goes here    

        // for(let t = 0;t<pix.data.length;t++){
        //     pix.data[t]*=(pix.data[t]/512)
        //     pix.data[t]=Math.floor(pix.data[t])
        //     if(pix.data[t] > 255){
        //         pix.data[t] %= 100
        //     }
        // }
        for(let t = 0;t<pix.data.length;t++){
            // pix.data[t]*=(pix.data[t]/192)
            pix.data[t]=Math.floor(pix.data[t])
            if(t%4 != 3){
                pix.data[t] *=.7
                pix.data[t]%=128
            }else{

                pix.data[t] = 255
            }
        }
        for(let t = 0;t<animals.length;t++){
            animals[t].draw()
            animals[t].age++
        }
        // for(let t = 0;t<pix.data.length;t++){
        //     pix2.data[t] = pix.data[t]
        // }


        // let x = 0
        // let y = 0
        // for(let t = 0;t<canvas.width*canvas.height;t++){

        //     let index = (((x)+(y*canvas.width))*4)
        //     if(x > 0 && x < canvas.width){
        //         if(y>0 && y < canvas.height){

        //             let gaps = [ (((x-1)+((y-1)*canvas.width))*4),   (((x-1)+((y-0)*canvas.width))*4),   (((x-1)+((y+1)*canvas.width))*4),   (((x-0)+((y-1)*canvas.width))*4),  (((x-0)+((y+1)*canvas.width))*4),   (((x+1)+((y-1)*canvas.width))*4),   (((x+1)+((y-0)*canvas.width))*4),   (((x+1)+((y+1)*canvas.width))*4) ]
        //         for(let g = 0;g<gaps.length;g++){
        //             // pix.data[index] += pix.data[gaps[g]]*.049
        //             pix2.data[gaps[g]] += pix.data[index]*.025

        //             // pix.data[index+1] += pix.data[gaps[g]+1]*.048
        //             pix2.data[gaps[g]+1] += pix.data[index+1]*.025

        //             // pix.data[index+2] += pix.data[gaps[g]+2]*.047
        //             pix2.data[gaps[g]+2] += pix.data[index+2]*.025
        //         }
        //         }
        //     }

        //     x++
        //     if(x > canvas.width){
        //         y++
        //         x = 0
        //     }
        // }

        // for(let t = 0;t<pix.data.length;t++){
        //     pix.data[t] = pix2.data[t]
        // }

        for(let t = 0;t<animals.length;t++){
            if(animals[t].age > (1200/((((animals[t].g/((128*3*2))))+.5)))){
                animals.splice(t,1)
            }
        }
        for(let t = 0;t<foods.length;t++){
            foods[t].draw()
            // control(foods[t],100)
        }

        foodcount+=1
        if(foodcount > 9){
            foodcount = 0

    // for(let t = 0;t<5;t++){
        let food = new Food(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height), Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255))
        foods.push(food)
    // }

        }


        canvas_context.putImageData(pix,0,0)


        // player.draw()
        // player2.draw()
        // player3.draw()
        // control(player,3)
        // control(player2,3)
        // control(player3,3)
        // control(player4,3)
        // if(player.x < 0){
        //     player.x = 0
        //     player2.x = 0
        //     player3.x = 0
        //     player4.x = 0
        // }
        // if(player.y < 0){
        //     player.y = 0
        //     player2.y = 0
        //     player3.y = 0
        //     player4.y = 0
        // }
        // if(player.x > canvas.width){
        //     player.x = canvas.width
        //     player2.x = canvas.width
        //     player3.x = canvas.width
        //     player4.x = canvas.width
        // }
        // if(player.y > canvas.height){
        //     player.y = canvas.height
        //     player2.y = canvas.height
        //     player3.y = canvas.height
        //     player4.y = canvas.height
        // }




        // for(let t = 0;t<foods.length;t++){
        //     if(player4.isPointInside(foods[t])){
        //         foods.splice(t,1)
        //         if(player3.radius < 13){
        //             player3.radius+=5
        //         }
        //         if(player3.radius == 13){
        //             player2.radius = 8
        //         }
        //     }

        // }


        // for(let t = 0;t<animals.length;t++){
        //     animals[t].link.target = player3
        //     if(animals[t].link.hypotenuse() < player3.radius){
        //         player3.radius-=5
        //         animals[t].age = 99999999
        //         animals[t].x = 0
        //         animals[t].y = 0
        //         if(player3.radius <=0){
        //             player3.radius = 1


        //                     player = new Circle(350,350, 3, "#FFFFFF88")
        //                     player2 = new Circle(350,350, 8, "#FFFFFF33")
        //                     player3 = new Circle(350,350, 13, "#FFFFFF44")
        //                     player4 = new Circle(350,350, 13, "#FFFFFF44")
        //                     animals = []
        //                     for(let t = 0;t<100;t++){
        //                         let animal = new Animal(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height), Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255))
        //                         let yp = Math.floor(Math.random()*3)
        //                         if(yp == 0){
        //                             animal.r = 200
        //                             animal.g = 100
        //                             animal.b = 100
        //                         }
        //                         if(yp == 1){
        //                             animal.r = 100
        //                             animal.g = 200
        //                             animal.b = 100
        //                         }
        //                         if(yp == 2){
        //                             animal.r = 100
        //                             animal.g = 100
        //                             animal.b = 200
        //                         }
        //                     if(Math.abs(animal.x-350)+Math.abs(animal.y-350) > 50){
        //                         animals.push(animal)
        //                     }
        //                     }
        //                     foods = []
        //                     for(let t = 0;t<100;t++){
        //                         let food = new Food(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height), Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255))
        //                         foods.push(food)
        //                     }



        //         }
        //         if(player3.radius <=8){
        //             player2.radius = 3
        //         }
        //     }
        // }

        if(keysPressed['-'] && recording == 0){
            recording = 1
            video_recorder.record()
        }
        if(keysPressed['='] && recording == 1){
            recording = 0
            video_recorder.stop()
            video_recorder.download('File Name As A String.webm')
        }
        canvas2_context.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,1280,720)
    }

})
