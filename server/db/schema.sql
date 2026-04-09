DROP TABLE IF EXISTS greetings;
DROP TABLE IF EXISTS users;


CREATE TABLE greetings(
    id SERIAL PRIMARY KEY,
    message text
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  plan_id INTEGER REFERENCES plans(id)
);