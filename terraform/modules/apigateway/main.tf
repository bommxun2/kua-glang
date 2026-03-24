resource "aws_security_group" "vpc_link" {
  name        = "${var.project_name}-${var.environment}-vpclink-sg"
  description = "Security group for API Gateway VPC Link"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-vpclink-sg"
  }
}

resource "aws_apigatewayv2_vpc_link" "this" {
  name               = "${var.project_name}-${var.environment}-vpclink"
  security_group_ids = [aws_security_group.vpc_link.id]
  subnet_ids         = var.private_subnet_ids

  tags = {
    Name = "${var.project_name}-${var.environment}-vpclink"
  }
}

resource "aws_apigatewayv2_api" "this" {
  name          = "${var.project_name}-${var.environment}-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "alb" {
  api_id             = aws_apigatewayv2_api.this.id
  integration_type   = "HTTP_PROXY"
  integration_uri    = var.alb_arn
  integration_method = "ANY"
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.this.id
}

locals {
  routes = [
    "ANY /auth/{proxy+}",
    "ANY /post/{proxy+}",
    "ANY /share/{proxy+}",
    "ANY /profile/{proxy+}",
    "ANY /history/{proxy+}",
    "ANY /ranking/{proxy+}",
    "ANY /folder/{proxy+}",
    "ANY /food/{proxy+}",
    "GET /"
  ]
}

resource "aws_apigatewayv2_route" "routes" {
  for_each  = toset(local.routes)
  api_id    = aws_apigatewayv2_api.this.id
  route_key = each.key
  target    = "integrations/${aws_apigatewayv2_integration.alb.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true
}
