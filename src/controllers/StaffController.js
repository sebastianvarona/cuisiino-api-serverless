const conf = require('../config/conf');
const { Staff, staffToObj } = require('../models/Staff');

const db = conf.database;

const StaffController = {
  getStaffs: (req, res) => {
    const { businessId, id } = req.query;
    const params = {
      TableName: conf.table,
      KeyConditionExpression: 'PK = :pk AND begins_with (SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `BUSINESS#${businessId}`,
        ':sk': `STAFF#${id}`,
      },
    };
    db.query(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      const staffsArray = [];
      for (const staffItem of data.Items) {
        staffsArray.push(staffToObj(staffItem));
      }
      res.status(200).json(staffsArray);
    });
  },

  createStaff: (req, res) => {
    const tempStaff = new Staff(req.body);
    const params = {
      TableName: conf.table,
      Item: tempStaff.toItem(),
      ConditionExpression:
        'attribute_not_exists (PK) AND attribute_not_exists (SK)',
    };
    db.put(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(201);
    });
  },

  updateStaff: (req, res) => {
    const { businessId, id, full_name, views } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `STAFF#${id}`,
      },
      UpdateExpression: 'SET #full_name = :fn, #views = :v',
      ExpressionAttributeNames: {
        '#full_name': 'Name',
        '#views': 'Views',
      },
      ExpressionAttributeValues: {
        ':fn': full_name,
        ':v': views,
      },
    };

    db.update(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },

  deleteStaff: (req, res) => {
    const { businessId, id } = req.body;
    const params = {
      TableName: conf.table,
      Key: {
        PK: `BUSINESS#${businessId}`,
        SK: `STAFF#${id}`,
      },
    };
    db.delete(params, (err, data) => {
      if (err) return res.status(err.statusCode).json(err);
      res.sendStatus(200);
    });
  },
};

module.exports = StaffController;
