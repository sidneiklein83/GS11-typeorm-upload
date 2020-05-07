import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CategoryCreateService from './CategoryCreateService';
import Category from '../models/Category';

interface Request {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class TransactionUpdateService {
  public async execute({
    id,
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const repoCategory = getRepository(Category);
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
    //
    //
    const repoTransaction = getRepository(Transaction);
    //
    const checkExists = await repoTransaction.findOne(id);
    if (!checkExists) {
      throw new AppError('Transaction not exists!');
    }
    //
    checkExists.title = title;
    checkExists.value = value;
    checkExists.type = type;
    checkExists.category = checkCategoryExists;
    await repoTransaction.save(checkExists);
    //
    return checkExists;
  }
}

export default TransactionUpdateService;
