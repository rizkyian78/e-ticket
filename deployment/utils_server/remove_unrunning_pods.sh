kubectl get pods -n e-ticket | \
  awk '$3!="Running"{print $1}' | \
  xargs -r kubectl delete pod -n e-ticket
