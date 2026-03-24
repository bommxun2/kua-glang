variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., prod, dev)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID for EC2 instances (e.g. Amazon Linux 2 or ECS optimized)"
  type        = string
}

variable "alb_target_group_arn" {
  description = "Application load balancer target group arn"
  type = string
}

variable "alb_sg_id" {
  description = "Application load balancer security group id"
  type = string
}