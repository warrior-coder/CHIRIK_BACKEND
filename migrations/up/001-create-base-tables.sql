-- users
CREATE TABLE public.users(
    id SERIAL,
    "name" VARCHAR(32) NOT NULL,
    email VARCHAR(64) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT "pk__users__id" PRIMARY KEY(id),
    CONSTRAINT "unique__users__email" UNIQUE(email)
);

-- records
CREATE TABLE public.records(
    id SERIAL,
    "text" TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    author_id INT,

    CONSTRAINT "pk__records__id" PRIMARY KEY(id),
    CONSTRAINT "fk__records__author_id" FOREIGN KEY(author_id)
        REFERENCES public.users(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

-- record_comments
CREATE TABLE record_comments(
    id SERIAL,
    "text" TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    author_id INT,
    record_id INT,

    CONSTRAINT "pk__record_comments__id" PRIMARY KEY(id),
    CONSTRAINT "fk__record_comments__author_id" FOREIGN KEY(author_id)
        REFERENCES public.users(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT "fk__records_comments__record_id" FOREIGN KEY(record_id)
        REFERENCES public.records(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

-- record_images
CREATE TABLE public.record_images(
    id SERIAL,
    file_name VARCHAR(128) NOT NULL,
    record_id INT,

    CONSTRAINT "pk__record_images__id" PRIMARY KEY(id),
    CONSTRAINT "unique__record_images__file_name" UNIQUE (file_name),
    CONSTRAINT "fk__record_images__record_id" FOREIGN KEY(record_id)
        REFERENCES public.records(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

-- record_likes
CREATE TABLE public.record_likes(
    id SERIAL,
    record_id INT,
    user_id INT,

    CONSTRAINT "pk__record_likes__id" PRIMARY KEY(id),
    CONSTRAINT "fk__record_likes__user_id" FOREIGN KEY(user_id)
        REFERENCES public.users(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT "fk__record_likes__record_id" FOREIGN KEY(record_id)
        REFERENCES public.records(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);
