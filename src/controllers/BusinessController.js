const conf = require('../config/conf');
const { Business, Tax, businessToObj } = require('../models/Business');

const db = conf.database;

const BusinessController = {
  getBusiness: (req, res) => {
    const { id } = req.query;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${id}`,
        SK: `BUSINESS#${id}`,
      },
    };
    db.get(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      if (!data.Item) return res.sendStatus(404);
      res.status(200).json(businessToObj(data.Item));
    });
  },

  createBusiness: (req, res) => {
    const { username, name } = req.body;
    const tempBusiness = new Business({ username, name });
    const params = {
      TransactItems: [
        {
          Put: {
            TableName: conf.table,
            Item: tempBusiness.toItem(),
            ConditionExpression: 'attribute_not_exists (PK)',
          },
        },
        {
          Update: {
            TableName: conf.table,
            Key: {
              PK: `USER#${username}`,
              SK: `USER#${username}`,
            },
            UpdateExpression: 'SET #tax.#id = :tax',
            ExpressionAttributeNames: {
              '#tax': 'Businesses',
              '#id': tempBusiness.getId(),
            },
            ExpressionAttributeValues: {
              ':tax': tempBusiness.toMap(),
            },
          },
        },
      ],
    };
    db.transactWrite(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(201);
    });
  },

  deleteBusiness: (req, res) => {
    const { username, id } = req.body;
    const params = {
      TransactItems: [
        {
          Delete: {
            TableName: conf.table,
            Key: {
              PK: `BUSINESS#${id}`,
              SK: `BUSINESS#${id}`,
            },
          },
        },
        {
          Update: {
            TableName: conf.table,
            Key: {
              PK: `USER#${username}`,
              SK: `USER#${username}`,
            },
            UpdateExpression: 'REMOVE #bus.#id',
            ExpressionAttributeNames: {
              '#bus': 'Businesses',
              '#id': id,
            },
          },
        },
      ],
    };
    db.transactWrite(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },

  // Taxes
  createTax: (req, res) => {
    const tempTax = new Tax(req.body);
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${req.body.businessId}`,
        SK: `BUSINESS#${req.body.businessId}`,
      },
      UpdateExpression: 'SET #taxes.#id = :t',
      ExpressionAttributeNames: {
        '#taxes': 'Taxes',
        '#id': tempTax.getId(),
      },
      ExpressionAttributeValues: {
        ':t': tempTax.toItem(),
      },
    };
    db.update(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(201);
    });
  },

  deleteTax: (req, res) => {
    const { businessId, id } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `BUSINESS#${businessId}`,
      },
      UpdateExpression: 'REMOVE #tax.#id',
      ExpressionAttributeNames: {
        '#tax': 'Taxes',
        '#id': id,
      },
    };
    db.update(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },
};

module.exports = BusinessController;
