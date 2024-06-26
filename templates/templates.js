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
