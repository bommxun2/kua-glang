output "frontend_bucket_name" {
  description = "Name of the frontend S3 bucket"
  value       = aws_s3_bucket.frontend.id
}

output "frontend_website_url" {
  value = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "images_bucket_name" {
  description = "Name of the images S3 bucket"
  value       = aws_s3_bucket.images.id
}