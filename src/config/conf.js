const AWS = require('aws-sdk');

module.exports = {
  table: process.env.MAIN_TABLE,
  database: new AWS.DynamoDB.DocumentClient(),
};
