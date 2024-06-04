#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { exec, execSync } from 'child_process';
import { template as defaultTemplate } from './templates/templates.js';
import { packageJsonContent } from './package_details.js';

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
        let htmlContent, sketchContent, randomContent;
    

        if (options.template === 'default' || !options.template) {
            htmlContent = defaultTemplate.htmlContent;
            sketchContent = defaultTemplate.sketchContent;
            randomContent = defaultTemplate.randomContent;
        } else {
            throw new Error('Unknown template type');
        }

        // Create index.html
        await fs.writeFile(path.join(folderPath, 'index.html'), htmlContent.trim());

        // Create package.json
        const packageJsonPath = path.join(folderPath, 'package.json');
        const packageJson = packageJsonContent.replace(/"project-name"/, `"${folderName}"`);
        await fs.writeFile(packageJsonPath, packageJson.trim());

       // Install dependencies
       console.log('Installing dependencies...');
       execSync('npm install -s', { cwd: folderPath, stdio: 'inherit' });

        // Check if p5.min.js exists and copy it to the scripts folder
        const p5Path = path.join(__dirname, 'node_modules', 'p5', 'lib', 'p5.min.js');
        if (await fs.pathExists(p5Path)) {
            await fs.copyFile(p5Path, path.join(scriptsPath, 'p5.js'));
            console.log('p5.js copied successfully.');
        } else {
            throw new Error(`p5.min.js not found at ${p5Path}`);
        }

        // Create sketch.js
        await fs.writeFile(path.join(scriptsPath, 'sketch.js'), sketchContent.trim());
        

         // Create random.js
         await fs.writeFile(path.join(scriptsPath, 'random.js'), randomContent.trim());
    

        // Create index.html
        await fs.writeFile(path.join(folderPath, 'index.html'), htmlContent.trim());


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
