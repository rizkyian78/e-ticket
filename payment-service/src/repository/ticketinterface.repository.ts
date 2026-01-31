import { Transaction } from 'sequelize';
import { Ticket } from 'src/model/tickets.model';

export interface TicketRepository {
  /**
   * Atomically reserve quota for a ticket.
   * Returns true if reserved, false if sold out.
   */
  reserveAtomic(
    ticketId: string,
    qty: number,
    tx: Transaction,
  ): Promise<boolean>;

  /**
   * Release reserved quota (on inquiry expiry)
   */
  release(ticketId: string, qty: number, txn: Transaction): Promise<boolean>;

  /**
   * Confirm sale (convert reserved → sold)
   */
  confirmSale(ticketId: string, qty: number): Promise<boolean>;

  /**
   * Read ticket
   */
  findTicketById(ticketId: string): Promise<Ticket | null>;
}
