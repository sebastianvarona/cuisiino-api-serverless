const { nanoid } = require('nanoid');

class Business {
  constructor({ username, name }) {
    this.id = nanoid(15);
    this.name = name;
    this.date = Date.now();
    this.username = username;
    this.taxes = {};
  }

  getKey() {
    return {
      PK: `BUSINESS#${this.id}`,
      SK: `BUSINESS#${this.id}`,
    };
  }

  toItem() {
    return {
      ...this.getKey(),
      Id: this.id,
      Name: this.name,
      Date: this.date,
      Username: this.username,
      Taxes: this.taxes,
    };
  }

  getId() {
    return this.id;
  }

  toMap() {
    return {
      Id: this.id,
      Name: this.name,
      Date: this.date,
    };
  }
}
const businessToObj = (Item) => {
  return {
    username: Item.Username,
    id: Item.Id,
    name: Item.Name,
    date: Item.Date,
    taxes: parseTaxes(Item.Taxes),
  };
};

class Tax {
  constructor({ businessId, name, rate }) {
    this.businessId = businessId;
    this.id = Date.now();
    this.name = name;
    this.rate = rate;
  }

  getId() {
    return this.id;
  }

  toItem() {
    return {
      BusinessId: this.businessId,
      Id: this.id,
      Name: this.name,
      Rate: this.rate,
    };
  }
}

const parseTaxes = (items) => {
  const parsed = {};
  for (const [id, item] of Object.entries(items)) {
    parsed[id] = {
      businessId: item.BusinessId,
      id: item.Id,
      name: item.Name,
      rate: item.Rate,
    };
  }
  return parsed;
};

module.exports = {
  Business,
  Tax,
  businessToObj,
};
