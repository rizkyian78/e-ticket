import { Sequelize } from 'sequelize';

import { User } from './user.model';
import { Ticket } from './tickets.model';
import { Inquiry } from './inquiries.model';
import { Transaction } from './transactions.model';
import { LedgerAccount } from './ledger_accounts';
import { LedgerEntry } from './ledger_entries.model';
import { HandledTransctions } from './handled_transactions';

export const initModels = (sequelize: Sequelize) => {
  User.initModel(sequelize);
  Ticket.initModel(sequelize);
  Inquiry.initModel(sequelize);
  Transaction.initModel(sequelize);
  LedgerAccount.initModel(sequelize);
  LedgerEntry.initModel(sequelize);
  HandledTransctions.initModel(sequelize);

  // no relations

  return {
    User,
    Ticket,
    Inquiry,
    Transaction,
    LedgerAccount,
    LedgerEntry,
    HandledTransctions,
  };
};
