data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "k3s_master" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.k3s_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    curl -sfL https://get.k3s.io | sh -

    mkdir -p /home/ubuntu/.kube
    cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
    chown ubuntu:ubuntu /home/ubuntu/.kube/config

    echo "export KUBECONFIG=/home/ubuntu/.kube/config" >> /home/ubuntu/.bashrc
  EOF

  tags = {
    Name = "${var.project_name}-master"
  }
}
