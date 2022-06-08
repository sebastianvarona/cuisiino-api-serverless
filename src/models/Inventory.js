const ULID = require('ulid');

class Inventory {
  constructor({
    businessId,
    date,
    name,
    description,
    quantity,
    cost,
    supplier,
  }) {
    this.businessId = businessId;
    this.date = date;
    this.id = ULID.ulid();
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.cost = cost;
    this.supplier = supplier;
  }

  getKey() {
    return {
      PK: `BUSINESS#${this.businessId}`,
      SK: `INVENTORY#${this.date}`,
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
      Quantity: this.quantity,
      Cost: this.cost,
      Supplier: this.supplier,
    };
  }
}

const inventoryToObj = (Item) => {
  return {
    businessId: Item.BusinessId,
    date: Item.Date,
    id: Item.Id,
    name: Item.Name,
    description: Item.Description,
    quantity: Item.Quantity,
    cost: Item.Cost,
    supplier: Item.Supplier,
  };
};

module.exports = {
  Inventory,
  inventoryToObj,
};
