import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import TransactionCreateService from '../services/TransactionCreateService';
import TransactionDeleteService from '../services/TransactionDeleteService';
import TransactionImportService from '../services/TransactionImportService';
import TransactionUpdateService from '../services/TransactionUpdateService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = await repository.find({ relations: ['category'] });
  const balance = await repository.getBalanceWithList(transactions);

  return response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createService = new TransactionCreateService();
  const object = await createService.execute({
    title,
    value,
    type,
    category,
  });
  //
  return response.json(object);
});

transactionsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { title, value, type, category } = request.body;
  //
  const updateService = new TransactionUpdateService();
  const object = await updateService.execute({
    id,
    title,
    value,
    type,
    category,
  });
  //
  return response.json(object);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteService = new TransactionDeleteService();
  await deleteService.execute({
    id,
  });
  //
  return response
    .status(200)
    .json({ status: 'ok', message: `${id} removido com sucesso` });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importService = new TransactionImportService();

    const transactions = await importService.execute(request.file.path);
    return response.json(transactions);
  },
);

export default transactionsRouter;
