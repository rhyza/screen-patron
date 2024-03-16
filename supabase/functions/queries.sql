-- Do not run this file directly.
-- This is a place to save triggers and functions entered manually in Supabase's SQL Editor.

-- CREATE PUBLIC.USER WHEN AUTH.USER IS CONFIRMED - USE THIS
-- UPDATE PUBCIC.USER WHEN AUTH.USER'S EMAIL CHANGES
-- inserts a row into public.user
-- updates the email of public.user row
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    if new.confirmed_at is not null and old.confirmed_at is null then
        insert into public.user (id, email)
        values (new.id::text, new.email);
    end if;
    if new.email is not old.email then
        update public.user
        set email = new.email
        where id::text = id
    end if;
    return new;
end;
$$;

-- trigger the function every time a user is updated
create trigger on_email_verified
after update on auth.users for each row execute procedure public.handle_new_user();


-- CREATE PUBLIC.USER WHEN AUTH.USER IS CREATED
-- inserts a row into public.user
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user (id, email)
  values (new.id::text, new.email);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TESTING QUERIES
-- query to confirm email
UPDATE auth.users SET email_confirmed_at = '2024-03-16 19:16:46.066819+00' WHERE id = '5e0dbeb9-a60b-4f69-9297-d6e319d31a39'
