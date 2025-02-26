kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/database.yaml
kubectl apply -f k8s/chat-service.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/haproxy.yaml

kubectl delete -f k8s/secrets.yaml
kubectl delete -f k8s/database.yaml
kubectl delete -f k8s/chat-service.yaml
kubectl delete -f k8s/user-service.yaml
kubectl delete -f k8s/haproxy.yaml


kubectl delete -f k8s
kubectl apply -f k8s

kubectl port-forward svc/haproxy 8408:8408  
kubectl port-forward svc/haproxy 8888:8888  

kubectl config get-contexts
kubectl config current-context
kubectl config use-context minikube

docker images
docker rmi IMG_ID

<!-- user-service % docker build --target production -t user-service:latest .
user-service % docker build --target production -t chat-service:latest . -->

docker build -t user-service:latest .
docker build -t chat-service:latest .

kubectl get pods -l app=haproxy
kubectl logs 


<!-- https://chatgpt.com/c/67bed15e-ddac-8008-b82a-7541f1995cf2?model=o3-mini -->