import csvParse from 'csv-parse';
import { getCustomRepository, In } from 'typeorm';
import fs from 'fs';

import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface CsvContent {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class TransactionImportService {
  async execute(filePath: string): Promise<Transaction[]> {
    /* Get Repository */
    const repoCategory = getCustomRepository(CategoriesRepository);
    const repoTransaction = getCustomRepository(TransactionRepository);

    /* Initialize CSV PARSER */

    /* First Read Stream of filepath */
    const readStream = fs.createReadStream(filePath);

    /* Parser initialize from line 2 */

    const parser = csvParse({
      delimiter: ',',
      from_line: 2,
    });

    const parseCSV = readStream.pipe(parser);
    //
    const categories: string[] = [];
    const transactions: CsvContent[] = [];
    //
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );
      if (!title || !type || !value) return;
      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    // This is so Importante its one promise when return the final action of parser
    await new Promise(resolve => parseCSV.on('end', resolve));

    // Finding in the database if categories are exists and return this on a object
    const existentCategories = await repoCategory.find({
      where: {
        title: In(categories),
      },
    });

    // This is a Map to take only category title
    const exsitentCategoriesTitle = existentCategories.map(
      (category: Category) => category.title,
    );

    // Filter if categoriesTitle are included in category and the next filter
    // inform if have more than one category with da same name returns only one
    const addCategoryTitle = categories
      .filter(category => !exsitentCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    // Add new categories in one massive event
    const newCategories = repoCategory.create(
      addCategoryTitle.map(title => ({
        title,
      })),
    );

    await repoCategory.save(newCategories);

    // this Array receive existent categories and created categories in database
    const finalCategories = [...newCategories, ...existentCategories];
    //
    //
    // Create the transactions
    const createdTransactions = repoTransaction.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await repoTransaction.save(createdTransactions);

    // exclude the file
    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default TransactionImportService;
