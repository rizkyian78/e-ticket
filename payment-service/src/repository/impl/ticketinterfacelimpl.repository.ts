import { Inject, Injectable } from '@nestjs/common';
import { MODELS, SEQUELIZE } from 'src/providers/database.module';
import { TicketRepository } from '../ticketinterface.repository';
import { Ticket } from 'src/model/tickets.model';
import { QueryTypes, Sequelize, Transaction } from 'sequelize';

interface IdRow {
  id: string;
}

@Injectable()
export class SequelizeTicketRepository implements TicketRepository {
  constructor(
    @Inject(MODELS)
    private readonly models: {
      Ticket: typeof Ticket;
    },
    @Inject(SEQUELIZE) // ✅ TOKEN-BASED INJECTION
    private readonly sequelize: Sequelize,
  ) {}
  async reserveAtomic(
    ticketId: string,
    qty: number,
    txn: Transaction,
  ): Promise<boolean> {
    const result = await this.sequelize.query(
      `
      UPDATE tickets
      SET reserved_quota = reserved_quota + :qty
      WHERE id = :ticket_id
        AND (quota - reserved_quota) >= :qty
      RETURNING id;
      `,
      {
        replacements: { ticket_id: ticketId, qty },
        transaction: txn,
        type: QueryTypes.RAW, // ✅ correct
      },
    );

    // Sequelize RAW return type: [rows, metadata]
    const rows = result[0] as IdRow[]; // static cast (not any, not unknown)

    return rows.length > 0;
  }
  async release(ticketId: string, qty: number): Promise<boolean> {
    const result = await this.sequelize.query(
      `
      UPDATE tickets
      SET reserved_quota = reserved_quota - :qty
      WHERE id = :ticket_id
        AND reserved_quota >= :qty
      RETURNING id;
      `,
      {
        replacements: { ticket_id: ticketId, qty },
        type: QueryTypes.RAW,
      },
    );

    const rows = result[0] as IdRow[];
    return rows.length > 0;
  }
  async confirmSale(ticketId: string, qty: number): Promise<boolean> {
    const result = await this.sequelize.query(
      `
      UPDATE tickets
      SET 
        reserved_quota = reserved_quota - :qty,
        quota = quota - :qty
      WHERE id = :ticket_id
        AND reserved_quota >= :qty
      RETURNING id;
      `,
      {
        replacements: { ticket_id: ticketId, qty },
        type: QueryTypes.RAW,
      },
    );

    const rows = result[0] as IdRow[];
    return rows.length > 0;
  }
  async findTicketById(ticketId: string): Promise<Ticket | null> {
    const rows = await this.sequelize.query<Ticket>(
      `
      SELECT id, quota, reserved_quota
      FROM tickets
      WHERE id = :ticket_id
      LIMIT 1;
      `,
      {
        replacements: { ticket_id: ticketId },
        type: QueryTypes.SELECT, // ✅ SELECT supports generics
      },
    );

    return rows.length > 0 ? rows[0] : null;
  }
}
