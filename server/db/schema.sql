DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS plans;

CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  monthly_price INTEGER NOT NULL,
  coupon_value INTEGER NOT NULL,
  description TEXT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  plan_id INTEGER REFERENCES plans(id)
);
