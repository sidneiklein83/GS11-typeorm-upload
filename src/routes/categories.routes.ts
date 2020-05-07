import { Router } from 'express';

import { getRepository } from 'typeorm';
import CategoryCreateService from '../services/CategoryCreateService';
import CategoryUpdateService from '../services/CategoryUpdateService';
import CategoryDeleteService from '../services/CategoryDeleteService';
import Category from '../models/Category';

const categoriesRouter = Router();

categoriesRouter.get('/', async (request, response) => {
  const repository = getRepository(Category);
  const categories = await repository.find();
  return response.json(categories);
});

categoriesRouter.post('/', async (request, response) => {
  const { title } = request.body;
  const createService = new CategoryCreateService();
  const object = await createService.execute({
    title,
  });
  //
  return response.json(object);
});

categoriesRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  //
  const updateService = new CategoryUpdateService();
  const object = await updateService.execute({
    id,
    title,
  });
  //
  return response.json(object);
});

categoriesRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteService = new CategoryDeleteService();
  await deleteService.execute({
    id,
  });
  //
  return response
    .status(200)
    .json({ status: 'ok', message: `${id} removido com sucesso` });
});

export default categoriesRouter;
