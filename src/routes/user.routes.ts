import {Router, Response, Request} from 'express';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcrypt';
import { User } from '../entity/User';

const userRouter = Router();

const UserRepositoy = AppDataSource.getRepository(User);

userRouter.post('/', async (req: Request, res: Response) => {
    try{
        const userBody = req.body;

        if(!userBody || !userBody.email || !userBody.name || !userBody.senha){
            res.status(400).json('Preencha todos os dados');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        let senhaCriptografada = await bcrypt.hash(userBody.senha, salt);

        userBody.senha = senhaCriptografada;

        await UserRepositoy.save(userBody);
        res.status(201).json(userBody);
    }
    catch(error){
        res.status(500).json('Não foi possível criar o usuário');
    }
})

export default userRouter