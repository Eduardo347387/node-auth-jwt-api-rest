import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prima from '../models/user';
import { comparePasswords, generateToken } from "../services/auth.service";


export const register = async (req:Request,res:Response): Promise<void> => {
    const { email, password } = req.body
    try {
        if (!email) {
            res.status(400).json({ error: 'El gmail es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ error: 'El password es obligatorio' })
            return
        }

        const hashedPassword = await hashPassword(password)
        const user = await prima.create(
            {
                data: {
                    email,
                    password:hashedPassword
                }
            }
        )
        const token = generateToken(user)
        res.status(201).json({ token })

    } catch (error:any) {
    
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({message:'El gmail ingresado ya existe'})   
        }

        res.status(500).json({error:'Hubo un error en el registro'})
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    try {

        if (!email) {
            res.status(400).json({ error: 'El gmail es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ error: 'El password es obligatorio' })
            return
        }
        
        const user = await prima.findUnique({ where: { email } })
        if (!user) {
            res.status(404).json({ error: 'Error en el usuario y contrasena' })
            return
        }
        const passwordMatch = await comparePasswords(password, user.password)
        if (!passwordMatch) {
            res.status(401).json({error:'Usuario o contrasena no coinsiden'})
        }
        const token = generateToken(user)
        res.status(200).json({ token })
        
    }catch(error) {
        console.log('error: ',error)
    }
}