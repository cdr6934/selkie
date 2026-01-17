export const template =  {
    htmlContent: 
     `<!DOCTYPE html>
    <html>
    <head>
        <title>p5.js Sketch</title>
        <script src="scripts/p5.js"></script>
        <script src="scripts/sketch.js"></script>
        <script src="scripts/random.js"></script>
    </head>
    <body>
    </body>
    </html>`, 
    sketchContent: `function setup() {
        createCanvas(400, 400);
    }
    
    function draw() {
        background(220);
    }`, 
    randomContent: `
    // RANDOM Class ////////////////////////////////////////////////////////////
class Random {
    constructor () {
      this.useA = false;
      let sfc32 = function (uint128Hex) {
        let a = parseInt (uint128Hex.substr (0, 8), 16);
        let b = parseInt (uint128Hex.substr (8, 8), 16);
        let c = parseInt (uint128Hex.substr (16, 8), 16);
        let d = parseInt (uint128Hex.substr (24, 8), 16);
        return function () {
          a |= 0;
          b |= 0;
          c |= 0;
          d |= 0;
          let t = (((a + b) | 0) + d) | 0;
          d = (d + 1) | 0;
          a = b ^ (b >>> 9);
          b = (c + (c << 3)) | 0;
          c = (c << 21) | (c >>> 11);
          c = (c + t) | 0;
          return (t >>> 0) / 4294967296;
        };
      };
      // seed prngA with first half of tokenData.hash
      this.prngA = new sfc32 (tokenData.hash.substr (2, 32));
      // seed prngB with second half of tokenData.hash
      this.prngB = new sfc32 (tokenData.hash.substr (34, 32));
      for (let i = 0; i < 1e6; i += 2) {
        this.prngA ();
        this.prngB ();
      }
    }
    // random number between 0 (inclusive) and 1 (exclusive)
    random_dec () {
      this.useA = !this.useA;
      return this.useA ? this.prngA () : this.prngB ();
    }
    // random number between a (inclusive) and b (exclusive)
    random_num (a, b) {
      return a + (b - a) * this.random_dec ();
    }
    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    random_int (a, b) {
      return Math.floor (this.random_num (a, b + 1));
    }
  
    // random boolean with p as percent liklihood of true
    random_bool (p) {
      return this.random_dec () < p;
    }
    // random value in an array of items
    random_choice (list) {
      return list[this.random_int (0, list.length - 1)];
    }
  }
  
    `, 
  colorContent: `let a = ['CDCDCD', 'FF0000', 'FFA500', 'FFFF00', '008000', '0000FF', '4B0082', 'EE82EE'];`
}

export const svgTemplate = {
    htmlContent: `<!DOCTYPE html>
<html>
<head>
    <title>Paper.js SVG Sketch</title>
    <script src="scripts/paper-full.js"></script>
    <script src="scripts/random.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f0f0f0;
        }
        canvas {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <canvas id="canvas" resize></canvas>
    <script src="scripts/sketch.js"></script>
</body>
</html>`,
    sketchContent: `// Paper.js setup
paper.setup('canvas');

// Set canvas size
var canvasWidth = 800;
var canvasHeight = 800;
paper.view.viewSize = new paper.Size(canvasWidth, canvasHeight);

// Example: Create a simple generative pattern
function createSketch() {
    // Clear previous content
    paper.project.clear();

    // Create a background
    var background = new paper.Path.Rectangle({
        point: [0, 0],
        size: [canvasWidth, canvasHeight],
        fillColor: '#ffffff'
    });

    // Example: Draw some circles
    var center = new paper.Point(canvasWidth / 2, canvasHeight / 2);

    for (var i = 0; i < 10; i++) {
        var circle = new paper.Path.Circle({
            center: center,
            radius: 50 + i * 30,
            strokeColor: '#333333',
            strokeWidth: 2
        });
    }

    // Draw the view
    paper.view.draw();
}

// Run the sketch
createSketch();

// Export SVG function - call this from console: exportSVG()
window.exportSVG = function(filename) {
    filename = filename || 'sketch.svg';
    var svg = paper.project.exportSVG({ asString: true });
    var blob = new Blob([svg], { type: 'image/svg+xml' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    console.log('SVG exported as ' + filename);
};

// Keyboard shortcut: Press 's' to save SVG
document.addEventListener('keydown', function(e) {
    if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        window.exportSVG();
    }
});`,
    randomContent: `// RANDOM Class ////////////////////////////////////////////////////////////
class Random {
    constructor(seed) {
        this.seed = seed || Math.random().toString(16).substr(2, 32).padEnd(32, '0') +
                          Math.random().toString(16).substr(2, 32).padEnd(32, '0');
        this.useA = false;
        let sfc32 = function(uint128Hex) {
            let a = parseInt(uint128Hex.substr(0, 8), 16);
            let b = parseInt(uint128Hex.substr(8, 8), 16);
            let c = parseInt(uint128Hex.substr(16, 8), 16);
            let d = parseInt(uint128Hex.substr(24, 8), 16);
            return function() {
                a |= 0; b |= 0; c |= 0; d |= 0;
                let t = (((a + b) | 0) + d) | 0;
                d = (d + 1) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
            };
        };
        this.prngA = new sfc32(this.seed.substr(0, 32));
        this.prngB = new sfc32(this.seed.substr(32, 32));
        for (let i = 0; i < 1e6; i += 2) {
            this.prngA();
            this.prngB();
        }
    }

    random_dec() {
        this.useA = !this.useA;
        return this.useA ? this.prngA() : this.prngB();
    }

    random_num(a, b) {
        return a + (b - a) * this.random_dec();
    }

    random_int(a, b) {
        return Math.floor(this.random_num(a, b + 1));
    }

    random_bool(p) {
        return this.random_dec() < p;
    }

    random_choice(list) {
        return list[this.random_int(0, list.length - 1)];
    }
}

// Global random instance
var R = new Random();`
}

export const threeTemplate = {
    htmlContent: `<!DOCTYPE html>
<html>
<head>
    <title>Three.js Sketch</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        canvas {
            display: block;
        }
    </style>
</head>
<body>
    <script type="importmap">
    {
        "imports": {
            "three": "./scripts/three.module.js"
        }
    }
    </script>
    <script src="scripts/random.js"></script>
    <script type="module" src="scripts/sketch.js"></script>
</body>
</html>`,
    sketchContent: `import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Create geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// Export PNG function - call this from console: exportPNG()
window.exportPNG = function(filename) {
    filename = filename || 'sketch.png';
    renderer.render(scene, camera);
    const link = document.createElement('a');
    link.href = renderer.domElement.toDataURL('image/png');
    link.download = filename;
    link.click();
    console.log('PNG exported as ' + filename);
};

// Keyboard shortcut: Press 's' to save PNG
document.addEventListener('keydown', function(e) {
    if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        window.exportPNG();
    }
});`,
    randomContent: `// RANDOM Class ////////////////////////////////////////////////////////////
class Random {
    constructor(seed) {
        this.seed = seed || Math.random().toString(16).substr(2, 32).padEnd(32, '0') +
                          Math.random().toString(16).substr(2, 32).padEnd(32, '0');
        this.useA = false;
        let sfc32 = function(uint128Hex) {
            let a = parseInt(uint128Hex.substr(0, 8), 16);
            let b = parseInt(uint128Hex.substr(8, 8), 16);
            let c = parseInt(uint128Hex.substr(16, 8), 16);
            let d = parseInt(uint128Hex.substr(24, 8), 16);
            return function() {
                a |= 0; b |= 0; c |= 0; d |= 0;
                let t = (((a + b) | 0) + d) | 0;
                d = (d + 1) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
            };
        };
        this.prngA = new sfc32(this.seed.substr(0, 32));
        this.prngB = new sfc32(this.seed.substr(32, 32));
        for (let i = 0; i < 1e6; i += 2) {
            this.prngA();
            this.prngB();
        }
    }

    random_dec() {
        this.useA = !this.useA;
        return this.useA ? this.prngA() : this.prngB();
    }

    random_num(a, b) {
        return a + (b - a) * this.random_dec();
    }

    random_int(a, b) {
        return Math.floor(this.random_num(a, b + 1));
    }

    random_bool(p) {
        return this.random_dec() < p;
    }

    random_choice(list) {
        return list[this.random_int(0, list.length - 1)];
    }
}

// Global random instance
var R = new Random();`
}

export const glslTemplate = {
    htmlContent: `<!DOCTYPE html>
<html>
<head>
    <title>GLSL Shader Sketch</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        canvas {
            display: block;
            max-width: 100%;
            max-height: 100%;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script src="scripts/random.js"></script>
    <script src="scripts/sketch.js"></script>
</body>
</html>`,
    sketchContent: `// WebGL setup
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (!gl) {
    alert('WebGL not supported');
}

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

// Vertex shader source
const vertexShaderSource = \`
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_uv = a_position * 0.5 + 0.5;
}
\`;

// Fragment shader source
const fragmentShaderSource = \`
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_uv;

void main() {
    vec2 uv = v_uv;
    
    // Example: Animated gradient
    vec3 color = vec3(
        sin(uv.x * 3.14 + u_time) * 0.5 + 0.5,
        sin(uv.y * 3.14 + u_time * 0.7) * 0.5 + 0.5,
        sin((uv.x + uv.y) * 2.0 + u_time * 1.3) * 0.5 + 0.5
    );
    
    gl_FragColor = vec4(color, 1.0);
}
\`;

// Compile shader
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    return shader;
}

// Create shader program
function createProgram(vertexSource, fragmentSource) {
    const vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
        return null;
    }
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    
    return program;
}

// Create full-screen quad
function createQuad() {
    const positions = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    return buffer;
}

// Initialize
const program = createProgram(vertexShaderSource, fragmentShaderSource);
const quadBuffer = createQuad();

if (!program) {
    alert('Failed to create shader program');
}

// Get attribute and uniform locations
const positionLocation = gl.getAttribLocation(program, 'a_position');
const timeLocation = gl.getUniformLocation(program, 'u_time');
const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

// Animation loop
let startTime = Date.now();

function animate() {
    requestAnimationFrame(animate);
    
    const currentTime = (Date.now() - startTime) / 1000.0;
    
    // Clear
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Use program
    gl.useProgram(program);
    
    // Set uniforms
    gl.uniform1f(timeLocation, currentTime);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    
    // Set up quad
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
});

// Start animation
animate();

// Export PNG function - call this from console: exportPNG()
window.exportPNG = function(filename) {
    filename = filename || 'sketch.png';
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
    console.log('PNG exported as ' + filename);
};

// Keyboard shortcut: Press 's' to save PNG
document.addEventListener('keydown', function(e) {
    if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        window.exportPNG();
    }
});`,
    randomContent: `// RANDOM Class ////////////////////////////////////////////////////////////
class Random {
    constructor(seed) {
        this.seed = seed || Math.random().toString(16).substr(2, 32).padEnd(32, '0') +
                          Math.random().toString(16).substr(2, 32).padEnd(32, '0');
        this.useA = false;
        let sfc32 = function(uint128Hex) {
            let a = parseInt(uint128Hex.substr(0, 8), 16);
            let b = parseInt(uint128Hex.substr(8, 8), 16);
            let c = parseInt(uint128Hex.substr(16, 8), 16);
            let d = parseInt(uint128Hex.substr(24, 8), 16);
            return function() {
                a |= 0; b |= 0; c |= 0; d |= 0;
                let t = (((a + b) | 0) + d) | 0;
                d = (d + 1) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
            };
        };
        this.prngA = new sfc32(this.seed.substr(0, 32));
        this.prngB = new sfc32(this.seed.substr(32, 32));
        for (let i = 0; i < 1e6; i += 2) {
            this.prngA();
            this.prngB();
        }
    }

    random_dec() {
        this.useA = !this.useA;
        return this.useA ? this.prngA() : this.prngB();
    }

    random_num(a, b) {
        return a + (b - a) * this.random_dec();
    }

    random_int(a, b) {
        return Math.floor(this.random_num(a, b + 1));
    }

    random_bool(p) {
        return this.random_dec() < p;
    }

    random_choice(list) {
        return list[this.random_int(0, list.length - 1)];
    }
}

// Global random instance
var R = new Random();`
}

export const ml5HandTrackingTemplate = {
    htmlContent: `<!DOCTYPE html>
<html>
<head>
    <title>ML5 Hand Tracking Sketch</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #container {
            position: relative;
            display: inline-block;
        }
        #video {
            display: block;
            transform: scaleX(-1); /* Mirror the video */
        }
        #canvas {
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            transform: scaleX(-1); /* Mirror the canvas */
        }
        #status {
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div id="container">
        <video id="video" autoplay playsinline></video>
        <canvas id="canvas"></canvas>
        <div id="status">Initializing...</div>
    </div>
    <!-- ML5.js v1.0+ - uses await and event listeners -->
    <script src="https://unpkg.com/ml5@latest/dist/ml5.min.js"></script>
    <!-- Alternative: If you need the older API (v0.12.2), use this instead:
    <script src="https://unpkg.com/ml5@0.12.2/dist/ml5.min.js"></script>
    -->
    <script src="scripts/random.js"></script>
    <script src="scripts/sketch.js"></script>
</body>
</html>`,
    sketchContent: `// Video and canvas setup
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');

let handpose = null;
let hands = [];
let isModelReady = false;

// Set canvas size (will be updated when video loads)
let videoWidth = 640;
let videoHeight = 480;

// Initialize video stream
async function initVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            videoWidth = video.videoWidth;
            videoHeight = video.videoHeight;
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            video.play();
            statusDiv.textContent = 'Video loaded. Loading model...';
            initHandTracking();
        };
    } catch (err) {
        console.error('Error accessing webcam:', err);
        statusDiv.textContent = 'Error: Could not access webcam';
        alert('Could not access webcam. Please allow camera access.');
    }
}

// Initialize hand tracking
async function initHandTracking() {
    try {
        // ML5.js v1.0+ API - use await and event listeners
        handpose = await ml5.handpose({
            video: video,
            flipHorizontal: true
        });
        
        isModelReady = true;
        statusDiv.textContent = 'Model ready! Show your hands.';
        
        // Listen for predictions using the 'predict' event
        handpose.on('predict', (results) => {
            hands = results || [];
            draw();
        });
        
        // Start the detection loop
        animate();
    } catch (err) {
        console.error('Error initializing hand tracking:', err);
        statusDiv.textContent = 'Error: Could not load hand tracking model';
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    draw();
}

// Draw function
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw video frame
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    
    // Draw hand landmarks
    if (hands && hands.length > 0) {
        hands.forEach((hand, handIndex) => {
            // Handle different data structures - ML5 might return landmarks or keypoints
            const keypoints = hand.keypoints || hand.landmarks || [];
            
            // Draw keypoints
            if (keypoints && keypoints.length > 0) {
                keypoints.forEach((keypoint, index) => {
                    const x = keypoint.x || keypoint[0];
                    const y = keypoint.y || keypoint[1];
                    
                    if (x !== undefined && y !== undefined) {
                        // Draw keypoint
                        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
                        ctx.beginPath();
                        ctx.arc(x, y, 5, 0, 2 * Math.PI);
                        ctx.fill();
                        
                        // Draw keypoint number
                        ctx.fillStyle = 'white';
                        ctx.font = '10px Arial';
                        ctx.fillText(index, x + 8, y);
                    }
                });
            }
            
            // Draw hand connections (skeleton)
            const keypoints = hand.keypoints || hand.landmarks || [];
            if (keypoints && keypoints.length >= 21) {
                ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
                ctx.lineWidth = 2;
                
                // Thumb
                drawLine(keypoints[0], keypoints[1]);
                drawLine(keypoints[1], keypoints[2]);
                drawLine(keypoints[2], keypoints[3]);
                drawLine(keypoints[3], keypoints[4]);
                
                // Index finger
                drawLine(keypoints[0], keypoints[5]);
                drawLine(keypoints[5], keypoints[6]);
                drawLine(keypoints[6], keypoints[7]);
                drawLine(keypoints[7], keypoints[8]);
                
                // Middle finger
                drawLine(keypoints[0], keypoints[9]);
                drawLine(keypoints[9], keypoints[10]);
                drawLine(keypoints[10], keypoints[11]);
                drawLine(keypoints[11], keypoints[12]);
                
                // Ring finger
                drawLine(keypoints[0], keypoints[13]);
                drawLine(keypoints[13], keypoints[14]);
                drawLine(keypoints[14], keypoints[15]);
                drawLine(keypoints[15], keypoints[16]);
                
                // Pinky
                drawLine(keypoints[0], keypoints[17]);
                drawLine(keypoints[17], keypoints[18]);
                drawLine(keypoints[18], keypoints[19]);
                drawLine(keypoints[19], keypoints[20]);
            }
            
            // Draw hand bounding box
            if (hand.boundingBox) {
                const { x, y, width, height } = hand.boundingBox;
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, width, height);
            }
        });
        
        // Update status
        statusDiv.textContent = \`\${hands.length} hand(s) detected\`;
    } else {
        statusDiv.textContent = 'No hands detected';
    }
}

// Helper function to draw lines between keypoints
function drawLine(point1, point2) {
    if (point1 && point2) {
        const x1 = point1.x !== undefined ? point1.x : point1[0];
        const y1 = point1.y !== undefined ? point1.y : point1[1];
        const x2 = point2.x !== undefined ? point2.x : point2[0];
        const y2 = point2.y !== undefined ? point2.y : point2[1];
        
        if (x1 !== undefined && y1 !== undefined && x2 !== undefined && y2 !== undefined) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
}

// Get hand data (useful for custom interactions)
function getHandData() {
    return hands;
}

// Get specific keypoint (0-20, where 0 is wrist)
function getKeypoint(handIndex, keypointIndex) {
    if (hands[handIndex]) {
        const keypoints = hands[handIndex].keypoints || hands[handIndex].landmarks || [];
        if (keypoints[keypointIndex]) {
            const kp = keypoints[keypointIndex];
            // Normalize to {x, y} format
            return {
                x: kp.x !== undefined ? kp.x : kp[0],
                y: kp.y !== undefined ? kp.y : kp[1]
            };
        }
    }
    return null;
}

// Example: Get index finger tip (keypoint 8)
function getIndexFingerTip(handIndex = 0) {
    return getKeypoint(handIndex, 8);
}

// Example: Get thumb tip (keypoint 4)
function getThumbTip(handIndex = 0) {
    return getKeypoint(handIndex, 4);
}

// Handle window resize
window.addEventListener('resize', () => {
    // Maintain aspect ratio
    const container = document.getElementById('container');
    const aspectRatio = videoWidth / videoHeight;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    
    let newWidth = maxWidth;
    let newHeight = newWidth / aspectRatio;
    
    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
    }
    
    container.style.width = newWidth + 'px';
    container.style.height = newHeight + 'px';
});

// Initialize
initVideo();

// Note: The animation loop is started in initHandTracking() after model loads

// Export PNG function - call this from console: exportPNG()
window.exportPNG = function(filename) {
    filename = filename || 'sketch.png';
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
    console.log('PNG exported as ' + filename);
};

// Keyboard shortcut: Press 's' to save PNG
document.addEventListener('keydown', function(e) {
    if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        window.exportPNG();
    }
});`,
    randomContent: `// RANDOM Class ////////////////////////////////////////////////////////////
class Random {
    constructor(seed) {
        this.seed = seed || Math.random().toString(16).substr(2, 32).padEnd(32, '0') +
                          Math.random().toString(16).substr(2, 32).padEnd(32, '0');
        this.useA = false;
        let sfc32 = function(uint128Hex) {
            let a = parseInt(uint128Hex.substr(0, 8), 16);
            let b = parseInt(uint128Hex.substr(8, 8), 16);
            let c = parseInt(uint128Hex.substr(16, 8), 16);
            let d = parseInt(uint128Hex.substr(24, 8), 16);
            return function() {
                a |= 0; b |= 0; c |= 0; d |= 0;
                let t = (((a + b) | 0) + d) | 0;
                d = (d + 1) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
            };
        };
        this.prngA = new sfc32(this.seed.substr(0, 32));
        this.prngB = new sfc32(this.seed.substr(32, 32));
        for (let i = 0; i < 1e6; i += 2) {
            this.prngA();
            this.prngB();
        }
    }

    random_dec() {
        this.useA = !this.useA;
        return this.useA ? this.prngA() : this.prngB();
    }

    random_num(a, b) {
        return a + (b - a) * this.random_dec();
    }

    random_int(a, b) {
        return Math.floor(this.random_num(a, b + 1));
    }

    random_bool(p) {
        return this.random_dec() < p;
    }

    random_choice(list) {
        return list[this.random_int(0, list.length - 1)];
    }
}

// Global random instance
var R = new Random();`
}

// Build script template - shared across all project types
export const buildScriptContent = `#!/usr/bin/env node
// build.js - Bundle project into single HTML file
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

async function build() {
    console.log('Building single-file bundle...');

    const templateType = detectTemplateType();
    console.log('Detected template type:', templateType);

    // Read source files
    const html = fs.readFileSync('index.html', 'utf8');
    const sketch = fs.readFileSync('scripts/sketch.js', 'utf8');
    const random = fs.readFileSync('scripts/random.js', 'utf8');

    // Read library based on template type
    let library = '';
    let libraryFile = '';

    switch (templateType) {
        case 'default':
            libraryFile = 'scripts/p5.js';
            if (fs.existsSync(libraryFile)) {
                library = fs.readFileSync(libraryFile, 'utf8');
            }
            break;
        case 'svg':
            libraryFile = 'scripts/paper-full.js';
            if (fs.existsSync(libraryFile)) {
                library = fs.readFileSync(libraryFile, 'utf8');
            }
            break;
        case 'three':
            libraryFile = 'scripts/three.module.js';
            if (fs.existsSync(libraryFile)) {
                library = fs.readFileSync(libraryFile, 'utf8');
            }
            break;
        case 'glsl':
            // No library needed - uses native WebGL
            break;
        case 'ml5-hand':
            console.warn('\\n⚠️  Warning: ML5 template requires internet for AI models.');
            console.warn('   The bundled file will keep the CDN reference to ml5.js.\\n');
            break;
    }

    // Minify JavaScript
    let minifiedLibrary = '';
    if (library) {
        try {
            const result = await minify(library, {
                compress: true,
                mangle: true,
                format: { comments: false }
            });
            minifiedLibrary = result.code;
        } catch (e) {
            console.warn('Could not minify library, using original:', e.message);
            minifiedLibrary = library;
        }
    }

    let minifiedSketch = sketch;
    let minifiedRandom = random;

    try {
        // For Three.js, transform ES6 imports before minifying
        let sketchToMinify = sketch;
        if (templateType === 'three') {
            sketchToMinify = transformThreeJsSketch(sketch);
        }

        const sketchResult = await minify(sketchToMinify, {
            compress: true,
            mangle: true,
            format: { comments: false }
        });
        minifiedSketch = sketchResult.code;
    } catch (e) {
        console.warn('Could not minify sketch.js, using original:', e.message);
        if (templateType === 'three') {
            minifiedSketch = transformThreeJsSketch(sketch);
        }
    }

    try {
        const randomResult = await minify(random, {
            compress: true,
            mangle: true,
            format: { comments: false }
        });
        minifiedRandom = randomResult.code;
    } catch (e) {
        console.warn('Could not minify random.js, using original:', e.message);
    }

    // Build the single HTML file
    const bundledHtml = buildHtml(html, {
        library: minifiedLibrary,
        sketch: minifiedSketch,
        random: minifiedRandom,
        templateType
    });

    // Write output
    fs.mkdirSync('dist', { recursive: true });
    fs.writeFileSync('dist/bundle.html', bundledHtml);

    const originalSize = Buffer.byteLength(html, 'utf8') +
                         Buffer.byteLength(sketch, 'utf8') +
                         Buffer.byteLength(random, 'utf8') +
                         Buffer.byteLength(library, 'utf8');
    const bundleSize = fs.statSync('dist/bundle.html').size;

    console.log('\\n✓ Bundle created: dist/bundle.html');
    console.log('  Original size: ' + (originalSize / 1024).toFixed(1) + ' KB');
    console.log('  Bundle size:   ' + (bundleSize / 1024).toFixed(1) + ' KB');
    console.log('\\nOpen dist/bundle.html in any browser - no server needed!');
}

function detectTemplateType() {
    const html = fs.readFileSync('index.html', 'utf8');
    if (html.includes('three.module.js') || html.includes('importmap')) return 'three';
    if (html.includes('paper-full.js')) return 'svg';
    if (html.includes('ml5')) return 'ml5-hand';
    if (html.includes('p5.js')) return 'default';
    // GLSL uses WebGL directly
    if (html.includes('webgl') || html.includes('WebGL') || html.includes('gl.createShader')) return 'glsl';
    // Check sketch.js for WebGL patterns
    const sketch = fs.readFileSync('scripts/sketch.js', 'utf8');
    if (sketch.includes('getContext(\\'webgl\\')') || sketch.includes('gl.createShader')) return 'glsl';
    return 'default';
}

function transformThreeJsSketch(sketch) {
    // Remove ES6 import statement
    let transformed = sketch.replace(/import\\s+\\*\\s+as\\s+THREE\\s+from\\s+['\"]three['\"];?\\n?/g, '');
    transformed = transformed.replace(/import\\s+\\{[^}]+\\}\\s+from\\s+['\"]three['\"];?\\n?/g, '');
    return transformed;
}

function buildHtml(originalHtml, options) {
    const { library, sketch, random, templateType } = options;

    // Extract the style content
    const styleMatch = originalHtml.match(/<style>([\\s\\S]*?)<\\/style>/);
    const styles = styleMatch ? styleMatch[1] : '';

    // Extract title
    const titleMatch = originalHtml.match(/<title>([^<]*)<\\/title>/);
    const title = titleMatch ? titleMatch[1] : 'Generative Sketch';

    // Build based on template type
    if (templateType === 'three') {
        // Three.js needs special handling - wrap library as IIFE
        const wrappedLibrary = wrapThreeJsAsGlobal(library);
        return \`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>\${title}</title>
    <style>\${styles}</style>
</head>
<body>
    <script>\${wrappedLibrary}</script>
    <script>\${random}</script>
    <script>\${sketch}</script>
</body>
</html>\`;
    }

    if (templateType === 'ml5-hand') {
        // Keep CDN reference for ML5
        return \`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>\${title}</title>
    <style>\${styles}</style>
</head>
<body>
    <div id="container">
        <video id="video" autoplay playsinline></video>
        <canvas id="canvas"></canvas>
        <div id="status">Initializing...</div>
    </div>
    <script src="https://unpkg.com/ml5@1/dist/ml5.min.js"></script>
    <script>\${random}</script>
    <script>\${sketch}</script>
</body>
</html>\`;
    }

    if (templateType === 'svg') {
        // Paper.js template
        return \`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>\${title}</title>
    <style>\${styles}</style>
</head>
<body>
    <canvas id="canvas" resize></canvas>
    <script>\${library}</script>
    <script>\${random}</script>
    <script>\${sketch}</script>
</body>
</html>\`;
    }

    if (templateType === 'glsl') {
        // GLSL template - no library
        return \`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>\${title}</title>
    <style>\${styles}</style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>\${random}</script>
    <script>\${sketch}</script>
</body>
</html>\`;
    }

    // Default p5.js template
    return \`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>\${title}</title>
    <style>\${styles}</style>
</head>
<body>
    <script>\${library}</script>
    <script>\${random}</script>
    <script>\${sketch}</script>
</body>
</html>\`;
}

function wrapThreeJsAsGlobal(threeCode) {
    // Wrap Three.js module code to expose THREE as global
    // The three.module.js exports everything, we capture it
    return \`(function() {
    var exports = {};
    var module = { exports: exports };
    (function(exports, module) {
        \${threeCode}
    })(exports, module);
    window.THREE = exports.THREE || exports;
    // Also expose common exports directly
    if (exports.Scene) window.THREE = exports;
})();\`;
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
`;
