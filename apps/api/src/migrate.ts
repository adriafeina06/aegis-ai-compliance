import fs from 'node:fs'; import {pool} from './db'; import path from 'node:path';
(async()=>{const sql=fs.readFileSync(path.resolve(process.cwd(),'packages/db/migrations/001_initial.sql'),'utf8');await pool.query(sql);await pool.end();console.log('Migration complete')})().catch(e=>{console.error(e);process.exit(1)});
