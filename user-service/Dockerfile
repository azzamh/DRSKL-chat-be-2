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
  EXPOSE 5001
  
  # Jalankan script dev (misalnya: "dev": "nodemon index.js")
  # CMD ["npm", "run", "dev"]
  
  
  # --------------------------------------------------
  # STAGE 2: PRODUCTION
  # --------------------------------------------------
  FROM node:14-alpine AS production
  
  WORKDIR /app
  
  # Copy package.json & package-lock.json (jika ada)
  COPY package*.json ./
  
  # Install dependencies (production only)
  RUN npm install --production
  
  # Copy source code (hanya perlu file yang dibutuhkan di runtime)
  COPY . .
  
  # Expose port
  EXPOSE 5001
  
  # Perintah untuk menjalankan aplikasi di production
  CMD ["npm", "run", "start"]
  