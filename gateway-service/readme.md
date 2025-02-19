Build & Push Image (Gateway)
Di folder gateway/, jalankan:

bash
Copy
# Build dengan target production
docker build --target=production -t your-registry/gateway:latest .

# Push ke registry
docker push your-registry/gateway:latest

