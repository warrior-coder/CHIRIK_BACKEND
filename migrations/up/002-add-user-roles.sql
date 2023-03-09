-- roles
CREATE TABLE public.roles(
    id SERIAL,
    "value" VARCHAR(32) NOT NULL,

    CONSTRAINT "pk__roles__id" PRIMARY KEY(id),
    CONSTRAINT "unique__roles__value" UNIQUE("value")
);

-- users_roles
CREATE TABLE public.users_roles(
    user_id INT,
    role_id INT,

    CONSTRAINT "pk__users_roles__user_id__role_id" PRIMARY KEY(user_id, role_id),
    CONSTRAINT "pk__users_roles__user_id" FOREIGN KEY(user_id)
        REFERENCES public.users(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    CONSTRAINT "pk__users_roles__role_id" FOREIGN KEY(role_id)
        REFERENCES public.roles(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);
