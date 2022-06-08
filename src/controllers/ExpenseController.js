const conf = require('../config/conf');
const { Expense, expenseToObj } = require('../models/Expense');

const db = conf.database;

const ExpenseController = {
  getExpenses: (req, res) => {
    const { businessId, date } = req.query;
    const params = {
      TableName: conf.table,
      KeyConditionExpression: 'PK = :pk AND begins_with (SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `BUSINESS#${businessId}`,
        ':sk': `EXPENSE#${date}`,
      },
    };
    db.query(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      const expensesArray = [];
      for (const expenseItem of data.Items) {
        expensesArray.push(expenseToObj(expenseItem));
      }
      res.status(200).json(expensesArray);
    });
  },

  createExpense: (req, res) => {
    const tempExpense = new Expense(req.body);
    const params = {
      TableName: conf.table,
      Item: tempExpense.toItem(),
      ConditionExpression: 'attribute_not_exists (PK)',
    };
    db.put(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(201);
    });
  },

  updateExpense: (req, res) => {
    const { businessId, date, name, description, fixed, type, value } =
      req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `EXPENSE#${date}`,
      },
      UpdateExpression:
        'SET #name = :n, #description = :d, #fixed = :f, #type = :t, #value = :v',
      ExpressionAttributeNames: {
        '#name': 'Name',
        '#description': 'Description',
        '#fixed': 'Fixed',
        '#type': 'Type',
        '#value': 'Value',
      },
      ExpressionAttributeValues: {
        ':n': name,
        ':d': description,
        ':f': fixed,
        ':t': type,
        ':v': value,
      },
    };

    db.update(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },

  deleteExpense: (req, res) => {
    const { businessId, date } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `EXPENSE#${date}`,
      },
    };
    db.delete(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },
};

module.exports = ExpenseController;
