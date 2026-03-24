output "api_gateway_endpoint" {
  description = "The endpoint URL for the API Gateway"
  value       = module.apigateway.api_endpoint
}

output "frontend_s3_bucket" {
  description = "The S3 bucket for the frontend"
  value       = module.s3.frontend_bucket_name
}

output "images_s3_bucket" {
  description = "The S3 bucket for images"
  value       = module.s3.images_bucket_name
}

output "frontend_website_url" {
  description = "Website url"
  value = module.s3.frontend_website_url
}

output "dynamodb_table_name" {
  description = "The name of the DynamoDB table"
  value       = module.dynamodb.table_name
}
