# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Selkie is a CLI tool for scaffolding generative art projects. It creates project templates for various graphics libraries (p5.js, Paper.js, Three.js, WebGL/GLSL, ML5.js).

## Commands

```bash
npm install                    # Install dependencies

# Run CLI locally (prompts for folder name, creates project, optionally starts dev server)
node index.js -t default       # p5.js canvas project
node index.js -t svg           # Paper.js SVG project
node index.js -t three         # Three.js 3D project
node index.js -t glsl          # WebGL shader project
node index.js -t ml5-hand      # ML5.js hand tracking project
```

## Architecture

- `index.js` - CLI entry point (Commander.js + Inquirer). Handles folder creation, template selection, library file copying from node_modules, and optional dev server launch.
- `templates/templates.js` - Template definitions: `template` (p5.js), `svgTemplate`, `threeTemplate`, `glslTemplate`, `ml5HandTrackingTemplate`. Each exports `htmlContent`, `sketchContent`, and `randomContent`.
- `package_details.js` - Package.json templates for each project type.

## Template System

Five templates available via `-t` flag:
- **default**: p5.js canvas-based (copies `p5.min.js` from node_modules)
- **svg**: Paper.js vector graphics with SVG export (copies `paper-full.js`)
- **three**: Three.js 3D with ES modules (copies `three.module.js`)
- **glsl**: Native WebGL shaders (no library copied)
- **ml5-hand**: ML5.js hand tracking via CDN (no library copied)

All templates include a seeded PRNG class (`Random`) using sfc32 algorithm. Templates with canvas export support 's' key to save PNG/SVG.

## Single-File Bundle

Generated projects include `npm run build` which creates `dist/bundle.html` - a single, minified HTML file that works offline without a server. The build script (`build.js`) auto-detects the template type and:
- Inlines and minifies all JavaScript (library, random.js, sketch.js)
- For Three.js: transforms ES6 modules to global scope
- For ML5: keeps CDN reference (requires internet for AI models)

## Adding New Templates

1. Add template object in `templates/templates.js` with `htmlContent`, `sketchContent`, `randomContent`
2. Add package.json template in `package_details.js`
3. Add template case in `index.js` (selection logic and library copying if needed)
4. Update the error message listing available templates
