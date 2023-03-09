CREATE OR REPLACE FUNCTION USER_RESTRICTIONS__BEFORE_INSERT__TRIGGER__FUNCTION()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$
BEGIN
    IF NEW.initiator_user_id = NEW.restricted_user_id THEN
        RAISE 'User cannot restrict himself.';
    END IF;

    IF EXISTS(
        SELECT ur."action", ur."subject", ur.initiator_user_id, ur.restricted_user_id
        FROM public.user_restrictions AS ur
        WHERE ur."action" = NEW."action"
            AND ur."subject" = NEW."subject"
            AND ur.initiator_user_id = NEW.initiator_user_id
            AND ur.restricted_user_id = NEW.restricted_user_id
    ) THEN
        RAISE 'Restriction already exists.';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER user_restrictions__before_insert__trigger
BEFORE INSERT
ON public.user_restrictions
FOR EACH ROW
EXECUTE PROCEDURE USER_RESTRICTIONS__BEFORE_INSERT__TRIGGER__FUNCTION();
