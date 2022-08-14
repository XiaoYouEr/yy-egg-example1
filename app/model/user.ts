import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    age: INTEGER,
    created_at: DATE,
    updated_at: DATE,
    password: STRING(50),
  });
  return User;
};

