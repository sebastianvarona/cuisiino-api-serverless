const conf = require('../config/conf');
const { Inventory, inventoryToObj } = require('../models/Inventory');

const db = conf.database;

const InventoryController = {
  getInventories: (req, res) => {
    const { businessId, date } = req.query;
    const params = {
      TableName: conf.table,
      KeyConditionExpression: 'PK = :pk AND begins_with (SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `BUSINESS#${businessId}`,
        ':sk': `INVENTORY#${date}`,
      },
    };
    db.query(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      const inventoriesArray = [];
      data.Items.forEach((item) => {
        inventoriesArray.push(inventoryToObj(item));
      });
      res.status(200).json(inventoriesArray);
    });
  },

  createInventory: (req, res) => {
    const tempInventory = new Inventory(req.body);
    const params = {
      TableName: conf.table,
      Item: tempInventory.toItem(),
      ConditionExpression: 'attribute_not_exists (PK)',
    };
    db.put(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(201);
    });
  },

  updateInventory: (req, res) => {
    const { businessId, date, name, description, quantity, cost, supplier } =
      req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `INVENTORY#${date}`,
      },
      UpdateExpression:
        'SET #name = :n, #description = :d, #quantity = :q, #cost = :c, #supplier = :s',
      ExpressionAttributeNames: {
        '#name': 'Name',
        '#description': 'Description',
        '#quantity': 'Fixed',
        '#cost': 'Type',
        '#supplier': 'Value',
      },
      ExpressionAttributeValues: {
        ':n': name,
        ':d': description,
        ':q': quantity,
        ':c': cost,
        ':s': supplier,
      },
    };

    db.update(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },

  deleteInventory: (req, res) => {
    const { businessId, date } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `INVENTORY#${date}`,
      },
    };
    db.delete(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },
};

module.exports = InventoryController;
