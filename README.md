# Aegis AI Compliance
Scaffolding monorepo: Next.js + Express/TypeScript + PostgreSQL.

## Inicio
`cp .env.example .env && docker compose up -d && npm install && npm run migrate`
En terminales separadas: `npm run dev --workspace apps/api` y `npm run dev --workspace apps/web`.

### API
- `POST /auth/register` `{email,password (12+),companyName}`; `POST /auth/login`
- `GET|POST /tools`, `PATCH|DELETE /tools/:id` (Bearer JWT)
- `POST /classify` `{description,toolId?}` (Bearer JWT). Devuelve una única etiqueta `riskLevel`.

LLM usa `LLM_PROVIDER` y claves env; sin clave funciona mock determinista. No se guardan secretos en logs. Las evaluaciones son append-only por aplicación (sin UPDATE/DELETE público), con retención de 6 meses.

## Calidad
`npm test`, `npm run typecheck`, `npm run build --workspace apps/api`. CI ejecuta tests y typecheck.
