insert into "accounts" ("username", "photoUrl", "currentRating")
values ('Admin', '/images/Blue.png', 5),
('Jane Smith', '/images/example.jpg', 3.5),
('Hippo Smith', '/images/example1.png', 1),
('Bro Smith', '/images/example2.jpg', .5 ),
('Foo Smith', '/images/example3.png', 5);

insert into "ratings" ("whoRated", "ratedWho", "rating")
values (1, 2, 5),
(1, 3, 5),
(1, 4, 5),
(1, 5, 5);
