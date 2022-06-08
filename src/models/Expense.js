const ULID = require('ulid');

class Expense {
  constructor({ businessId, date, name, description, fixed, type, value }) {
    this.businessId = businessId;
    this.date = date;
    this.id = ULID.ulid();
    this.name = name;
    this.description = description;
    this.fixed = fixed;
    this.type = type;
    this.value = value;
  }

  getKey() {
    return {
      PK: `BUSINESS#${this.businessId}`,
      SK: `EXPENSE#${this.date}`,
    };
  }

  toItem() {
    return {
      ...this.getKey(),
      BusinessId: this.businessId,
      Date: this.date,
      Id: this.id,
      Name: this.name,
      Description: this.description,
      Fixed: this.fixed,
      Type: this.type,
      Value: this.value,
    };
  }
}

const expenseToObj = (Item) => {
  return {
    businessId: Item.BusinessId,
    date: Item.Date,
    id: Item.Id,
    name: Item.Name,
    description: Item.Description,
    fixed: Item.Fixed,
    type: Item.Type,
    value: Item.Value,
  };
};

module.exports = {
  Expense,
  expenseToObj,
};
