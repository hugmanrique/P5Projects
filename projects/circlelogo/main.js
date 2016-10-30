/*
Created by Hugmanrique. Feel free to modify giving credit

Challenges:
- Instead of modify alpha colors, use the nearest real color when finding for each circle
- Use a noise function instead of random when choosing which circle to split.
  You can even use algorithms which use a particle modified by forces.

Good luck!
 */

var circles = [];
var image;

const baseSize = 64;
const fps = 10;
const minAlpha = 20;

var splitPerFps;
var divide;
var maxDepth = 3;

const bg = 51;

var splitSlider;
var numSlider;

var created = false;

function preload() {
    var queried = getQueryUrl();
    
    image = loadImage(queried || "projects/circlelogo/paisaje.jpg");
}

function getQueryUrl() {
    var qs = document.location.search;
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params['url'];
}

function setup(){
    var width = image.width; //+ (image.width % baseSize);
    var height = image.height; //+ (image.height % baseSize);
    
    createCanvas(width, height);
    
    splitSlider = createSlider(1, 20, 5);
    numSlider = createSlider(2, 4, 2);
    
    frameRate(fps);
    pixelDensity(1);
    
    background(bg);
    ellipseMode(CORNER);
}

function draw(){
    splitPerFps = splitSlider.value();
    divide = numSlider.value();
    
    if (!created && circles.length === 0) {
        // Create initial circles
        createCircles();
        created = true;
    }
    
    // Get circle to split
    for (var split = 0; split < splitPerFps; split++) {
        if (splitCircle()) {
            // We are done!
            noLoop();
            console.log('Done!');
            break;
        }
    }
}

function splitCircle() {
    if (circles.length === 0) {
        return true;
    }
    
    var toSplit = random(circles);

    if (toSplit.depth <= maxDepth) {
        var lastLayer = toSplit.depth == maxDepth - 1;
        toSplit.split(!lastLayer);
        
        return false;
    }
}

// Circle related stuff
function createCircles() {
    var maxHeight = round(height / baseSize);
    var maxWidth = round(width / baseSize);
    
    for (var y = 0; y < maxHeight; y++) {
        for (var x = 0; x < maxWidth; x++) {
            var circle = new Circle(x * baseSize, y * baseSize, baseSize);
            circle.draw();
            
            circles.push(circle);
        }
    }
}

var Circle = function (x, y, size, depth) {
    this.pos = createVector(x, y);
    this.depth = depth || 0;
    this.size = size;
    
    this.getColor();
};

Circle.prototype.draw = function () {
    fill(this.color);
    noStroke();
    
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
};

Circle.prototype.undraw = function () {
    fill(bg);
    noStroke();

    rect(this.pos.x, this.pos.y, this.size, this.size);
};

Circle.prototype.split = function (addToArray) {
    var subSize = this.size / divide;
    var depth = this.depth + 1;
    
    var index = circles.indexOf(this);
    circles.splice(index, 1);
    
    // Remove ellipse from this circle
    this.undraw();
    
    for (var i = 0; i < divide; i++) {
        for (var j = 0; j < divide; j++) {
            var xCircle = this.pos.x + (subSize * j);
            var yCircle = this.pos.y + (subSize * i);
            
            var newCircle = new Circle(xCircle, yCircle, subSize, depth);
            newCircle.draw();

            if (addToArray) {
                circles.push(newCircle);
            }
        }
    }
};

Circle.prototype.getColor = function () {
    this.color = image.get(this.pos.x, this.pos.y);
    
    // We don't want alpha
    if (this.color[3] < minAlpha){
        this.color[3] = minAlpha;
    }
};

// P5.js loadImage CORS hack
p5.prototype.loadImage = function(path, successCallback, failureCallback) {
    var img = new Image();
    var pImg = new p5.Image(1, 1, this);
    var decrementPreload = p5._getDecrementPreload.apply(this, arguments);

    img.onload = function() {
        pImg.width = pImg.canvas.width = img.width;
        pImg.height = pImg.canvas.height = img.height;
        pImg.drawingContext.drawImage(img, 0, 0);

        if (typeof successCallback === 'function') {
            successCallback(pImg);
        }
        if (decrementPreload && (successCallback !== decrementPreload)) {
            decrementPreload();
        }
    };
    img.onerror = function(e) {
        p5._friendlyFileLoadError(0,img.src);
        if ((typeof failureCallback === 'function') &&
            (failureCallback !== decrementPreload)) {
            failureCallback(e);
        }
    };

    img.crossOrigin = 'Anonymous';
    img.src = path;

    return pImg;
};