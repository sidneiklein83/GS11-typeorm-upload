import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';

interface Request {
  title: string;
}

class CategoryCreateService {
  public async execute({ title }: Request): Promise<Category> {
    const repoCategory = getRepository(Category);
    //
    const checkExists = await repoCategory.findOne({ where: { title } });
    if (checkExists) {
      throw new AppError('Category already exists!');
    }
    //
    const object = repoCategory.create({ title });
    await repoCategory.save(object);
    return object;
  }
}

export default CategoryCreateService;
