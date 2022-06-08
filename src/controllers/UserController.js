const conf = require('../config/conf');
const { User, userToObj } = require('../models/User');

const db = conf.database;

const UserController = {
  getUser: (req, res) => {
    const { username } = req.query;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `USER#${username}`,
        SK: `USER#${username}`,
      },
    };
    db.get(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      if (!data.Item) return res.sendStatus(404);
      res.status(200).json(userToObj(data.Item));
    });
  },

  createUser: (req, res) => {
    const tempUser = new User(req.body);
    const params = {
      TableName: conf.table,
      Item: tempUser.toItem(),
      ConditionExpression: 'attribute_not_exists (PK)',
    };
    db.put(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(201);
    });
  },

  updateUser: (req, res) => {
    const { username, name, email, password } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `USER#${username}`,
        SK: `USER#${username}`,
      },
      UpdateExpression: 'SET #name = :n, #email = :e, #password = :p',
      ExpressionAttributeNames: {
        '#name': 'Name',
        '#email': 'Email',
        '#password': 'Password',
      },
      ExpressionAttributeValues: {
        ':n': name,
        ':e': email,
        ':p': password,
      },
    };

    db.update(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },

  deleteUser: (req, res) => {
    const { username } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `USER#${username}`,
        SK: `USER#${username}`,
      },
    };
    db.delete(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },
};

module.exports = UserController;
