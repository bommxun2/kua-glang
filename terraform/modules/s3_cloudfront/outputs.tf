output "frontend_bucket_name" {
  description = "Name of the frontend S3 bucket"
  value       = aws_s3_bucket.frontend.id
}

output "images_bucket_name" {
  description = "Name of the images S3 bucket"
  value       = aws_s3_bucket.images.id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.this.domain_name
}

output "cloudfront_distribution_id" {
  description = "The CloudFront distribution id"
  value       = aws_cloudfront_distribution.this.id
}

