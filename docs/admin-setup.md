# Admin page set-up (Supabase)

The website is static (GitHub Pages), so contact enquiries and job applications are
stored in a free **Supabase** project. The private page **/admin** lists them.

Security model:

- Website visitors use the public *anon* key. Database rules only let them **add** a
  submission and upload a CV. They can never read anything.
- Only the admin email listed in `supabase/setup.sql` (`infozinfity@gmail.com`) can
  read, update or delete submissions and open CVs.

## One-time set-up (about 10 minutes)

1. Create a free account at <https://supabase.com> and a **New project**
   (any name, e.g. `zinfity-website`; pick the Mumbai/Singapore region).
2. **SQL Editor → New query** → paste all of `supabase/setup.sql` → **Run**.
3. **Authentication → Users → Add user → Create new user**
   - Email: `infozinfity@gmail.com`, choose a strong password, tick *Auto confirm*.
4. **Authentication → Sign In / Providers → Email**: turn **off** “Allow new users to sign up”.
5. **Project Settings → API**: copy the **Project URL** and the **anon public** key.
6. In GitHub: repository → **Settings → Secrets and variables → Actions → Variables**
   → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with those values.
7. Re-run the deploy (push to `main` or *Actions → Deploy → Run workflow*).

For local development put the same two values in a `.env` file (see `.env.example`).

## Using it

Open `https://<your-site>/admin`, sign in, and you’ll see two tabs:
**Contact enquiries** and **Job applications** — with search, status
(new / contacted / closed), reply-by-email, open CV and delete.

The page is not linked anywhere on the site and is marked `noindex`.
