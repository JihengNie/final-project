# Rating Fuze

A full-stack application that allows users rate other users. Developed utilizing the PERN Stack (PostgreSQL, Express, React, Node)

## Why I Built This

I chose this project to improve upon my front-end development skills, particularly responsive design, DOM manipulation, CSS styling/transitions, and JavaScript data manipulation. As a life-long fan of Yu-Gi-Oh, I found this project to be a wonderful development experience, as I got to create an interactive and visual display of one of my favorite games of all time.

## Technologies Used
- React
- Node.js
- Express.js
- JavaScript
- HTML5
- CSS3
- Babel
- Webpack
- Argon 2
- JSON Web Token
- Dotenv
## Live Demo

Try the application [here](https://rating-fuze.jihengnie.dev/#sign-up)!

## Features

- User can create a profile
- User can view their profile
- User can view other user's profiles
- User can rate other user's profiles
- User can leave a comment
- User can view their comment
- User can follow a profile
- User can view their followed profiles
- User can view other user's single profiles
- User can log in
- User can log out

## Preview
#### User can sign in
![sign in](https://user-images.githubusercontent.com/109745413/204624181-59d3e39c-6eda-4f63-b116-645518a8ed21.gif)

#### User can rate a profile and leave a comment
![rating and commenting](https://user-images.githubusercontent.com/109745413/204624185-62ce18cb-4271-4d0a-ab37-fb560b680b2b.gif)

#### User can view the comment they left
![Viewing comments](https://user-images.githubusercontent.com/109745413/204624183-d23865fe-03eb-4e5f-91c2-c8ae12fb754b.gif)

#### User can follow a profile
![following accounts](https://user-images.githubusercontent.com/109745413/204624184-66563fff-bbc3-4415-b383-e2f7d4bf6287.gif)



## Getting Started

1. Clone the repository
```
git clone https://github.com/arjunkahlon/deck-study.git
```
2. Install dependencies with Node Package Manager
```
npm install
```
3. Create local .env file from provided example template.
```
cp .env.example .env
```
4. Set the TOKEN_SECRET from changeme on your .env file
```
TOKEN_SECRET = 'replace changeme'
```
5. Start PostgreSQL
```
sudo service postgresql start
```
6. Create a database and update the name of your database in your .env file
```
createdb 'name of database'
```
7. Initialize database with schema.sql and import starting data from data.sql
```
npm run db:import
```
8. Start the project. Project can be viewed at http://localhost:3000 on your browser
```
npm run dev
```
9. Start pgweb to view our database
```
pgweb --db='name of database'
