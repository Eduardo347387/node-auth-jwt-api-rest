import { error } from 'console'
import express, { NextFunction, Request, Response } from 'express'
import Jwt  from 'jsonwebtoken'
import { createUser, deleteUser, getAllUser, getUserById, updateUser } from '../controllers/userController'
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

const authenticateToken = (req:Request,res:Response,next:NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({error:'No autorizado'})
    }
    Jwt.verify(token, JWT_SECRET, (err,decoded) => {
        if (err) {
            console.log('ERROR EN LA AUTENTICACION: ', error);
            return res.status(403).json({error:'No tiene acceso a este recurso'})
        }
        next()
    })
}

router.post('/',authenticateToken, createUser)
router.get('/', authenticateToken, getAllUser)
router.get('/:id',authenticateToken, getUserById)
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id',authenticateToken, deleteUser)

export default router;
