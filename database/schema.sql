set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."accounts" (
	"accountId" serial NOT NULL,
	"username" TEXT NOT NULL,
	"photoUrl" TEXT NOT NULL,
	"currentRating" DECIMAL NOT NULL,
	"happyLevel" TEXT NOT NULL,
	CONSTRAINT "accounts_pk" PRIMARY KEY ("accountId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."comments" (
	"commentId" serial NOT NULL,
	"comment" TEXT NOT NULL,
	"whoComment" int NOT NULL,
	"commentWho" int NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."followers" (
	"follower" int NOT NULL,
	"following" int NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."ratings" (
	"ratingId" serial NOT NULL,
	"whoRated" int NOT NULL,
	"ratedWho" int NOT NULL,
	"rating" int NOT NULL
) WITH (
  OIDS=FALSE
);




ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("whoComment") REFERENCES "accounts"("accountId");
ALTER TABLE "comments" ADD CONSTRAINT "comments_fk1" FOREIGN KEY ("commentWho") REFERENCES "accounts"("accountId");

ALTER TABLE "followers" ADD CONSTRAINT "followers_fk0" FOREIGN KEY ("follower") REFERENCES "accounts"("accountId");
ALTER TABLE "followers" ADD CONSTRAINT "followers_fk1" FOREIGN KEY ("following") REFERENCES "accounts"("accountId");

ALTER TABLE "ratings" ADD CONSTRAINT "ratings_fk0" FOREIGN KEY ("whoRated") REFERENCES "accounts"("accountId");
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_fk1" FOREIGN KEY ("ratedWho") REFERENCES "accounts"("accountId");
