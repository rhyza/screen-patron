-- Do not run this file directly.
-- This is a place to save triggers and functions entered manually in Supabase's SQL Editor.

-- CREATE PUBLIC.USER WHEN AUTH.USER IS CONFIRMED - use this
-- inserts a row into public.user
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    if new.confirmed_at is not null and old.confirmed_at is null then
        insert into public.users (id, email)
        values (new.id::text, new.email);
    end if;
    return new;
end;
$$;

-- UPDATE PUBCIC.USER WHEN AUTH.USER'S EMAIL CHANGES - not working
-- updates the email of public.user row
create function public.handle_email_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    if new.email_confirmed_at is not null and new.email is not old.email then
        update public.users
        set email = new.email
        where id = new.id::text
    end if;
    return new;
end;
$$;

-- trigger the function every time a user is updated
create trigger on_email_verified
after update on auth.users for each row execute procedure public.handle_new_user();


-- CREATE PUBLIC.USERS WHEN AUTH.USER IS CREATED
-- inserts a row into public.users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
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

UPDATE auth.users SET email = 'new-email@test.com' WHERE id = '5e0dbeb9-a60b-4f69-9297-d6e319d31a39'
