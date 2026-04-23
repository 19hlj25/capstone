
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS businesses;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS plans;

--stores plan options and details
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  monthly_price INTEGER NOT NULL,
  coupon_value INTEGER NOT NULL,
  description TEXT NOT NULL
);
--stores users and account info
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  plan_id INTEGER REFERENCES plans(id)
);

--stores small biz that users can browse in the app
--each biz includes basic display information for the frontend
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL
);
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  UNIQUE (user_id, business_id)
);