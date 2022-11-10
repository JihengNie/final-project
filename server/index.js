require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const uploadsMiddleware = require('./uploads-middleware');

const app = express();

app.use(staticMiddleware);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());

app.get('/api/other-accounts/', (req, res, next) => {
  const sql = `
    select "username"
    from "accounts"
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/accounts/:username', (req, res, next) => {
  const sql = `
    select *
    from "accounts"
    where "username" = $1
  `;
  const username = req.params.username;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        res.status(404).json({
          error: 'No users found'
        });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch(err => next(err));
});

app.post('/api/uploads', uploadsMiddleware, (req, res, next) => {
  const { newUsername } = req.body;
  if (!newUsername) {
    throw new ClientError(400, 'username is a required field');
  }
  const imgUrl = `/images/${req.file.filename}`;
  const sql = `
  insert into "accounts" ("username", "photoUrl", "currentRating")
  values ($1, $2, '5')
  returning *
  `;
  const params = [newUsername, imgUrl];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
