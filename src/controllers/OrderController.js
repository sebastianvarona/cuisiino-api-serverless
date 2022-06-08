const conf = require('../config/conf');
const ULID = require('ulid');
const {
  Order,
  OrderItems,
  orderToObj,
  orderItemsToObj,
} = require('../models/Order');

const db = conf.database;

const OrderController = {
  getOrders: (req, res) => {
    const { businessId, id } = req.query;
    const params = {
      TableName: conf.table,
      KeyConditionExpression: 'PK = :pk AND begins_with (SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `BUSINESS#${businessId}`,
        ':sk': `ORDER#${id}`,
      },
    };
    db.query(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      const ordersArray = [];
      for (const orderItem of data.Items) {
        ordersArray.push(orderToObj(orderItem));
      }
      res.status(200).json(ordersArray);
    });
  },

  getOrderItems: (req, res) => {
    const { businessId, orderId } = req.query;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `ORDERITEMS#${orderId}`,
      },
    };

    db.get(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.status(200).json(orderItemsToObj(data.Item));
    });
  },

  createOrder: (req, res) => {
    const {
      businessId,
      date,
      subtotal,
      taxes,
      waiter,
      tip,
      status,
      itemsAmount,
      items,
    } = req.body;
    const id = ULID.ulid();
    const total = subtotal + taxes + tip;
    const tempOrder = new Order({
      businessId,
      date,
      id,
      total,
      status,
      itemsAmount,
    });
    const tempOrderItems = new OrderItems({
      businessId,
      date,
      id,
      subtotal,
      taxes,
      waiter,
      tip,
      status,
      items,
    });
    const params = {
      TransactItems: [
        {
          Put: {
            TableName: conf.table,
            Item: tempOrder.toItem(),
            ConditionExpression:
              'attribute_not_exists (PK) AND attribute_not_exists (SK)',
          },
        },
        {
          Put: {
            TableName: conf.table,
            Item: tempOrderItems.toItem(),
            ConditionExpression:
              'attribute_not_exists (PK) AND attribute_not_exists (SK)',
          },
        },
      ],
    };
    db.transactWrite(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(201);
    });
  },

  updateOrder: (req, res) => {
    const {
      businessId,
      date,
      subtotal,
      taxes,
      waiter,
      tip,
      status,
      itemsAmount,
    } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `ORDER#${date}`,
      },
      UpdateExpression:
        'SET #subtotal = :s, #taxes = :ta, #waiter = :wa, #tip = :ti, #status = :s, #itemsAmount = :ia',
      ExpressionAttributeNames: {
        '#subtotal': 'Subtotal',
        '#taxes': 'Taxes',
        '#waiter': 'Waiter',
        '#tip': 'Tip',
        '#status': 'Status',
        '#itemsAmount': 'ItemsAmount',
      },
      ExpressionAttributeValues: {
        ':s': subtotal,
        ':ta': taxes,
        ':wa': waiter,
        ':ti': tip,
        ':s': status,
        ':ia': itemsAmount,
      },
    };
    db.update(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },

  deleteOrder: (req, res) => {
    const { businessId, id } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `ORDER#${id}`,
      },
    };
    db.delete(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },
};

module.exports = OrderController;
