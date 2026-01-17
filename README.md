# Selkie

In Celtic mythology, selkies are beings that can transform from seals into humans by shedding their seal skins. They often feature in stories of love and longing, where a selkie's human form is hidden away or discovered by a human.

A CLI tool for scaffolding generative art projects. Quickly create projects with p5.js, Paper.js, Three.js, WebGL/GLSL shaders, or ML5.js hand tracking.

## Installation

```bash
npm install selkie
```

## Usage

Create a new project with one of the available templates:

```bash
selkie -t default     # p5.js canvas project
selkie -t svg         # Paper.js vector/SVG project
selkie -t three       # Three.js 3D project
selkie -t glsl        # WebGL shader project
selkie -t ml5-hand    # ML5.js hand tracking project
```

You'll be prompted for a folder name, then the project will be created with all dependencies installed.

## Working on Your Sketch

Each generated project includes a dev server:

```bash
cd your-project
npm start             # Opens in browser with live reload
```

Edit `scripts/sketch.js` to create your generative art. Press 's' to export PNG/SVG (depending on template).

## Building a Single-File Bundle

When you're ready to share your sketch, build it into a single HTML file that works offline on any device:

```bash
npm run build
```

This creates `dist/bundle.html` - a minified, self-contained file you can:
- Open directly in any browser (no server needed)
- Share via email, USB, or any file transfer
- Upload to any static hosting

**Note:** The ML5 hand tracking template still requires internet for AI models.

## Templates

| Template | Library | Output | Notes |
|----------|---------|--------|-------|
| `default` | p5.js | Canvas/PNG | Classic creative coding |
| `svg` | Paper.js | SVG vectors | Perfect for plotters |
| `three` | Three.js | WebGL 3D | 3D graphics |
| `glsl` | Native WebGL | Shaders | Smallest bundle (~5KB) |
| `ml5-hand` | ML5.js | Hand tracking | Requires webcam + internet |

All templates include a seeded random number generator for deterministic/reproducible outputs.

