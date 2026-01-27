import express from 'express';

export const Router = express.Router();

Router.get('/', (req, res) => {
  console.log('Hello');
  res.send('Hello, World!');
});
