#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { exec, execSync } from 'child_process';
import { template as defaultTemplate, svgTemplate, threeTemplate, glslTemplate, ml5HandTrackingTemplate, buildScriptContent } from './templates/templates.js';
import { packageJsonContent, svgPackageJsonContent, threePackageJsonContent, glslPackageJsonContent, ml5HandTrackingPackageJsonContent } from './package_details.js';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize commander
const program = new Command();
program
    .version('1.0.0')
    .option('-t, --template <type>', 'specify the template type')
    .parse(process.argv);

const options = program.opts();



// Function to create the project
async function createProject() {
    // Prompt the user for the folder name
    const { folderName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'folderName',
            message: 'Enter the name of the new folder:',
        },

    ]);

    // Construct the paths
    const folderPath = path.join(process.cwd(), folderName);
    const scriptsPath = path.join(folderPath, 'scripts');

    try {
        // Create folders
        await fs.ensureDir(scriptsPath);

        // Choose the template
        let htmlContent, sketchContent, randomContent, selectedPackageJson;
        let templateType = options.template || 'default';

        if (templateType === 'default') {
            htmlContent = defaultTemplate.htmlContent;
            sketchContent = defaultTemplate.sketchContent;
            randomContent = defaultTemplate.randomContent;
            selectedPackageJson = packageJsonContent;
        } else if (templateType === 'svg') {
            htmlContent = svgTemplate.htmlContent;
            sketchContent = svgTemplate.sketchContent;
            randomContent = svgTemplate.randomContent;
            selectedPackageJson = svgPackageJsonContent;
        } else if (templateType === 'three') {
            htmlContent = threeTemplate.htmlContent;
            sketchContent = threeTemplate.sketchContent;
            randomContent = threeTemplate.randomContent;
            selectedPackageJson = threePackageJsonContent;
        } else if (templateType === 'glsl') {
            htmlContent = glslTemplate.htmlContent;
            sketchContent = glslTemplate.sketchContent;
            randomContent = glslTemplate.randomContent;
            selectedPackageJson = glslPackageJsonContent;
        } else if (templateType === 'ml5-hand') {
            htmlContent = ml5HandTrackingTemplate.htmlContent;
            sketchContent = ml5HandTrackingTemplate.sketchContent;
            randomContent = ml5HandTrackingTemplate.randomContent;
            selectedPackageJson = ml5HandTrackingPackageJsonContent;
        } else {
            throw new Error('Unknown template type. Available templates: default, svg, three, glsl, ml5-hand');
        }

        // Create index.html
        await fs.writeFile(path.join(folderPath, 'index.html'), htmlContent.trim());

        // Create package.json
        const packageJsonPath = path.join(folderPath, 'package.json');
        const packageJson = selectedPackageJson.replace(/"project-name"/, `"${folderName}"`);
        await fs.writeFile(packageJsonPath, packageJson.trim());

        // Install dependencies
        console.log('Installing dependencies...');
        execSync('npm install -s', { cwd: folderPath, stdio: 'inherit' });

        // Copy the appropriate library to the scripts folder
        if (templateType === 'svg') {
            // Copy paper.js for SVG template
            const paperPath = path.join(__dirname, 'node_modules', 'paper', 'dist', 'paper-full.js');
            if (await fs.pathExists(paperPath)) {
                await fs.copyFile(paperPath, path.join(scriptsPath, 'paper-full.js'));
                console.log('paper.js copied successfully.');
            } else {
                throw new Error(`paper-full.js not found at ${paperPath}`);
            }
        } else if (templateType === 'three') {
            // Copy three.js module for Three.js template
            const threePath = path.join(__dirname, 'node_modules', 'three', 'build', 'three.module.js');
            if (await fs.pathExists(threePath)) {
                await fs.copyFile(threePath, path.join(scriptsPath, 'three.module.js'));
                console.log('three.js copied successfully.');
            } else {
                throw new Error(`three.module.js not found at ${threePath}`);
            }
        } else if (templateType === 'glsl') {
            // GLSL template uses native WebGL, no external library needed
            console.log('GLSL template - using native WebGL (no library needed).');
        } else if (templateType === 'ml5-hand') {
            // ML5 template uses CDN, no local library needed
            console.log('ML5 hand tracking template - using ml5.js from CDN.');
        } else {
            // Copy p5.js for default template
            const p5Path = path.join(__dirname, 'node_modules', 'p5', 'lib', 'p5.min.js');
            if (await fs.pathExists(p5Path)) {
                await fs.copyFile(p5Path, path.join(scriptsPath, 'p5.js'));
                console.log('p5.js copied successfully.');
            } else {
                throw new Error(`p5.min.js not found at ${p5Path}`);
            }
        }

        // Create sketch.js
        await fs.writeFile(path.join(scriptsPath, 'sketch.js'), sketchContent.trim());

        // Create random.js
        await fs.writeFile(path.join(scriptsPath, 'random.js'), randomContent.trim());

        // Create index.html
        await fs.writeFile(path.join(folderPath, 'index.html'), htmlContent.trim());

        // Create build.js for single-file bundling
        await fs.writeFile(path.join(folderPath, 'build.js'), buildScriptContent.trim());
        console.log('build.js created - run "npm run build" to create a single-file bundle.');

        console.log(`Project ${folderName} created successfully.`);

        // Ask if the user wants to start the development server
        const { startServer } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'startServer',
                message: 'Do you want to start the development server?',
                default: true,
            },
        ]);
        
        if (startServer) {
            console.log('Starting development server...');
            execSync('npm start', { cwd: folderPath, stdio: 'inherit' });
        }
    } catch (error) {
        console.error('Error creating project:', error);
    }
}

// Execute the function
createProject();
