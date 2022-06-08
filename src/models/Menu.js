const { nanoid } = require('nanoid');

class Menu {
  constructor({ businessId, name }) {
    this.businessId = businessId;
    this.id = nanoid(10);
    this.name = name;
    this.items = {};
  }

  getKey() {
    return {
      PK: `BUSINESS#${this.businessId}`,
      SK: `MENU#${this.id}`,
    };
  }

  getId() {
    return this.id;
  }

  toItem() {
    return {
      ...this.getKey(),
      BusinessId: this.businessId,
      Id: this.id,
      Name: this.name,
      Items: this.items,
    };
  }
}

class Item {
  constructor({ name, price }) {
    this.id = nanoid(8);
    this.name = name;
    this.price = price;
  }

  getId() {
    return this.id;
  }

  toItem() {
    return {
      Id: this.id,
      Name: this.name,
      Price: this.price,
    };
  }
}

const menuToObj = (Item) => {
  return {
    businessId: Item.BusinessId,
    id: Item.Id,
    name: Item.Name,
    items: parseItems(Item.Items),
  };
};

const parseItems = (items) => {
  const parsed = {};
  for (const [id, item] of Object.entries(items)) {
    parsed[id] = {
      id: item.Id,
      name: item.Name,
      price: item.Price,
    };
  }
  return parsed;
};

module.exports = {
  Menu,
  Item,
  menuToObj,
};
