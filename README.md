# Acamae Main Repository

This repository serves as the main configuration hub for the Acamae project, managing Docker environments, SSL certificates, and environment configurations across different stages of development.

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- OpenSSL (for SSL certificate generation)
- Git

## Project Structure

```
.
├── docker/                 # Docker configuration files
│   ├── nginx/             # Nginx configuration
│   │   └── conf.d/        # Nginx site configurations
│   ├── ssl/               # SSL certificates
│   ├── docker-compose.yml # Development environment
│   └── docker-compose.prod.yml # Production environment
├── scripts/               # Utility scripts
│   ├── get-versions.js    # Version management
│   └── generate-ssl.js    # SSL certificate generation
└── .env.development       # Development environment variables
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/acamae/main.git
cd main
```

2. Install dependencies:

```bash
npm install
```

This will automatically:

- Install all required npm packages
- Generate SSL certificates for local development
- Set up environment variables

## Environment Configuration

The project uses different environment configurations for development and production:

- `.env.development`: Development environment variables
- `.env.production`: Production environment variables

These files are managed by the `get-versions.js` script, which:

- Reads package versions from `package.json`
- Updates environment files with correct versions
- Maintains consistency across environments

## SSL Certificates

The project uses self-signed SSL certificates for local development. These certificates are automatically generated during the installation process using the `generate-ssl` script.

### Certificate Generation

The certificates are generated in the `docker/ssl` directory and include:

- `selfsigned.crt`: The SSL certificate
- `selfsigned.key`: The private key

The generation process is handled automatically by the `postinstall` script, but you can also generate them manually:

```bash
npm run generate-ssl
```

### Requirements

The certificate generation requires OpenSSL to be installed on your system:

- **Windows**: Download and install from [OpenSSL for Windows](https://slproweb.com/products/Win32OpenSSL.html)
- **macOS**: Install using Homebrew: `brew install openssl`
- **Linux**: Install using your package manager: `sudo apt-get install openssl`

### Production Environment

For production environments, you should:

1. Replace the self-signed certificates with proper SSL certificates from a trusted Certificate Authority
2. Update the Nginx configuration to use your production certificates
3. Ensure proper security measures are in place

## Development

Start the development environment:

```bash
npm run start
```

This will:

1. Generate/update environment variables
2. Start all Docker containers
3. Make the application available at:
   - Frontend: https://localhost
   - Backend API: https://localhost/api
   - PHPMyAdmin: https://localhost/phpmyadmin

## Available Scripts

- `npm run start`: Start development environment
- `npm run start:prod`: Start production environment
- `npm run stop`: Stop development environment
- `npm run stop:prod`: Stop production environment
- `npm run logs`: View development logs
- `npm run logs:prod`: View production logs
- `npm run generate-ssl`: Generate SSL certificates manually

## Security Considerations

1. **SSL Certificates**:

   - Development: Self-signed certificates are used
   - Production: Must use certificates from a trusted CA

2. **Environment Variables**:

   - Sensitive data should be stored in `.env` files
   - `.env` files should never be committed to version control
   - Use `.env.example` as a template

3. **Docker Security**:
   - Containers run with minimal privileges
   - Network isolation between services
   - Read-only volumes where possible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues**:

   - Ensure OpenSSL is installed
   - Check certificate permissions
   - Verify Nginx configuration

2. **Docker Issues**:

   - Check container logs: `npm run logs`
   - Verify port availability
   - Check Docker daemon status

3. **Environment Issues**:
   - Verify `.env` file existence
   - Check variable values
   - Ensure correct NODE_ENV

## Git Flow & Release Process

This repository follows a **simplified Git Flow** strategy:

```
feature/*   →  main  →  release  →  main
```

1. **feature/**: branches for new features or minor fixes.
2. **main**: stable branch; it only receives pull requests from _feature/_.
3. **release**: protected branch used exclusively for versioning and publishing.
   - When _main_ is merged into _release_, the **Release** workflow is triggered.
   - The workflow performs the following steps:
     1. `npm run build` to ensure the codebase compiles.
     2. `lerna version` → bumps package versions, updates _package.json_ and _package-lock.json_, and generates the _CHANGELOG.md_.
     3. Creates an automatic commit `chore(release): x.y.z` and the corresponding Git tag.
     4. `lerna publish` → publishes the **npm** packages to GitHub Packages.
     5. Builds and pushes the **container** images to GHCR:
        - `ghcr.io/acamae/backend:<version>`
        - `ghcr.io/acamae/frontend:<version>`
4. Once the workflow completes, the **release** branch is merged back into **main** to propagate the new version.

> **Note:** All commits on _feature/_ and _main_ must follow the Conventional Commits spec to enable automatic changelog generation.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
