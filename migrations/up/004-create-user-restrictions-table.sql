-- user_restrictions
CREATE TABLE public.user_restrictions(
    id SERIAL,
    "action" VARCHAR(16) NOT NULL,
    "subject" VARCHAR(16) NOT NULL,
    initiator_user_id INT,
    restricted_user_id INT,

    CONSTRAINT "pk__user_restrictions__id" PRIMARY KEY(id),
    CONSTRAINT "fk__user_restrictions__initiator_user_id" FOREIGN KEY(initiator_user_id)
        REFERENCES public.users(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT "fk__user_restrictions__restricted_user_id" FOREIGN KEY(restricted_user_id)
        REFERENCES public.users(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);
