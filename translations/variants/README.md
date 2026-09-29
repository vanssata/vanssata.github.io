# CV variants

A variant is the same CV cut for one kind of role. It lives in
`translations/variants/<name>/{en,bg}.json` and is opened with
`?cv=<name>` (for example `https://vanssata.github.io/?cv=backend`).
The base CV in `translations/{en,bg}.json` stays untouched.

## What goes in a variant file

Only what changes. The file is laid over the base translation:

- objects merge key by key, and the variant's key order wins — that is how a
  variant reorders the skill categories;
- arrays and strings replace the base value whole (so a variant that changes
  one bullet of a role carries that role's full `experience` list);
- `null` removes a key.

Keep `en.json` and `bg.json` in lockstep (same keys); the workspace task
"Check translations in lockstep" checks the base and every variant.

## The 2-page cut

What the "2-page CV" button keeps is data, so each variant decides it:

| Field | Where | Effect in the 2-page cut |
| --- | --- | --- |
| `"short": n` | a role in `experience` | keeps the first `n` bullets; `0` keeps the header only |
| `"short": false` | a project, or a category in `skills` | dropped from the cut |
| `"brief": "…"` | a project | printed after the name instead of the full description |
| `"secondary": true` | a skill group | dropped from the cut, dimmed on screen |
| `"layout": { "experienceFirst": true }` | top level | on screen, roles come before personal projects |

Variants are marked `noindex`; the base CV is the page search engines know.

## Variants

- `backend` — senior backend / platform roles: PHP & Symfony, APIs and
  integrations, payments, data stores, testing and CI/CD first.
