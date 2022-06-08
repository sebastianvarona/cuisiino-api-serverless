const conf = require('../config/conf');
const { Menu, Item, menuToObj } = require('../models/Menu');

const db = conf.database;

const MenuController = {
  getMenus: (req, res) => {
    const { businessId, id } = req.query;
    const params = {
      TableName: conf.table,
      KeyConditionExpression: 'PK = :pk AND begins_with (SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `BUSINESS#${businessId}`,
        ':sk': `MENU#${id}`,
      },
    };
    db.query(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      const menusArray = [];
      for (const menuItem of data.Items) {
        menusArray.push(menuToObj(menuItem));
      }
      res.status(200).json(menusArray);
    });
  },

  createMenu: (req, res) => {
    const { businessId, name } = req.body;
    const tempMenu = new Menu({ businessId, name });
    const menuId = tempMenu.getId();
    const params = {
      TableName: conf.table,
      Item: tempMenu.toItem(),
      ConditionExpression:
        'attribute_not_exists (PK) AND attribute_not_exists (SK)',
    };
    db.put(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.status(201).json({ id: menuId });
    });
  },

  updateMenu: (req, res) => {
    const { businessId, id, name } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `MENU#${id}`,
      },
      UpdateExpression: 'SET #name = :n',
      ExpressionAttributeNames: {
        '#name': 'Name',
      },
      ExpressionAttributeValues: {
        ':n': name,
      },
    };
    db.update(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },

  deleteMenu: (req, res) => {
    const { businessId, id } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `MENU#${id}`,
      },
    };
    db.delete(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },

  createItem: (req, res) => {
    const { businessId, menuId, name, price } = req.body;
    const tempItem = new Item({ name, price });
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `MENU#${menuId}`,
      },
      UpdateExpression: 'SET #items.#id = :i',
      ExpressionAttributeNames: {
        '#items': 'Items',
        '#id': tempItem.getId(),
      },
      ExpressionAttributeValues: {
        ':i': tempItem.toItem(),
      },
    };
    db.update(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },

  deleteItem: (req, res) => {
    const { businessId, menuId, id } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `MENU#${menuId}`,
      },
      UpdateExpression: 'REMOVE #items.#id',
      ExpressionAttributeNames: {
        '#items': 'Items',
        '#id': id,
      },
    };
    db.update(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },
};

module.exports = MenuController;
