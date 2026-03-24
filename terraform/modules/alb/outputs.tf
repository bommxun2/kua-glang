output "alb_arn" {
  description = "ARN of the ALB"
  value       = aws_lb.backend_app.arn
}

output "alb_dns_name" {
  description = "DNS name of the ALB"
  value       = aws_lb.backend_app.dns_name
}

output "alb_sg_id" {
  description = "Security Group ID of the ALB"
  value       = aws_security_group.alb.id
}

output "alb_listener_arn" {
  description = "Security Group ID of the ALB"
  value       = aws_lb_listener.http.arn
}