import { Router } from 'express';

import categoriesRouter from './categories.routes';
import transactionsRouter from './transactions.routes';

const routes = Router();

routes.use('/categories', categoriesRouter);
routes.use('/transactions', transactionsRouter);

export default routes;
