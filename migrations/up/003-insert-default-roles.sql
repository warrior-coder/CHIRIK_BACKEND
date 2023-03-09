INSERT INTO public.roles("value")
VALUES ('user')
ON CONFLICT DO NOTHING;

INSERT INTO public.roles("value")
VALUES ('admin')
ON CONFLICT DO NOTHING;

