## Access URL

The application is exposed via HTTPS tunnel for evaluation:

https://rizkyiann8nautomation.my.id/ [Currently Using My domain. since other domain still propagate]

Note:
Custom domain + Cloudflare + cert-manager (DNS-01) is configured,
but registrar DNS propagation exceeded assignment time constraints.

## Styling
This project uses Tailwind CSS strictly as a utility layer.
No component libraries or prebuilt UI kits are used.
All layout and visual decisions are custom and minimal.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│                  React Single Page Application                  │
│                  (Ticket Selection & Checkout)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS/REST
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TICKET SERVICE                             │
│                         (C# .NET)                               │
│                                                                 │
│  • Ticket availability validation                               │
│  • Order creation & management                                  │
│  • Initiates payment processing                                 │
└───────────┬─────────────────────────────────────────────────────┘
            │ will redirect to checkout then 
            ▼
┌───────────────────────────────────────────────────────────────┐
│                   PAYMENT SERVICE                             │
│                   (Node.js (NestJS))                          │
│                                                               │
│  • Payment method routing                                     │
│  • Enqueues payment job to worker                             │
│  • Returns job ID immediately (async)                         │
└───────────┬───────────────────────────────────────────────────┘
            │ Enqueue Job
            ▼
┌───────────────────────────────────────────────────────────────┐
│                   PAYMENT WORKER (Golang)                     │
│                   (Background Job Queue )                     │
│                                                               │
│  • Processes payment asynchronously                           │
│  • Calls external payment gateway                             │
│  • Handles retries & failures                                 │
│  • Updates payment status                                     │
└───────────┬──────────────────────┬────────────────────────────┘
            │                      │
            │ Call Gateway         │ Listen for webhooks
            ▼ response             ▼
┌───────────────────────┐   ┌───────────────────────────────────┐
│  External Payment     │   │   WEBHOOK ENDPOINT                │
│  Gateway              │   │   (Payment Service)               │
│                       │   │                                   │
│  • Process payment    │   │  • Receive payment confirmation   │
│  • Send webhook       │   │  • Verify signature               │
└───────────────────────┘   │  • Trigger ledger recording       │
                            └──────────┬────────────────────────┘
                                        │ REST
                                        ▼
                             ┌──────────────────────────────────┐
                             │   LEDGER SERVICE                 │
                             │   (Python Fast API)              │
                             │                                  │
                             │  • Double-entry accounting       │
                             │  • Transaction recording         │
                             │  • Audit trail generation        │
                             │  • Immutable ledger entries      │
                             └──────────┬───────────────────────┘
                                        │
                                        ▼
                             ┌──────────────────────────────────┐
                             │   PostgreSQL / MySQL             │
                             │                                  │
                             │  • tickets                       │
                             │  • orders                        │
                             │  • payment_jobs                  │
                             │  • ledger_entries                │
                             └──────────────────────────────────┘
```

## Database Diagram

![Database Diagram](pg_diagram.png)


## Service Responsibilities

### Ticket Service (C# .NET)

**Primary Responsibilities**

- Manage ticket inventory and quota enforcement
- Handle order creation and validation
- Orchestrate payment and ledger workflows
- Return consolidated responses to frontend

**API Endpoints**

- `GET /api/ticket` - List available ticket types with current quotas
- `POST /api/inquiry/submit` - Create order and process payment
- `GET /api/inquiry/{id}` - Retrieve order details

**Key Logic**

- Atomic quota decrement using database transactions
- Rollback handling if payment or ledger recording fails
- Order reference generation (unique identifier)

---

### Payment Service (Node.js / Golang)

**Primary Responsibilities**

- Route payment requests to appropriate handlers
- Simulate payment gateway interactions
- Enforce idempotency to prevent duplicate charges
- Generate transaction IDs and payment references

**Payment Method Handlers**

| Method | Behavior | Processing Time |
| --- | --- | --- |
| Credit Card | Instant success simulation | Immediate |
| QR/UPI/QRIS | Artificial delay simulation | 8 seconds |

**Design Pattern: Strategy Pattern**

```
PaymentInterface
├── CreditCardHandler
│   └── processPayment(amount, metadata)
├── QRPaymentHandler
│   └── processPayment(amount, metadata)
└── [Future: WalletHandler, BankTransferHandler, CryptoHandler]
```

**Idempotency Implementation**

- Client sends idempotency key with payment request
- Service checks if transaction with same key already exists
- Returns existing transaction if found, prevents duplicate processing

---

### Ledger Service (Python FAST API)

**Primary Responsibilities**

- Record all financial transactions
- Enforce double-entry accounting principles
- Maintain immutable audit trail
- Validate ledger balance integrity

**Double-Entry Accounting Model**

For each successful payment:

```
Debit:  Cash / Payment Gateway Account    AED XXX
Credit: Ticket Sales Revenue              AED XXX
```

**Guarantees**

- Every transaction has equal debits and credits
- No orphaned or unbalanced entries
- Chronological ordering with timestamps
- Immutability (no updates, only inserts)

---

##

## How to Run Locally

### Prerequisites

- Docker & Docker Compose installed
- Node.js 20+ (for frontend & backend local development)
- Git
- Requires .NET 8 SDK
- Go 1.25.5
- Python 3.14.2

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd e-ticketing-platform
```

### Step 2: Environment Setup

Create `.env` file in project root:

```bash
# Database
you'll find environment variables examples in each service
```

### Step 3: Start PG and RabbitMQ with Docker Compose

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database (port 5432)
- RabbitMQ (port 5672)

### Step 4: Database Migration

```bash
# Run migrations
folder called init_mgrations you can copy that and restore in the postgres
```

### Step 5: Run Demoshop

using yarn or npm

```bash
cd demoshop
yarn install && yarn dev
```

### Step 6: Run checkout page

using yarn

```bash
cd checkout-app
yarn install && yarn dev
```

### Step 7: Run payment-service
```bash
cd payment-service
yarn install && yarn start:dev
```

### Step 8: Run worker
```bash
cd payment-method-worker
go install 
go run cmd/<payment_method>/main.go
```

### Step 9: Run ledger-service
```bash
cd ledger-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port <port>
```


### Step 10: Run ticket-service
change below in appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=<ip>;Port=<port>;Database=ipg;Username=<username>;Password=<password>"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}

```
```bash
cd ticket-service
dotnet restore 
dotnet run
```


## How to Deploy

### Deployment Architecture

**Target Environment**

- AWS EC2 t2.micro or t3.micro (free tier eligible)
- K3s (lightweight Kubernetes)
- Nginx ingress controller
- Let's Encrypt for TLS certificates

### Prerequisites

- AWS account with EC2 instance running Ubuntu 22.04
- Domain name (free options: Freenom, DuckDNS)
- SSH access to EC2 instance

### Step 1: Provision EC2 Instance

```bash
# Launch EC2 instance
# Instance Type: t2.micro
# AMI: Ubuntu 22.04 LTS
# Security Group: Allow ports 22, 80, 443, 6443

# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 2: Install K3s

```bash
curl -sfL https://get.k3s.io | sh -

# Verify installation
sudo k3s kubectl get nodes
```

### Step 3: Configure DNS

Point your domain to EC2 public IP:

```
A Record: ticketing.yourdomain.com -> EC2_PUBLIC_IP
```

### Step 4: Deploy Services

```bash
# Create namespace
kubectl create namespace ticketing

# Create secrets
kubectl create secret generic api-credentials \
  --from-literal=api-key=your-secret-api-key \
  --from-literal=client-id=client-12345 \
  --from-literal=client-secret=secret-67890 \
  -n ticketing

# Apply Kubernetes manifests
kubectl apply -f paymentservice/ --namespace e-ticket
kubectl apply -f worker/ --namespace e-ticket
kubectl apply -f frontend/ --namespace e-ticket
```
## utils_server

The `utils_server` directory does not contain Kubernetes manifests.
It contains operational shell scripts used for cluster maintenance.

### remove_unrunning_pods.sh

Deletes all pods in the `e-ticket` namespace that are not in `Running` state.

Usage:

```bash
chmod +x utils_server/remove_unrunning_pods.sh
./utils_server/remove_unrunning_pods.sh
```

## Kubernetes Visualization (k9s)

This project uses **k9s** as a lightweight, terminal-based UI to visualize and interact with Kubernetes resources during development and troubleshooting.

k9s is used **only as an operational aid** and is not required for application runtime or CI/CD execution.

---

### How to Use k9s with This Project

Ensure your `kubeconfig` is pointing to the correct cluster and context:

```bash
kubectl config current-context
Launch k9s:

k9s
Recommended Usage for This Project
Once inside k9s:

Switch to Project Namespace
:ns
Select the namespace used by this project (e.g. e-ticket).

View Core Resources
:po    # Pods
:dp    # Deployments
:svc   # Services
:ing   # Ingresses
Inspect Logs
Select a pod

Press l to stream logs

Press s to switch containers (if multiple)

Restart a Deployment
Navigate to deployments (:dp)

Select deployment

Press r to restart

Delete Failed Pods
Navigate to pods (:po)

Select pod

Press d to delete

Common Debug Scenarios
Worker not processing jobs

Check worker pod logs

Verify RabbitMQ pod is running

Ensure payment-service is healthy

Frontend not reachable

Inspect ingress resource

Verify frontend service endpoints

Check pod readiness probes

Pods stuck in CrashLoopBackOff

View pod events

Inspect container logs

Restart or delete pod if needed


### Step 5: Configure TLS with Let's Encrypt

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Apply certificate issuer
kubectl apply -f k8s/letsencrypt-issuer.yaml
```

### Step 6: Verify Deployment

```bash
# Check pod status
kubectl get pods -n ticketing

# Check ingress
kubectl get ingress -n ticketing

# Access application
https://ticketing.yourdomain.com
```

### Alternative: Docker Compose Deployment

For simpler deployment without Kubernetes:

```bash
# On EC2 instance
git clone <repository-url>
cd e-ticketing-platform

# Set environment variables
cp .env.example .env.production
nano .env.production  # Edit values

# Start services
docker-compose -f docker-compose.prod.yaml up -d

# Setup nginx reverse proxy
sudo apt install nginx
sudo cp nginx/ticketing.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/ticketing.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ticketing.yourdomain.com
```




## CI/CD Pipeline Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TRIGGER EVENTS                               │
└────────────┬────────────────────────────────────┬───────────────────┘
             │                                    │
             │ Pull Request                       │ Push to main
             ▼                                    ▼
┌────────────────────────────────┐  ┌────────────────────────────────────┐
│     PR PIPELINE                │  │    MERGE PIPELINE                  │
│  (pr-tests)                    │  │  (merge-tests-coverage-sonar)      │
└────────────┬───────────────────┘  └────────────┬───────────────────────┘
             │                                   │
             ▼                                   ▼
┌────────────────────────────────┐  ┌──────────────────────────────────────┐
│  1. CHECKOUT CODE              │  │  1. CHECKOUT CODE                    │
│     actions/checkout@v4        │  │     actions/checkout@v4              │
└────────────┬───────────────────┘  └────────────┬─────────────────────────┘
             │                                   │
             ▼                                   ▼
┌────────────────────────────────┐  ┌──────────────────────────────────────┐
│  2. SETUP RUNTIMES             │  │  2. SETUP RUNTIMES                   │
│     • Node.js 20               │  │     • Node.js 20                     │
│     • Python 3.11              │  │     • Python 3.11                    │
│     • .NET 8.0.x               │  │     • .NET 8.0.x                     │
└────────────┬───────────────────┘  └────────────┬─────────────────────────┘
             │                                   │
             ▼                                   ▼
┌────────────────────────────────┐  ┌──────────────────────────────────────┐
│  3. RUN TESTS                  │  │  3. RUN TESTS WITH COVERAGE          │
│                                │  │                                      │
│  ┌──────────────────────────┐ │  │  ┌────────────────────────────────┐ │
│  │ Frontend (Demoshop)      │ │  │  │ Demoshop                       │ │
│  │  • yarn install          │ │  │  │  • yarn test --coverage        │ │
│  │  • yarn lint             │ │  │  │                                │ │
│  │  • yarn test             │ │  │  │ Checkout App                   │ │
│  └──────────────────────────┘ │  │  │  • yarn test --coverage        │ │
│                                │  │  │                                │ │
│  ┌──────────────────────────┐ │  │  │ Backoffice App                 │ │
│  │ Payment Service          │ │  │  │  • yarn test --coverage        │ │
│  │  • yarn install          │ │  │  │                                │ │
│  │  • yarn lint             │ │  │  │ Payment Service                │ │
│  │  • yarn test             │ │  │  │  • yarn test --coverage        │ │
│  └──────────────────────────┘ │  │  │                                │ │
│                                │  │  │ Ledger Service                 │ │
│  ┌──────────────────────────┐ │  │  │  • pytest --cov                │ │
│  │ Ledger Service           │ │  │  │  • flake8 (linting)            │ │
│  │  • pip install           │ │  │  │                                │ │
│  │  • pytest                │ │  │  │ Ticket Service                 │ │
│  └──────────────────────────┘ │  │  │  • dotnet test (with coverage) │ │
│                                │  │  └────────────────────────────────┘ │
│  ┌──────────────────────────┐ │  └────────────┬─────────────────────────┘
│  │ Ticket Service (.NET)    │ │               │
│  │  • dotnet restore        │ │               ▼
│  │  • dotnet test           │ │  ┌──────────────────────────────────────┐
│  └──────────────────────────┘ │  │  4. SONARCLOUD ANALYSIS              │
└────────────┬───────────────────┘  │                                      │
             │                      │  ┌────────────────────────────────┐ │
             ▼                      │  │ SonarCloud Scan                │ │
┌────────────────────────────────┐  │  │  • Project: rizkyian78_e-ticket│ │
│  4. COMPLETE                   │  │  │  • Organization: rizkyian78    │ │
│     ✓ All tests passed         │  │  └────────────────────────────────┘ │
└────────────────────────────────┘  │                                      │
                                    │  ┌────────────────────────────────┐ │
                                    │  │ Quality Gate Check             │ │
                                    │  │  • Timeout: 5 minutes          │ │
                                    │  │  • Continue on error           │ │
                                    │  └────────────────────────────────┘ │
                                    └────────────┬─────────────────────────┘
                                                 │
                                                 ▼
                                    ┌──────────────────────────────────────┐
                                    │  5. DOCKER LOGIN                     │
                                    │                                      │
                                    │  • Login to Docker Hub               │
                                    │  • Set IMAGE_TAG = commit SHA (7ch)  │
                                    └────────────┬─────────────────────────┘
                                                 │
                                                 ▼
                                    ┌──────────────────────────────────────┐
                                    │  6. BUILD & PUSH DOCKER IMAGES       │
                                    │     (9 images in sequence)           │
                                    │                                      │
                                    │  ┌────────────────────────────────┐ │
                                    │  │ 1. Demoshop Frontend           │ │
                                    │  │    • Build with API URLs       │ │
                                    │  │    • Push to DockerHub         │ │
                                    │  └────────────────────────────────┘ │
                                    │                                      │
                                    │  ┌────────────────────────────────┐ │
                                    │  │ 2. Checkout App Frontend       │ │
                                    │  │    • Build with base URL       │ │
                                    │  │    • Push to DockerHub         │ │
                                    │  └────────────────────────────────┘ │
                                    │                                      │
                                    │  ┌────────────────────────────────┐ │
                                    │  │ 3. Backoffice App Frontend     │ │
                                    │  │    • Build                     │ │
                                    │  │    • Push to DockerHub         │ │
                                    │  └────────────────────────────────┘ │
                                    │                                      │
                                    │  ┌────────────────────────────────┐ │
                                    │  │ 4. Payment Service             │ │
                                    │  │    • Build                     │ │
                                    │  │    • Push to DockerHub         │ │
                                    │  └────────────────────────────────┘ │
                                    │                                      │
                                    │  ┌────────────────────────────────┐ │
                                    │  │ 5. Ledger Service              │ │
                                    │  │    • Build                     │ │
                                    │  │    • Push to DockerHub         │ │
                                    │  └────────────────────────────────┘ │
                                    │                                      │
                                    │  ┌────────────────────────────────┐ │
                                    │  │ 6. Ticket Service              │ │
                                    │  │    • Build                     │ │
                                    │  │    • Push to DockerHub         │ │
                                    │  └────────────────────────────────┘ │
                                    │                                      │
                                    │  ┌────────────────────────────────┐ │
                                    │  │ 7. Credit Card Worker          │ │
                                    │  │    • Build with CMD=creditcard │ │
                                    │  │    • Push to DockerHub         │ │
                                    │  └────────────────────────────────┘ │
                                    │                                      │
                                    │  ┌────────────────────────────────┐ │
                                    │  │ 8. QRIS Worker                 │ │
                                    │  │    • Build with CMD=qris       │ │
                                    │  │    • Push to DockerHub         │ │
                                    │  └────────────────────────────────┘ │
                                    │                                      │
                                    │  ┌────────────────────────────────┐ │
                                    │  │ 9. Debit Card Worker           │ │
                                    │  │    • Build with CMD=debitcard  │ │
                                    │  │    • Push to DockerHub         │ │
                                    │  └────────────────────────────────┘ │
                                    └────────────┬─────────────────────────┘
                                                 │
                                                 ▼
                                    ┌──────────────────────────────────────┐
                                    │  7. UPLOAD COVERAGE ARTIFACTS        │
                                    │                                      │
                                    │  • demoshop/coverage                 │
                                    │  • payment-service/coverage          │
                                    │  • ledger-service/coverage.xml       │
                                    │  • ticket-service/**/coverage.xml    │
                                    │                                      │
                                    │  Artifact: full-code-coverage        │
                                    └────────────┬─────────────────────────┘
                                                 │
                                                 ▼
                                    ┌──────────────────────────────────────┐
                                    │  8. COMPLETE                         │
                                    │     ✓ All images pushed              │
                                    │     ✓ Coverage uploaded              │
                                    │     ✓ Ready for deployment           │
                                    └──────────────────────────────────────┘
```

---

## Pipeline Summary

### Pull Request Pipeline (Fast Feedback)

**Purpose:** Quick validation of code changes  

**Execution Time:** ~5-8 minutes  

**Components:**

- 3 Frontend apps (Demoshop only)
- 1 Payment service (Node.js)
- 1 Ledger service (Python)
- 1 Ticket service (.NET)

**Key Characteristics:**

- Linting allowed to fail (`|| true`)
- Fast feedback for developers
- No Docker build (faster pipeline)
- No code coverage

---

### Merge Pipeline (Production Release)

**Purpose:** Full validation, quality gates, and deployment preparation  

**Execution Time:** ~25-35 minutes  

**Components:**

- **Tests with Coverage:** 6 services (Demoshop, Checkout, Backoffice, Payment, Ledger, Ticket)
- **Code Quality:** SonarCloud scan + Quality Gate
- **Container Images:** 9 Docker images
- **Artifacts:** Coverage reports uploaded

**Docker Images Built:**

| # | Image Name | Base Service | Purpose |
| --- | --- | --- | --- |
| 1 | demoshop | demoshop | Main customer-facing ticket shop |
| 2 | checkout-app | checkout-app | Checkout flow frontend |
| 3 | backoffice-app | backoffice-app | Admin/management interface |
| 4 | payment | payment-service | Payment orchestration API |
| 5 | ledger | ledger-service | Financial ledger API |
| 6 | ticket | ticket-service | Ticket inventory API |
| 7 | creditcard-worker | payment-method-worker | Credit card processing worker |
| 8 | qris-worker | payment-method-worker | QRIS payment processing worker |
| 9 | debitcard-worker | payment-method-worker | Debit card processing worker |

**Image Tagging Strategy:**

```
docker.io/<username>/e-ticketing-<service>:<7-char-commit-hash>
Example: docker.io/rizkyian78/e-ticketing-demoshop:a3f7b2c
```

---

## Key Pipeline Features

**Quality Gates**

- ✅ Automated linting (ESLint, Flake8, StyleCop)
- ✅ Unit and integration test coverage
- ✅ SonarCloud code quality analysis
- ✅ Quality Gate check (continues even if failed)

**Security Best Practices**

- 🔐 Secrets stored in GitHub Secrets (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN, SONAR_TOKEN)
- 🔐 API keys passed as build arguments
- 🔐 No secrets committed to repository

**Performance Optimizations Needed**

- ⚠️ Sequential Docker builds (not parallelized)
- ⚠️ `--no-cache` flag increases build time
- ⚠️ Could benefit from build matrix for parallel execution

**Suggested Improvements**

1. Parallelize Docker builds using matrix strategy
2. Enable Docker layer caching
3. Add semantic versioning alongside commit hash
4. Add deployment step to Kubernetes/K3s
5. Add notification step (Slack, email)

---

This pipeline demonstrates a **production-grade CI/CD workflow** with comprehensive testing, quality assurance, and multi-service containerization ready for orchestrated deployment.
### Known Limitations

**Current Approach**

- Images tagged only with commit hash
- Sequential build and push (slower for multiple services)
- No semantic versioning

**Impact**

- Difficult to identify production versions
- Longer pipeline execution time
- Manual version tracking required

### Planned Improvements

**Semantic Versioning**

```bash
# Future tagging strategy
service-name:v1.2.3
service-name:v1.2.3-abc1234
service-name:latest
```

**Parallel Builds**

```yaml
jobs:
  build-ticket-service:
    runs-on: ubuntu-latest
    steps: [...]
  
  build-payment-service:
    runs-on: ubuntu-latest
    steps: [...]
  
  build-ledger-service:
    runs-on: ubuntu-latest
    steps: [...]
```

**Multi-Stage Dockerfiles**

- Smaller final images
- Faster build times with caching
- Security scanning integration

---

## Assumptions & Trade-offs

### Assumptions

**Business Assumptions**

- All payments succeed (no failure simulation required for MVP)
- Refunds not implemented in initial version
- Single currency (AED) supported
- No partial payments or installments
- Quota managed at service level (no distributed locking)

**Technical Assumptions**

- Synchronous communication acceptable for MVP latency requirements
- Single database instance sufficient (no read replicas yet)
- API authentication via API key acceptable (no OAuth/JWT required initially)
- Services share logical database (not fully isolated databases)
- UTC timestamps for all time-based operations

**Infrastructure Assumptions**

- Free-tier cloud resources sufficient for demo/MVP
- Single region deployment
- No CDN required for frontend assets
- Manual scaling acceptable (no auto-scaling configured)

#### Shared Database vs Database per Service

**Decision:** Shared PostgreSQL with service-owned tables

**Pros:**

- Simpler deployment and operations
- No distributed transaction complexity
- Lower infrastructure cost
- Easier cross-service queries for admin/reporting

**Cons:**

- Schema coupling between services
- Potential for service boundary violations
- Single point of failure
- Difficult to scale services independently

**Future Consideration:** Migrate to database per service with eventual consistency patterns.

#### Payment Always Succeeds

**Decision:** Simulate 100% payment success rate

**Pros:**

- Simplified demo flow
- Focus on architecture rather than error handling
- Faster development iteration

**Cons:**

- Doesn't demonstrate robust error handling
- Missing retry logic implementation
- No payment failure reconciliation

**Future Consideration:** Add failure simulation modes (network timeout, insufficient funds, fraud detection) to showcase resilience patterns.

#### Commit Hash Tagging Only

**Decision:** Docker images tagged with Git commit hash

**Pros:**

- Exact source code traceability
- Automatic from CI/CD
- No manual version bumping

**Cons:**

- Not human-readable
- Difficult to identify feature versions
- No semver compatibility

**Future Consideration:** Hybrid approach with semantic version + commit hash.

# Future Enchancement

**Distributed Tracing**

- Integrate OpenTelemetry
- Jaeger or Zipkin for trace visualization
- Track request flow across all services
- Identify performance bottlenecks

**Structured Logging**

- Centralized logging with ELK stack (Elasticsearch, Logstash, Kibana)
- Correlation IDs for request tracking
- Log levels: DEBUG, INFO, WARN, ERROR
- JSON log format for parsing

**Metrics & Monitoring**

- Prometheus for metrics collection
- Grafana for dashboards
- Key metrics:
    - Request rate, latency, error rate
    - Payment success/failure ratio
    - Quota utilization
    - Database connection pool usage


### Advanced Payment Features

**Additional Payment Methods**

- Digital wallets (Apple Pay, Google Pay)
- Bank transfer (ACH, wire)
- Cryptocurrency (Bitcoin, Ethereum)
- Buy Now Pay Later (Affirm, Klarna)

**Payment Orchestration**

- Primary and fallback payment gateways
- Smart routing based on success rate
- Multi-currency support
- Dynamic currency conversion

**Fraud Detection with n8n**

- Automated workflow for fraud scoring
- Velocity checks (transactions per user/IP)
- Geolocation validation
- Device fingerprinting
- Manual review queue for high-risk orders

**Database Optimization**

- Read replicas for reporting queries
- Partitioning for ledger_entries table (by date)
- Query optimization and indexing
- Connection pooling tuning

**Caching Layer**

- Redis for ticket inventory cache
- Cache invalidation strategy
- Session management
- Rate limiting