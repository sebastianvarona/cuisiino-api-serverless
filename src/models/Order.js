class Order {
  constructor({ businessId, date, id, total, status, itemsAmount }) {
    this.businessId = businessId;
    this.date = date;
    this.id = id;
    this.total = total;
    this.status = status;
    this.itemsAmount = itemsAmount;
  }

  getKey() {
    return {
      PK: `BUSINESS#${this.businessId}`,
      SK: `ORDER#${this.date}`,
    };
  }

  toItem() {
    return {
      ...this.getKey(),
      BusinessId: this.businessId,
      Date: this.date,
      Id: this.id,
      Total: this.total,
      Status: this.status,
      ItemsAmount: this.itemsAmount,
    };
  }
}

const orderToObj = (Item) => {
  return {
    businessId: Item.BusinessId,
    date: Item.Date,
    id: Item.Id,
    total: Item.Total,
    status: Item.Status,
    itemsAmount: Item.ItemsAmount,
  };
};

class OrderItems {
  constructor({
    businessId,
    date,
    id,
    subtotal,
    taxes,
    waiter,
    tip,
    status,
    items,
  }) {
    this.businessId = businessId;
    this.date = date;
    this.id = id;
    this.subtotal = subtotal;
    this.taxes = taxes;
    this.waiter = waiter;
    this.tip = tip;
    this.status = status;
    this.items = this.parseObjects(items);
  }

  getKey() {
    return {
      PK: `BUSINESS#${this.businessId}`,
      SK: `ORDERITEMS#${this.date}`,
    };
  }

  parseObjects(objects) {
    const parsed = {};
    for (const [id, object] of Object.entries(objects)) {
      parsed[id] = {
        Id: object.id,
        Name: object.name,
        Price: object.price,
        Quantity: object.quantity,
      };
    }
    return parsed;
  }

  toItem() {
    return {
      ...this.getKey(),
      BusinessId: this.businessId,
      Date: this.date,
      Id: this.id,
      Subtotal: this.subtotal,
      Taxes: this.taxes,
      Waiter: this.waiter,
      Tip: this.tip,
      Status: this.status,
      Items: this.items,
    };
  }
}

const orderItemsToObj = (Item) => {
  return {
    businessId: Item.BusinessId,
    date: Item.Date,
    id: Item.Id,
    subtotal: Item.Subtotal,
    taxes: Item.Taxes,
    waiter: Item.Waiter,
    tip: Item.Tip,
    status: Item.Status,
    items: parseItems(Item.Items),
  };
};

const parseItems = (items) => {
  const parsed = {};
  for (const [id, Item] of Object.entries(items)) {
    parsed[id] = {
      id: Item.Id,
      name: Item.Name,
      price: Item.Price,
      quantity: Item.Quantity,
    };
  }
  return parsed;
};

module.exports = {
  Order,
  OrderItems,
  orderToObj,
  orderItemsToObj,
};
