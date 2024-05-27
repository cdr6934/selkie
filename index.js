#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

        // Create index.html
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>p5.js Sketch</title>
    <script src="scripts/p5.js"></script>
    <script src="scripts/sketch.js"></script>
</head>
<body>
</body>
</html>
        `;
        await fs.writeFile(path.join(folderPath, 'index.html'), htmlContent.trim());

        // Ensure p5 is installed
        console.log('Installing p5...');
        execSync('npm install p5');

        // Check if p5.min.js exists and copy it to the scripts folder
        const p5Path = path.join(__dirname, 'node_modules', 'p5', 'lib', 'p5.min.js');
        if (await fs.pathExists(p5Path)) {
            await fs.copyFile(p5Path, path.join(scriptsPath, 'p5.js'));
            console.log('p5.js copied successfully.');
        } else {
            throw new Error(`p5.min.js not found at ${p5Path}`);
        }

        // Create sketch.js
        const sketchContent = `
function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);
}
        `;
        await fs.writeFile(path.join(scriptsPath, 'sketch.js'), sketchContent.trim());

        console.log(`Project ${folderName} created successfully.`);
    } catch (error) {
        console.error('Error creating project:', error);
    }
}

// Execute the function
createProject();
