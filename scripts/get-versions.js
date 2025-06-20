import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = resolve(__dirname, '../package.json');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const frontendVersion = packageJson.dependencies['@acamae/frontend'].replace('^', '');
const backendVersion = packageJson.dependencies['@acamae/backend'].replace('^', '');

function updateEnvFile(envPath) {
  let content = '';

  // Leer contenido existente si el archivo existe
  if (existsSync(envPath)) {
    content = readFileSync(envPath, 'utf8');
  }

  // Función para actualizar o añadir una variable manteniendo el formato
  const updateOrAddVariable = (name, value) => {
    const regex = new RegExp(`^${name}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${name}=${value}`);
    } else {
      // Añadir al final solo si existe contenido previo
      const trimmed = content.trim();
      content = trimmed ? `${trimmed}\n${name}=${value}` : `${name}=${value}`;
    }
  };

  // Actualizar o añadir las versiones
  updateOrAddVariable('FRONTEND_VERSION', `${frontendVersion}`);
  updateOrAddVariable('BACKEND_VERSION', `${backendVersion}`);

  // Quitar saltos de línea finales y añadir uno solo
  const normalized = content.replace(/\n+$/, '');
  writeFileSync(envPath, `${normalized}\n`);
}

// Actualizar ambos archivos .env
updateEnvFile(resolve(__dirname, '../.env.development'));
updateEnvFile(resolve(__dirname, '../.env.production'));

console.log('Archivos .env actualizados con las versiones correctas');
