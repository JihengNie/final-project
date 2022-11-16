insert into "accounts" ("username", "photoUrl", "hashedPassword")
values ('Admin', '/images/Blue.png', 'password'),
('Jane Smith', '/images/example.jpg', 'password'),
('Hippo Smith', '/images/example1.png', 'password'),
('Bro Smith', '/images/example2.jpg', 'password' ),
('Foo Smith', '/images/example3.png', 'password');

insert into "ratings" ("whoRated", "ratedWho", "rating")
values (1, 2, 5),
(1, 3, 5),
(1, 4, 5),
(1, 5, 5);
