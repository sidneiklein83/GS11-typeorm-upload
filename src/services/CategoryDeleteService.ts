import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface Request {
  id: string;
}

class DeleteCategoryService {
  public async execute({ id }: Request): Promise<void> {
    const repoCategory = getRepository(Category);
    //
    const checkExists = await repoCategory.findOne(id);
    if (!checkExists) {
      throw new AppError('Category not exists!');
    }
    //
    await repoCategory.remove(checkExists);
  }
}

export default DeleteCategoryService;
