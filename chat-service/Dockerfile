# --------------------------------------------------
# STAGE 1: DEVELOPMENT
# --------------------------------------------------
  FROM node:14-alpine AS development

  WORKDIR /app
  
  # Copy package.json & package-lock.json (jika ada)
  COPY package*.json ./
  
  # Install dependencies (termasuk devDependencies)
  RUN npm install
  
  # Copy seluruh source code
  COPY . .
  
  # Expose port untuk development
  EXPOSE 4001
  
  # Jalankan script dev (misalnya: "dev": "nodemon index.js")
  # CMD ["npm", "run", "dev"]
  
  
# --------------------------------------------------
# STAGE 2: BUILD
# --------------------------------------------------
FROM node:14-alpine AS build

WORKDIR /app

# Copy package.json & package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies (termasuk devDependencies)
RUN npm install

# Copy seluruh source code
COPY . .

# Run the build script to compile TypeScript files
RUN npm run build


# --------------------------------------------------
# STAGE 3: PRODUCTION
# --------------------------------------------------
FROM node:14-alpine AS production

WORKDIR /app

# Copy package.json & package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --production

# Copy the built files from the build stage
COPY --from=build /app/dist ./dist

# Copy other necessary files (e.g., configuration files)
COPY . .

# Expose port
EXPOSE 4001

# Perintah untuk menjalankan aplikasi di production
CMD ["npm", "run", "start"]