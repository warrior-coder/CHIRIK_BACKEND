CREATE OR REPLACE FUNCTION RECORD_LIKES__BEFORE_INSERT__TRIGGER__FUNCTION()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$
BEGIN
    IF NOT EXISTS(
        SELECT rl.*
        FROM public.record_likes AS rl
        WHERE rl.user_id = NEW.user_id
            AND rl.record_id = NEW.record_id
    ) THEN
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$;

CREATE TRIGGER record_likes__before_insert__trigger
BEFORE INSERT
ON public.record_likes
FOR EACH ROW
EXECUTE PROCEDURE RECORD_LIKES__BEFORE_INSERT__TRIGGER__FUNCTION();
