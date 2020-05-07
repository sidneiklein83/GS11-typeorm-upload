import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';

interface Request {
  id: string;
  title: string;
}
class CategoryUpdateService {
  public async execute({ id, title }: Request): Promise<Category> {
    const repoCategory = getRepository(Category);
    //
    const checkExists = await repoCategory.findOne(id);
    if (!checkExists) {
      throw new AppError('Category not exists!');
    }
    //
    checkExists.title = title;
    await repoCategory.save(checkExists);
    return checkExists;
  }
}

export default CategoryUpdateService;
