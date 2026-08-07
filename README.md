# Aegis AI Compliance
Scaffolding monorepo: Next.js + Express/TypeScript + PostgreSQL.

## Inicio
```bash
cp .env.example .env
npm install
docker compose up -d
npm run migrate
npm run dev --workspace apps/api # terminal 1
npm run dev --workspace apps/web # terminal 2
```
PostgreSQL queda disponible en `localhost:5432` y la variable `DATABASE_URL` debe apuntar a `postgres://aegis:aegis@localhost:5432/aegis`. Para detenerlo: `docker compose down` (borra también el volumen con `docker compose down -v`).
La web usa `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:4000`) y el API permite ese origen mediante `WEB_ORIGIN`. No guardes tokens en cookies o logs: el panel los mantiene únicamente en `sessionStorage` y los elimina al cerrar sesión.

### API
- `POST /auth/register` `{email,password (12+),companyName}`; `POST /auth/login`
- `GET|POST /tools`, `PATCH|DELETE /tools/:id` (Bearer JWT)
- `POST /classify` `{description,toolId?}` (Bearer JWT). Devuelve una única etiqueta `riskLevel`.

LLM usa `LLM_PROVIDER` y claves env; sin clave funciona mock determinista. No se guardan secretos en logs. Las evaluaciones son append-only por aplicación (sin UPDATE/DELETE público), con retención de 6 meses.

## Calidad
`npm test`, `npm run typecheck`, `npm run build --workspace apps/api`. CI ejecuta tests y typecheck.
