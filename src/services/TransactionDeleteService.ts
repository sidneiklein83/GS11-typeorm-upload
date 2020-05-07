import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class TransactionDeleteService {
  public async execute({ id }: Request): Promise<void> {
    const repoTransaction = getRepository(Transaction);
    //
    const checkExists = await repoTransaction.findOne(id);
    if (!checkExists) {
      throw new AppError('Transaction not exists!');
    }
    //
    await repoTransaction.remove(checkExists);
  }
}

export default TransactionDeleteService;
