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

app.get('/api/other-accounts/', (req, res, next) => {
  const sql = `
    select "username"
    from "accounts"
    where "username" != 'Admin'
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/accounts/:username', (req, res, next) => {
  const sql = `
    select "accountId",
    "username",
    "photoUrl",
    round(avg("rating"), 2) as "currentRating"
    from "accounts"
    left join "ratings"
    ON "accountId" = "ratedWho"
    where "username" = $1
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

// ---------------------------- POST REQUESTS ---------------------//

app.post('/api/uploads', uploadsMiddleware, (req, res, next) => {
  const { newUsername } = req.body;
  if (!newUsername) {
    throw new ClientError(400, 'username is a required field');
  }
  const imgUrl = `/images/${req.file.filename}`;
  const sql = `
  insert into "accounts" ("username", "photoUrl")
  values ($1, $2)
  returning *
  `;
  const params = [newUsername, imgUrl];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/uploads/comments', (req, res, next) => {
  const { whoComment, commentWho, comment } = req.body;
  if (!comment) {
    res.json({ error: 'Comment is empty' });
  }
  const sql = `
    insert into "comments" ("whoComment", "commentWho", "comment")
    values ($1, $2, $3)
    returning *
    `;
  const params = [whoComment, commentWho, comment];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/uploads/ratings', (req, res, next) => {
  let { whoRated, ratedWho, rating } = req.body;
  rating = Number(rating);
  if (!ratedWho) {
    throw new ClientError(400, 'Who is being rated and rating are required fields');
  } else if (rating < 0 || rating > 10) {
    throw new ClientError(400, 'Rating is outside of range');
  }
  const sql = `
    insert into "ratings" ("whoRated", "ratedWho", "rating")
    values ($1, $2, $3)
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
