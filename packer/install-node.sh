#!/bin/bash
set -e

AWS_REGION=${1:-"us-east-1"}
ECR_REPO_URL=${2:-"<YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/backend"}
IMAGE_TAG=${3:-"latest"}
CONTAINER_PORT=${4:-"3000"}
HOST_PORT=3000

echo "Updating system packages"
sudo yum update -y

echo "Installing Docker"
sudo yum install -y docker

echo "Starting Docker service"
sudo systemctl enable docker
sudo systemctl start docker

echo "Setting up Docker permissions for ec2-user"
sudo usermod -aG docker ec2-user

echo "Installing AWS CLI"
if ! command -v aws &> /dev/null; then
    echo "AWS CLI not found. Installing"
    sudo yum install -y aws-cli
else
    echo "AWS CLI is already installed."
fi

echo "Authenticating Docker with Amazon ECR..."
aws ecr get-login-password --region "$AWS_REGION" | sudo docker login --username AWS --password-stdin "$ECR_REPO_URL"

echo "Pulling Docker image from ECR..."
sudo docker pull "$ECR_REPO_URL:$IMAGE_TAG"

echo "Running Docker container..."
# Stop and remove any existing container with the same name to allow for smooth redeployments
sudo docker stop backend-server || true
sudo docker rm backend-server || true

# Run the container in detached mode (-d), mapped to port 80, restarting automatically if it crashes
sudo docker run -d \
  --name backend-server \
  --restart unless-stopped \
  -p "$HOST_PORT":"$CONTAINER_PORT" \
  -e NODE_ENV=production \
  "$ECR_REPO_URL:$IMAGE_TAG"

echo "The Node.js server is running on port $HOST_PORT."