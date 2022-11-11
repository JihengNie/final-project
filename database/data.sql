insert into "accounts" ("username", "photoUrl", "currentRating")
values ('John Smith', '/images/Blue.png', 3),
('Jane Smith', '/images/example.jpg', 3.5),
('Hippo Smith', '/images/example1.png', 1),
('Bro Smith', '/images/example2.jpg', .5 ),
('Foo Smith', '/images/example3.png', 5);

insert into "ratings" ("whoRated", "ratedWho", "rating")
values (1, 5, 10),
(2, 5, 5),
(5, 5, 6),
(1, 2, 2),
(2, 2, 10);
