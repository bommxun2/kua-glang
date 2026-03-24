variable "project_name" {
  description = "Project name"
  type        = string
  default     = "kuaglang"
}

variable "ami_id" {
  description = "AMI ec2 instance"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., prod, dev)"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}
