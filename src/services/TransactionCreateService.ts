import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import CategoryCreateService from './CategoryCreateService';
import TransactionsRepository from '../repositories/TransactionsRepository';
/*
  "title": "Salário",
  "value": 3000,
  "type": "income",
  "category": "Alimentação"
*/
interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class TransactionCreateService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const repoCategory = getRepository(Category);
    // const repoTransaction = getRepository(Transaction);
    //
    let checkCategoryExists = await repoCategory.findOne({
      where: { title: category },
    });
    if (!checkCategoryExists) {
      // create a new category here!...
      const createService = new CategoryCreateService();
      checkCategoryExists = await createService.execute({
        title: category,
      });
      //
      // throw new AppError('Transaction already exists!');
    }
    //
    if (typeof value !== 'number') {
      throw new AppError('The Value is not a Number!');
    }
    // Não permite saída maior que o saldo restante...
    const repoTransaction = getCustomRepository(TransactionsRepository);
    const { total } = await repoTransaction.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('Do not are enough balance!');
    }
    //
    //
    const object = repoTransaction.create({
      title,
      value,
      type,
      category: checkCategoryExists,
    });
    await repoTransaction.save(object);
    return object;
  }
}

export default TransactionCreateService;
