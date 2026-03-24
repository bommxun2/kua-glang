output "api_gateway_endpoint" {
  description = "The endpoint URL for the API Gateway"
  value       = module.apigateway.api_endpoint
}

output "frontend_s3_bucket" {
  description = "The S3 bucket for the frontend"
  value       = module.s3_cloudfront.frontend_bucket_name
}

output "images_s3_bucket" {
  description = "The S3 bucket for images"
  value       = module.s3_cloudfront.images_bucket_name
}

output "cloudfront_domain" {
  description = "The CloudFront domain name"
  value       = module.s3_cloudfront.cloudfront_domain_name
}

output "cloudfront_distribution_id" {
  description = "The CloudFront distribution id"
  value       = module.s3_cloudfront.cloudfront_distribution_id
}

output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = module.ecr.repository_url
}

output "dynamodb_table_name" {
  description = "The name of the DynamoDB table"
  value       = module.dynamodb.table_name
}
