import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const GlootiePlugin = async ({ project, client, $, directory, worktree }) => {
  const pluginRoot = __dirname;
  const projectDir = directory;

  const getStartContext = () => {
    try {
      let outputs = [];

      const startMdPath = path.join(pluginRoot, 'start.md');
      if (fs.existsSync(startMdPath)) {
        const startMdContent = fs.readFileSync(startMdPath, 'utf-8');
        outputs.push(`=== start.md ===\n${startMdContent}`);
      }

      try {
        const thornsPath = path.join(pluginRoot, 'node_modules', 'mcp-thorns', 'index.js');
        if (fs.existsSync(thornsPath)) {
          const thornOutput = execSync(`node ${thornsPath}`, {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: projectDir,
            timeout: 180000,
            killSignal: 'SIGTERM'
          });
          outputs.push(`=== mcp-thorns ===\n${thornOutput}`);
        }
      } catch (e) {
        if (e.killed && e.signal === 'SIGTERM') {
          outputs.push(`=== mcp-thorns ===\nSkipped (3min timeout)`);
        } else {
          outputs.push(`=== mcp-thorns ===\nSkipped (error: ${e.message.split('\n')[0]})`);
        }
      }

      try {
        const wfgyPath = path.join(pluginRoot, 'node_modules', 'wfgy', 'index.js');
        if (fs.existsSync(wfgyPath)) {
          const wfgyOutput = execSync(`node ${wfgyPath} hook`, {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: projectDir,
            timeout: 180000,
            killSignal: 'SIGTERM'
          });
          outputs.push(`=== wfgy hook ===\n${wfgyOutput}`);
        }
      } catch (e) {
        if (e.killed && e.signal === 'SIGTERM') {
          outputs.push(`=== wfgy hook ===\nSkipped (3min timeout)`);
        } else {
          outputs.push(`=== wfgy hook ===\nSkipped (error: ${e.message.split('\n')[0]})`);
        }
      }

      return outputs.join('\n\n');
    } catch (error) {
      return `Error getting start context: ${error.message}`;
    }
  };

  const checkStopConditions = () => {
    let aborted = false;
    let blockReasons = [];

    try {
      const ahead = execSync('git rev-list --count origin/HEAD..HEAD', {
        encoding: 'utf-8',
        cwd: projectDir,
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 2000
      }).trim();

      if (parseInt(ahead) > 0) {
        blockReasons.push(`Git: ${ahead} commit(s) ahead of origin/HEAD, must push to remote`);
      }
    } catch (e) {
    }

    try {
      const behind = execSync('git rev-list --count HEAD..origin/HEAD', {
        encoding: 'utf-8',
        cwd: projectDir,
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 2000
      }).trim();

      if (parseInt(behind) > 0) {
        blockReasons.push(`Git: ${behind} commit(s) behind origin/HEAD, must merge from remote`);
      }
    } catch (e) {
    }

    if (blockReasons.length > 0) {
      return {
        block: true,
        reason: blockReasons.join(' | ')
      };
    }

    const filesToRun = [];

    const evalJsPath = path.join(projectDir, 'eval.js');
    if (fs.existsSync(evalJsPath)) {
      filesToRun.push('eval.js');
    }

    const evalsDir = path.join(projectDir, 'evals');
    if (fs.existsSync(evalsDir) && fs.statSync(evalsDir).isDirectory()) {
      const files = fs.readdirSync(evalsDir).filter(f => {
        const fullPath = path.join(evalsDir, f);
        return f.endsWith('.js') && fs.statSync(fullPath).isFile() && !fullPath.includes('/lib/');
      }).sort();
      filesToRun.push(...files.map(f => path.join('evals', f)));
    }

    for (const file of filesToRun) {
      if (aborted) return { block: false };

      try {
        execSync(`node ${file}`, {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
          cwd: projectDir,
          timeout: 60000,
          killSignal: 'SIGTERM'
        });
      } catch (e) {
        if (aborted) return { block: false };

        const errorOutput = e.stdout || '';
        const errorStderr = e.stderr || '';
        const signal = e.signal || 'none';
        const killed = e.killed || false;

        if (signal === 'SIGTERM' && killed) {
          return { block: false };
        }

        const fullError = `Error: ${e.message}\nSignal: ${signal}\nKilled: ${killed}\n\nStdout:\n${errorOutput}\n\nStderr:\n${errorStderr}`;
        return {
          block: true,
          reason: `The following errors were reported: ${fullError}`
        };
      }
    }

    return { block: false };
  };

  return {
    'session.created': async ({ event }) => {
      const context = getStartContext();
      console.log('Glootie session started with context');
    },
    
    'session.idle': async ({ event }) => {
      const stopCheck = checkStopConditions();
      if (stopCheck.block) {
        console.log(`Glootie session blocked: ${stopCheck.reason}`);
      }
    },

    'tool.execute.before': async (input, output) => {
      if (input.tool === 'read' && output.args.filePath && output.args.filePath.includes('.env')) {
        throw new Error('Do not read .env files');
      }
    },


          return 'No start.md found';
        },
      }),

      run_eval: tool({
        description: "Run eval.js or evals directory tests",
        args: {
          file: tool.schema.string().optional().describe("Specific eval file to run, or 'all' for all evals")
        },
        async execute(args, ctx) => {
          const projectDir = directory;
          const filesToRun = [];

          if (!args.file || args.file === 'all') {
            const evalJsPath = path.join(projectDir, 'eval.js');
            if (fs.existsSync(evalJsPath)) {
              filesToRun.push('eval.js');
            }

            const evalsDir = path.join(projectDir, 'evals');
            if (fs.existsSync(evalsDir) && fs.statSync(evalsDir).isDirectory()) {
              const files = fs.readdirSync(evalsDir).filter(f => {
                const fullPath = path.join(evalsDir, f);
                return f.endsWith('.js') && fs.statSync(fullPath).isFile() && !fullPath.includes('/lib/');
              }).sort();
              filesToRun.push(...files.map(f => path.join('evals', f)));
            }
          } else {
            filesToRun.push(args.file);
          }

          const results = [];
          for (const file of filesToRun) {
            try {
              const output = execSync(`node ${file}`, {
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe'],
                cwd: projectDir,
                timeout: 60000,
                killSignal: 'SIGTERM'
              });
              results.push(`${file}: SUCCESS\n${output}`);
            } catch (e) {
              const errorOutput = e.stdout || '';
              const errorStderr = e.stderr || '';
              results.push(`${file}: FAILED\n${e.message}\nStdout:\n${errorOutput}\nStderr:\n${errorStderr}`);
            }
          }

          return results.join('\n\n');
        },
      }),

      git_status: tool({
        description: "Check git status for commits ahead/behind origin",
        args: {},
        async execute(args, ctx) {
          const projectDir = directory;
          const status = {};

          try {
            const ahead = execSync('git rev-list --count origin/HEAD..HEAD', {
              encoding: 'utf-8',
              cwd: projectDir,
              stdio: ['pipe', 'pipe', 'pipe'],
              timeout: 2000
            }).trim();
            status.ahead = parseInt(ahead) || 0;
          } catch (e) {
            status.ahead_error = e.message;
          }

          try {
            const behind = execSync('git rev-list --count HEAD..origin/HEAD', {
              encoding: 'utf-8',
              cwd: projectDir,
              stdio: ['pipe', 'pipe', 'pipe'],
              timeout: 2000
            }).trim();
            status.behind = parseInt(behind) || 0;
          } catch (e) {
            status.behind_error = e.message;
          }

          return status;
        },
      })
    }
  };
};