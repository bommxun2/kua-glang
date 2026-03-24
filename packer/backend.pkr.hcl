packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "ecr_repo_url" {
  type    = string
}

variable "image_tag" {
  type    = string
}

data "amazon-ami" "amazon-linux" {
  filters = {
    name = "al2023-ami-2023.*-x86_64"
  }
  owners      = ["amazon"]
  most_recent = true
  region      = "us-east-1"
}

source "amazon-ebs" "amazon-linux" {
  ami_name        = "kuaglang-backend-${uuidv4()}"
  ami_description = "Amazon Linux AMI with a Node.js backend docker."
  instance_type   = "t2.micro"
  region          = "us-east-1"
  source_ami      = data.amazon-ami.amazon-linux.id
  ssh_username    = "ec2-user"

  iam_instance_profile = "LabInstanceProfile"
}

build {
  sources = [
    "source.amazon-ebs.amazon-linux"
  ]

  provisioner "file" {
    sources     = ["../backend"] 
    destination = "/tmp/"
  }

  provisioner "shell" {
    script       = "install-node.sh"
    pause_before = "30s"
  }

  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
  }
}
