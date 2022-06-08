const ULID = require('ulid');

class Staff {
  constructor({ businessId, full_name, date, views }) {
    this.businessId = businessId;
    this.id = ULID.ulid();
    this.full_name = full_name;
    this.date = date;
    this.views = views;
  }

  getKey() {
    return {
      PK: `BUSINESS#${this.businessId}`,
      SK: `STAFF#${this.id}`,
    };
  }

  toItem() {
    return {
      ...this.getKey(),
      BusinessId: this.businessId,
      Id: this.id,
      FullName: this.full_name,
      Date: this.date,
      Views: this.views,
    };
  }
}

const staffToObj = (Item) => {
  return {
    businessId: Item.BusinessId,
    id: Item.Id,
    full_name: Item.FullName,
    date: Item.Date,
    views: Item.Views,
  };
};

module.exports = {
  Staff,
  staffToObj,
};
