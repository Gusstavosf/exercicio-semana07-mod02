import {Router, Response, Request} from 'express';
import { AppDataSource } from '../data-source';
import { Medicamentos } from '../entity/Medicamentos';

const medicamentosRouter = Router();

const MedicamentoRepositoy = AppDataSource.getRepository(Medicamentos);

medicamentosRouter.post('/', async (req: Request, res: Response) => {
    try{
        const medBody = req.body as Medicamentos;

        if(!medBody ||  !medBody.nome || !medBody.descricao || !medBody.quantidade || !medBody.userId){
            res.status(400).json('Preencha todos os campos');
            return
        }

        await MedicamentoRepositoy.save(medBody);

        res.status(201).json(medBody);

    }
    catch(error){
        res.status(500).json('Não foi possível criar o medicamento');
    }
})

medicamentosRouter.get('/', async (req: Request, res: Response) => {
    try{

        const userId = Number(req.headers.userid)

        if(!userId){
            res.status(400).json('Será necessario informar o id do usuário no header');
            return
        }

        const page = Number(req.query.page) || 1; //Pega o valor da query page, se não existir, assume 1
        const limit = Number(req.query.limit) || 10; //Pega o valor da query limit, se não existir, assume 10

        const skip = page > 1 ? (page-1) * limit:0

        const result = await MedicamentoRepositoy.find({
            where:{
                userId: userId
            },
            skip: skip, //Pula os registros de acordo com a pagina 
            take: limit //Limita a quantidade de registros    
    })

        if(!result){
            res.status(200).json('Nenhum medicamento encontrado');
            return
        }

        res.status(200).json(result);
    }
    catch(error){
        res.status(500).json('Não foi possível criar o medicamento');
    }
})

medicamentosRouter.get('/:id', async (req: Request, res: Response) => {
    try{
        const result = await MedicamentoRepositoy.findOne({
            where: {
                id: Number(req.params.id)
        }
    })

        if(!result){
            res.status(200).json('Nenhum medicamento encontrado');
            return
        }

        res.status(200).json(result);
    }
    catch(error){
        res.status(500).json('Não foi possível criar o medicamento');
    }
})

medicamentosRouter.get('/all', async (req: Request, res: Response) => {
    try{
        const userId = req.headers.userId

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = page > 1 ? (page-1) * limit:0

        const result = await MedicamentoRepositoy.find({
            skip: skip,
            take: limit      
    })
        if(!result){
            res.status(200).json('Nenhum medicamento encontrado');
            return
        }

        res.status(200).json(result);

     }catch(error){
        res.status(500).json('Não foi possível executar a operação');
    }
})

medicamentosRouter.put('/:id', async (req: Request, res: Response) => {
    try{
        const id = Number(req.params.id); //Pega o id da URL

        const userId = Number(req.headers.userid)

        if(!userId){
            res.status(400).json('Será necessario informar o id do usuário no header');
            return
        }

        const medBody = req.body as Medicamentos; //Pega o corpo da requisição 

        const medicamento = await MedicamentoRepositoy.findOne({
            where:{
                id:id,
                userId: userId
            } 
}) //Busca o medicamento no banco pelo id

        if(!medicamento){ //Se não encontrar o medicamento
            res.status(404).json('Medicamento não encontrado'); //Retorna erro
            return
        }

        Object.assign(medicamento, medBody); //Substitui os valores do objeto

        await MedicamentoRepositoy.save(medicamento); //Salva o objeto no banco

        res.status(200).json(medicamento); //Retorna o objeto atualizado

    }
    catch(error){
        res.status(500).json('Não foi possível criar o medicamento');
    }
})

medicamentosRouter.delete('/:id', async (req: Request, res: Response) => {
    try{

        const userId = Number(req.headers.userid)

        if(!userId){
            res.status(400).json('Será necessario informar o id do usuário no header');
            return
        }

        const id = Number(req.params.id); //Pega o id da URL

        const medicamento = await MedicamentoRepositoy.findOne({
            where:{
                id:id,
                userId: userId
            } 
})  //Busca o medicamento no banco pelo id

        if(!medicamento){ //Se não encontrar o medicamento
            res.status(404).json('Medicamento não encontrado'); //Retorna erro
            return
        }

        await MedicamentoRepositoy.remove(medicamento); //Remove o medicamento do banco

        res.status(200).json('Medicamento removido com sucesso'); //Retorna mensagem de sucesso
    }
    catch(error){
        res.status(500).json('Não foi possível criar o medicamento');
    }
})

export default medicamentosRouter