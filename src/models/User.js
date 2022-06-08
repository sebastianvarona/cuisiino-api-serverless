class User {
  constructor({ username, email, name, password }) {
    this.username = username;
    this.email = email;
    this.name = name;
    this.password = password;
    this.businesses = {};
  }

  getKey() {
    return {
      PK: `USER#${this.username}`,
      SK: `USER#${this.username}`,
    };
  }

  toItem() {
    return {
      ...this.getKey(),
      Username: this.username,
      Email: this.email,
      Name: this.name,
      Password: this.password,
      Businesses: this.businesses,
    };
  }
}

const userToObj = (Item) => {
  return {
    username: Item.Username,
    email: Item.Email,
    name: Item.Name,
    businesses: parseBusinesses(Item.Businesses),
  };
};

const parseBusinesses = (businesses) => {
  const parsed = {};

  for (const [id, item] of Object.entries(businesses)) {
    parsed[id] = {
      id: item.Id,
      date: item.Date,
      name: item.Name,
    };
  }

  return parsed;
};

module.exports = { User, userToObj };
