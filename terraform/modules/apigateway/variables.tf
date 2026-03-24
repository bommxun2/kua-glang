variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., prod, dev)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for VPC Link"
  type        = string
}

variable "private_subnet_ids" {
  description = "Subnets for VPC Link"
  type        = list(string)
}

variable "alb_arn" {
  description = "ARN of the ALB"
  type        = string
}

variable "alb_sg_id" {
  description = "Security Group ID of the ALB"
  type        = string
}
