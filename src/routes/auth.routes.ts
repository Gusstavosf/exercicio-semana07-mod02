import {Router, Response, Request} from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const authRouter = Router();

const UserRepositoy = AppDataSource.getRepository(User);

authRouter.post('/', async (req: Request, res: Response) => {
    try{
        const userBody = req.body;

        const user = await UserRepositoy.findOne({
            where: {
                email: userBody.email,
            }
        })
        if(!user){
            res.status(401).json('Usuário e/ou senha inválidos');
            return
        }
        const valido = await bcrypt.compare(userBody.senha, user.senha);

        if(valido){

            const payload = {
                email: user.email,
                userId: user.id
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

            res.status(200).json({token: token});
            return
        }else{
            res.status(401).json('Usuário e/ou senha inválidos');
            return
        }

    }catch(error){
        res.status(500).json('Não foi possível criar o usuário');
    }
})

export default authRouter