import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('./index.d.ts').default} */
export default function (options = {}) {
  const { 
    out = '.svelte-kit/platformatic',
    serviceId = 'sveltekit-app',
    includeConfig = true,
    configPath = 'platformatic.sveltekit.json'
  } = options;

  return {
    name: '@sveltejs/adapter-platformatic',

    async adapt(builder) {
      const tmp = builder.getBuildDirectory('adapter-platformatic');
      
      builder.rimraf(out);
      builder.mkdirp(out);

      // Write client-side assets
      const clientDir = `${out}/client`;
      builder.writeClient(clientDir);

      // Write server files to temp
      const serverDir = `${tmp}/server`;
      builder.writeServer(serverDir);

      // Write prerendered pages
      const prerenderedDir = `${out}/prerendered`;
      builder.writePrerendered(prerenderedDir);

      // Generate manifest
      writeFileSync(
        `${out}/manifest.js`,
        `export const manifest = ${builder.generateManifest({ 
          relativePath: './',
          routes: builder.routes 
        })};`
      );

      // Generate handler module
      const handlerTemplate = readFileSync(
        join(__dirname, 'templates', 'handler.js'),
        'utf-8'
      );
      
      writeFileSync(
        `${out}/handler.js`,
        handlerTemplate
          .replace('{{SERVER_DIR}}', `./${resolve(serverDir)}`)
          .replace('{{MANIFEST}}', './manifest.js')
      );

      // Generate Fastify plugin
      const pluginTemplate = readFileSync(
        join(__dirname, 'templates', 'plugin.js'),
        'utf-8'
      );
      
      writeFileSync(
        `${out}/plugin.js`, 
        pluginTemplate
          .replace('{{CLIENT_DIR}}', './client')
          .replace('{{PRERENDERED_DIR}}', './prerendered')
      );

      // Generate platformatic config if requested
      if (includeConfig) {
        const configTemplate = {
          "$schema": "https://schemas.platformatic.dev/sveltekit/1.0.0.json",
          "server": {
            "hostname": "{PLT_SERVER_HOSTNAME}",
            "port": "{PORT}",
            "logger": {
              "level": "{PLT_SERVER_LOGGER_LEVEL}"
            }
          },
          "sveltekit": {
            "buildDir": out
          },
          "plugins": {
            "paths": [{
              "path": `./${out}/plugin.js`
            }]
          }
        };

        writeFileSync(
          join(builder.getServerDirectory(), '..', configPath),
          JSON.stringify(configTemplate, null, 2)
        );
      }

      // Copy server files
      builder.copy(serverDir, `${out}/server`);

      builder.log.success('Platformatic adapter complete');
    },

    supports: {
      read: () => true
    }
  };
}
