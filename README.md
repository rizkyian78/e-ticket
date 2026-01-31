# E-Ticketing & Payment Simulation Platform

A fintech-style microservices architecture demonstrating an event-driven e-ticketing and payment system with an immutable ledger.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Frontend (SPA)                    │
└────────────┬────────────────────────────────────┬───────────────┘
             │                                    │
             ▼                                    ▼
    ┌─────────────────┐                 ┌─────────────────┐
    │ Ticket Service  │                 │ Payment Service │
    │   (C# / .NET)   │◄────────────────┤ (Node.js/NestJS)│
    │                 │                 │                 │
    │ • Catalog       │                 │ • Orchestration │
    │ • Quota         │                 │ • CC Handler    │
    │ • Reservation   │                 │ • QR Handler    │
    │ • Inquiry       │                 │ • Tx Records    │
    └─────────────────┘                 └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │ Ledger Service  │
                                        │(Python/FastAPI) │
                                        │                 │
                                        │ • Append-only   │
                                        │ • Double-entry  │
                                        │ • Idempotency   │
                                        │ • Audit trail   │
                                        └─────────────────┘
```

## Service Responsibilities

### Ticket Service (C# / .NET)

**Purpose**: Manages ticket inventory, reservations, and inquiry lifecycle.

**Core responsibilities**:

- Maintain ticket catalog and metadata
- Enforce quota constraints and prevent overselling
- Reserve tickets temporarily during checkout
- Handle ticket inquiry state transitions (reserved → sold → completed)
- Release reservations on timeout or payment failure

**Technology rationale**: C# / .NET chosen for strong typing, performance, and enterprise-grade transaction support.

### Payment Service (Node.js / NestJS)

**Purpose**: Orchestrates payment flows and integrates with payment gateways.

**Core responsibilities**:

- Route payment requests to appropriate handlers (Credit Card, QR)
- Execute strategy-based payment processing
- Maintain transaction records and status
- Coordinate with Ticket Service for reservation confirmation
- Trigger ledger recording upon successful payment
- Handle retries, timeouts, and idempotency

**Technology rationale**: Node.js / NestJS provides async I/O efficiency for orchestrating multiple external calls and strategy pattern support.

### Ledger Service (Python / FastAPI)

**Purpose**: Maintains an immutable, append-only ledger following double-entry accounting principles.

**Core responsibilities**:

- Record all financial transactions as debit/credit pairs
- Enforce idempotency via unique constraints (prevent duplicate entries)
- Provide audit trail and compliance support
- Compute balances on-demand from ledger entries (no cached balance table)
- Guarantee atomicity: one transaction = one debit + one credit

**Technology rationale**: Python / FastAPI offers rapid development, strong data validation (Pydantic), and straightforward database interaction for append-only workloads.

## Functional Flow

```
1. User selects tickets in React Frontend
   ↓
2. Ticket Service reserves quota (temporary hold)
   ↓
3. User initiates payment
   ↓
4. Payment Service processes via selected handler (CC/QR)
   ↓
5. Payment succeeds
   ↓
6. Payment Service calls Ledger Service
   ↓
7. Ledger Service records debit (user) and credit (merchant) entries
   ↓
8. Ticket Service marks reservation as sold
   ↓
9. Transaction completed
```

## Ledger Rules

### Immutability

- **Append-only**: No `UPDATE` or `DELETE` operations
- Once written, ledger entries are permanent
- Corrections handled via reversing entries, not modifications

### Double-Entry Accounting

- Every transaction produces exactly **one debit** and **one credit** entry
- Debit and credit amounts must match
- Ensures zero-sum property: total debits = total credits

### Idempotency

- Enforced at database level via unique constraints on transaction ID + entry type
- Prevents duplicate entries from retries or network errors
- Guarantees exactly-once semantics

### Balance Derivation

- No `balance` table exists
- Balances computed on-demand: `SUM(credits) - SUM(debits)` per account
- Trade-off: Slower balance queries, but eliminates consistency issues between balance cache and ledger

## How to Run Locally

### Prerequisites

- Docker and Docker Compose (recommended)
- OR: Python 3.11+, Node.js 18+, .NET 8 SDK
- PostgreSQL 15+ (for Ledger and Payment)
- SQL Server or PostgreSQL (for Ticket Service)

### Ledger Service (Python / FastAPI)

```bash
# Navigate to ledger service directory
cd ledger-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://user:pass@localhost:5432/ipg"
export PORT=8001

# Start service
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

**Endpoints**:

- `POST /ledger/entries` - Record debit/credit pair

### Payment Service (Node.js / NestJS)

```bash
# Navigate to payment service directory
cd payment-service

# Install dependencies
npm install

# Set environment variables
export DATABASE_URL="postgresql://user:pass@localhost:5432/ipg"
export LEDGER_SERVICE_URL="http://localhost:9000"
export TICKET_SERVICE_URL="http://localhost:5000"
export PORT=3000

# Run migrations
npm run migration:run

# Start service (development)
npm run start:dev
```

**Endpoints**:

- `POST /payments/initiate` - Start payment flow
- `POST /payments/process` - Execute payment via handler
- `GET /payments/{payment_id}` - Retrieve payment status
- `POST /payments/webhooks/{provider}` - Handle provider callbacks

### Ticket Service (C# / .NET)

```bash
# Navigate to ticket service directory
cd ticket-service

# Restore dependencies
dotnet restore

# Set environment variables (or use appsettings.json)
export ConnectionStrings__DefaultConnection="Server=localhost;Database=TicketDB;User Id=user;Password=pass;"
export PaymentServiceUrl="http://localhost:3000"

# Run migrations
dotnet ef database update

# Start service
dotnet run --project TicketService.API
```

**Endpoints**:

- `GET /tickets` - List available tickets
- `POST /tickets/reserve` - Reserve ticket(s)
- `POST /tickets/confirm` - Confirm reservation after payment
- `DELETE /tickets/reserve/{reservation_id}` - Release reservation

### Running with Docker Compose

```bash
# From project root
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:80
# - Ticket Service: http://localhost:5000
# - Payment Service: http://localhost:3000
# - Ledger Service: http://localhost:8001
```

## Assumptions

### Technical

1. Services communicate via synchronous HTTP/REST APIs
2. Each service has its own database (database-per-service pattern)
3. No distributed transaction coordinator (2PC/Saga pattern not implemented)
4. Payment handlers are mocked/simulated (not integrated with real providers)
5. Network is reliable enough for retry-based idempotency

### Business

1. Ticket reservations expire after a configurable timeout (e.g., 15 minutes)
2. Failed payments result in automatic reservation release
3. All monetary amounts use fixed-point representation (e.g., cents as integers)
4. Single currency (no multi-currency support)
5. Refunds handled via reversing ledger entries, not direct updates

### Operational

1. Services are stateless and horizontally scalable
2. Database connection pooling configured appropriately
3. Logging and monitoring infrastructure exists separately
4. API gateways and service mesh not included in this simulation

## Trade-offs

### REST vs Event-Driven Architecture

| Aspect | REST (Current) | Event-Driven (Alternative) |
| --- | --- | --- |
| **Complexity** | Low - straightforward request/response | High - requires message broker, event schemas, ordering |
| **Consistency** | Synchronous - immediate feedback | Eventual - requires careful handling |
| **Coupling** | Tighter - services know each other | Looser - services react to events |
| **Debugging** | Easier - linear flow, stack traces | Harder - distributed traces, event replay |
| **Scalability** | Limited by synchronous calls | Better - services process independently |
| **Failure handling** | Retry logic required | Built-in via message redelivery |

**Decision**: REST chosen for simplicity and interview clarity. In production, hybrid approach (REST for queries, events for state changes) often preferred.

### Separate Ledger Service

**Pros**:

- Single source of truth for financial data
- Specialized team can own financial compliance
- Easier to audit and secure (fewer access points)
- Can enforce ledger rules uniformly across all payment types
- Technology-agnostic interface for other services

**Cons**:

- Additional network hop adds latency
- Single point of failure (mitigated by replication)
- Potential bottleneck under high load
- Operational overhead (deploy, monitor, scale separately)

**Decision**: Separation justified because financial accuracy, auditability, and compliance are non-negotiable in fintech. Latency trade-off acceptable for correctness.

### No Balance Table

**Pros**:

- Eliminates cache invalidation complexity
- No risk of balance/ledger inconsistency
- Simpler code - no dual writes to balance and ledger
- Full audit trail always available
- Easier to reason about correctness

**Cons**:

- Balance queries require aggregation (SUM over ledger)
- Performance degrades as ledger grows
- Cannot use balance as index for range queries

**Decision**: Correctness prioritized over performance. In production, consider:

- Materialized views refreshed periodically
- CQRS with separate read model
- Partitioning ledger by time (archive old entries)

**Mitigation strategies**:

- Index ledger on `account_id` and `created_at`
- Cache recent balances with TTL
- Pre-compute balances for top N accounts
- Aggregate daily/monthly for historical analysis

## Why This Approach

### For Fintech Interviews

This architecture demonstrates several fintech engineering principles:

**1. Financial Correctness Over Performance**

The append-only ledger and double-entry accounting ensure mathematical correctness. Every cent is accounted for. This is non-negotiable in financial systems. Performance can be optimized later via caching, indexing, or CQRS, but correctness must be foundational.

**2. Idempotency as a First-Class Concern**

Network failures and retries are inevitable in distributed systems. Idempotency prevents duplicate charges - a critical user experience and compliance issue. Database-level enforcement (unique constraints) is more reliable than application-level checks.

**3. Auditability and Compliance**

The immutable ledger provides a complete audit trail. Regulators can trace any transaction back to its origin. No data is ever deleted or modified, only appended. This design supports SOX, PCI-DSS, and similar compliance requirements.

**4. Separation of Concerns**

Each service has a clear, bounded responsibility:

- Ticket Service: Inventory management
- Payment Service: Payment orchestration
- Ledger Service: Financial record-keeping

This allows specialized teams, independent scaling, and technology diversity.

**5. Eventual Consistency Awareness**

While using synchronous REST, the design acknowledges that distributed systems cannot guarantee strong consistency everywhere. Compensating actions (reservation release, reversing entries) handle failure scenarios gracefully.

**6. Trade-off Transparency**

Production systems involve trade-offs. This architecture explicitly chooses:

- Correctness over speed (no balance table)
- Simplicity over scalability (REST not events)
- Auditability over efficiency (append-only)

Understanding these trade-offs and articulating alternatives demonstrates engineering maturity.

### Evolution Path

This design serves as a foundation. Production evolution might include:

- Replace synchronous calls with event streaming (Kafka)
- Add CQRS for read-optimized balance queries
- Implement Saga pattern for distributed transactions
- Add API gateway and service mesh
- Integrate with real payment providers (Stripe, Adyen)
- Add fraud detection and risk scoring