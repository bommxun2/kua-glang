variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., prod, dev)"
  type        = string
}

variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
  default     = "main-table"
}

variable "hash_key" {
  description = "Hash key for the table"
  type        = string
  default     = "id"
}
