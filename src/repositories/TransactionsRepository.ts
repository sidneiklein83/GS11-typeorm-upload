import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalanceWithList(list: Transaction[]): Promise<Balance> {
    const { income, outcome } = list.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    //
    const total = Number(income) - Number(outcome);
    //
    return { income, outcome, total };
  }

  public async getBalance(): Promise<Balance> {
    const repository = getCustomRepository(TransactionsRepository);
    const transactions = await repository.find();
    return repository.getBalanceWithList(transactions);
  }
}

export default TransactionsRepository;
