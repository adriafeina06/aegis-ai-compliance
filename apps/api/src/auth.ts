import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken'; import {Request,Response,NextFunction} from 'express';
const secret=()=>process.env.JWT_SECRET||'development-only-secret-change-me';
export const hashPassword=(p:string)=>bcrypt.hash(p,12); export const verifyPassword=(p:string,h:string)=>bcrypt.compare(p,h);
export const sign=(id:string,companyId:string)=>jwt.sign({sub:id,companyId},secret(),{expiresIn:(process.env.JWT_EXPIRES_IN||'8h') as jwt.SignOptions['expiresIn']});
export type AuthRequest=Request & {user?:{id:string,companyId:string}};
export function auth(req:AuthRequest,res:Response,next:NextFunction){const token=req.headers.authorization?.replace(/^Bearer /,''); if(!token)return res.status(401).json({error:'Autenticación requerida'}); try{const p=jwt.verify(token,secret()) as any; req.user={id:p.sub,companyId:p.companyId}; next()}catch{return res.status(401).json({error:'Token inválido'})}}
