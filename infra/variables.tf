variable "aws_region" {
  default = "ap-southeast-1"
}

variable "instance_type" {
  default = "t3.small"
}

variable "key_name" {
  description = "EC2 keypair name"
}

variable "project_name" {
  default = "e-ticketing-k3s"
}
