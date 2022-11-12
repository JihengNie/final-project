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

// ---------------------------- GET REQUESTS ---------------------//
app.get('/api/accounts/new-ratings/:username', (req, res, next) => {
  const sql = `
    select round(avg("rating"), 2) as "updatedRating"
    from "accounts"
    left join "ratings"
    ON "accountId" = "ratedWho"
    Where "username" = $1
    group by "accountId"
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

// ---------------------------- PUT (UPDATE) REQUESTS ---------------------//

app.put('/api/accounts/new-rating/:username&:newRating', (req, res, next) => {
  const sql = `
    UPDATE "accounts"
    SET "currentRating" = $2
    WHERE "username" = $1
    returning *
  `;
  const username = req.params.username;
  const newRating = req.params.newRating;
  const params = [username, newRating];
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

// ---------------------------- POST REQUESTS ---------------------//

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

app.post('/api/uploads/ratings/sign-up', uploadsMiddleware, (req, res, next) => {
  const { ratedWho } = req.body;
  if (!ratedWho) {
    throw new ClientError(400, 'Who is being rated is a required field');
  }
  const sql = `
    insert into "ratings" ("whoRated", "ratedWho", "rating")

    SELECT 1 as "whoRated", "ratedWho", 5 as "rating"
    from
    (SELECT "username",
      "accountId" as "ratedWho"
    from "accounts"
    where "username" = $1) as "a"
    returning *;
  `;
  const params = [ratedWho];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/uploads/ratings', uploadsMiddleware, (req, res, next) => {
  let { whoRated, ratedWho, rating } = req.body;
  rating = Number(rating);
  if (!whoRated || !ratedWho) {
    throw new ClientError(400, 'Who rated, who is being rated. and rating are required fields');
  } else if (rating < 0 || rating > 10) {
    throw new ClientError(400, 'Rating is outside of range');
  }
  const sql = `
    insert into "ratings" ("whoRated", "ratedWho", "rating")

    SELECT "whoRated", "ratedWho", $3 as "rating"
    from
    (SELECT "username",
      "accountId" as "whoRated",
      1 as "joinId"
    from "accounts"
    where "username" = $1) as "a"

    join

    (SELECT "username",
      "accountId" as "ratedWho",
      1 as "joinId"
    from "accounts"
    where "username" = $2) as "b"

    using ("joinId")
    returning *
    ;
  `;
  const params = [whoRated, ratedWho, rating];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

// ---------------------------- END REQUESTS ---------------------//

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
