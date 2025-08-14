#!/usr/bin/env node

/**
 * Workspace Launch Script
 * Initializes the development environment with proper validation
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class WorkspaceLauncher {
  constructor() {
    this.workspaceRoot = path.resolve(__dirname, '..');
    this.processes = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async validateWorkspace() {
    this.log('Validating workspace configuration...');

    // Check required directories
    const requiredDirs = [
      'apps/admin-web',
      'apps/student-app',
      'functions',
      'packages/shared',
      'packages/firebase-config',
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(this.workspaceRoot, dir);
      if (!fs.existsSync(dirPath)) {
        throw new Error(`Required directory not found: ${dir}`);
      }
    }

    // Check required files
    const requiredFiles = [
      'package.json',
      'firebase.json',
      'firestore.rules',
      '.vscode/settings.json',
      '.vscode/tasks.json',
      '.vscode/launch.json',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.workspaceRoot, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file not found: ${file}`);
      }
    }

    this.log('Workspace validation completed successfully');
  }

  async installDependencies() {
    this.log('Installing dependencies...');

    const installDirs = [
      '.',
      'apps/admin-web',
      'functions',
      'packages/shared',
      'packages/firebase-config',
    ];

    for (const dir of installDirs) {
      const cwd = path.join(this.workspaceRoot, dir);
      const packageJsonPath = path.join(cwd, 'package.json');

      if (fs.existsSync(packageJsonPath)) {
        this.log(`Installing dependencies in ${dir}...`);
        await this.runCommand('npm', ['install'], { cwd });
      }
    }

    this.log('Dependencies installation completed');
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'inherit',
        cwd: this.workspaceRoot,
        ...options,
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`));
        }
      });

      child.on('error', reject);
    });
  }

  async startDevelopmentServers() {
    this.log('Starting development servers...');

    // Start Firebase Emulators
    this.log('Starting Firebase Emulators...');
    const firebaseProcess = spawn('npm', ['run', 'emulators'], {
      stdio: 'inherit',
      cwd: this.workspaceRoot,
      detached: true,
    });
    this.processes.push(firebaseProcess);

    // Wait a bit for emulators to start
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Start Admin Web (Next.js)
    this.log('Starting Admin Web server...');
    const adminWebProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      cwd: path.join(this.workspaceRoot, 'apps/admin-web'),
      detached: true,
    });
    this.processes.push(adminWebProcess);

    this.log('Development servers started successfully');
    this.log('Admin Web: http://localhost:3000');
    this.log('Firebase Emulator UI: http://localhost:4000');
  }

  async cleanup() {
    this.log('Cleaning up processes...');

    for (const process of this.processes) {
      if (process && !process.killed) {
        process.kill('SIGTERM');
      }
    }
  }

  async launch() {
    try {
      this.log('🚀 Launching Kaisei ID Card Workspace...');

      await this.validateWorkspace();
      await this.installDependencies();
      await this.startDevelopmentServers();

      this.log('🎉 Workspace launched successfully!');
      this.log('Press Ctrl+C to stop all servers');

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        this.log('Shutting down workspace...');
        await this.cleanup();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await this.cleanup();
        process.exit(0);
      });
    } catch (error) {
      this.log(`Failed to launch workspace: ${error.message}`, 'error');
      await this.cleanup();
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const launcher = new WorkspaceLauncher();
  launcher.launch();
}

module.exports = WorkspaceLauncher;

