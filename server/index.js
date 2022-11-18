require('dotenv/config');
const pg = require('pg');
const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const uploadsMiddleware = require('./uploads-middleware');
const authorizationMiddleware = require('./authorization-middleware');

const app = express();

app.use(staticMiddleware);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());

// ---------------------------- Auth ---------------------//

app.post('/api/auth/sign-up', uploadsMiddleware, (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2.hash(password)
    .then(hashPassword => {
      const imgUrl = `/images/${req.file.filename}`;
      const sql = `
      insert into "accounts" ("username", "photoUrl","hashedPassword")
      values ($1, $2, $3)
      returning*;`;
      const values = [username, imgUrl, hashPassword];
      db.query(sql, values)
        .then(result => {
          const sql = `
              insert into "ratings" ("whoRated", "ratedWho", "rating")
              values ('1', $1, '5')
              returning *
          `;
          const params = [result.rows[0].accountId];
          db.query(sql, params)
            .catch(err => next(err));
          res.json(result.rows[0]);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "accountId",
           "hashedPassword"
      from "accounts"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [account] = result.rows;
      if (!account) {
        throw new ClientError(401, 'invalid login');
      }
      const { accountId, hashedPassword } = account;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { accountId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, account: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

// ---------------------------- GET REQUESTS ---------------------//

app.get('/api/comments/:username', (req, res, next) => {
  const sql = `
    SELECT "comment",
    "whoComment",
    "photoUrl"
    FROM
      (SELECT "comment",
        "whoComment"
        FROM "comments"
        LEFT JOIN "accounts"
        ON "accountId" = "commentWho"
        where "username" = $1) as "a"
    LEFT JOIN
      "accounts" as "b"
    ON "a"."whoComment" = "b"."accountId";
  `;
  const username = req.params.username;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        res.json([{
          whoComment: 1,
          photoUrl: '/images/Blue.png',
          comment: 'No one has left you a comment'
        }]);
      } else {
        res.json(result.rows);
      }
    })
    .catch(err => next(err));
});

app.get('/api/followers/:accountId', (req, res, next) => {
  const accountId = req.params.accountId;
  const sql = `
      SELECT DISTINCT
      "username",
      "following"
      FROM "accounts"
      JOIN "followers"
      ON "accountId" = "follower"
      WHERE "accountId" = $1

  `;
  const params = [accountId];
  db.query(sql, params)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

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
    throw new ClientError(400, 'Comment is empty');
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

app.post('/api/uploads/followers', (req, res, next) => {
  const { follower, following } = req.body;
  if (!following) {
    throw new ClientError(400, 'Who you are following is empty');
  }
  const sql = `
    insert into "followers" ("follower", "following")
    values ($1, $2)
    returning *
    `;
  const params = [follower, following];
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
