import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { Permission } from "../entity/Permission";
import { Role } from "../entity/Role";
import { User } from "../entity/User";

// respositorys
const userRepository = AppDataSource.getRepository(User)
const roleRepository = AppDataSource.getRepository(Role)
const permissionRepository = AppDataSource.getRepository(Permission)

// router
const rbacRouter = Router()

// listar todas as roles
rbacRouter.get("/listAllRoles", async (req: Request, res: Response) => {
    try {
        const roles = await roleRepository.find({
            relations: ["permissions"]
        })

        res.status(200).json(roles)
    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

// listar todas as pemissions
rbacRouter.get("/listAddPermissions", async (req: Request, res: Response) => {
    try {
        const permissions = await permissionRepository.find()

        res.status(200).json(permissions)
    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

// criar uma role
rbacRouter.post("/addRole", async (req: Request, res: Response) => {
    try {
        const roleBody = req.body as Role

        if(!roleBody.description){
            res.status(400).json("A descrição é obrigatória!")
            return
        }

        await roleRepository.save(roleBody)

        res.status(201).json(roleBody)

    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

// criar uma permission
rbacRouter.post("/addPermission", async (req: Request, res: Response) => {
    try {
        const permissionBody = req.body as Permission

        if(!permissionBody.description){
            res.status(400).json("A descrição é obrigatória!")
            return
        }

        await permissionRepository.save(permissionBody)

        res.status(201).json(permissionBody)

    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

// adicionar uma permission a uma role
rbacRouter.post("/addPermissionToRole", async (req: Request, res: Response) => {
    try {
        const permissionRoleBody = req.body as {
            permissionId: number
            roleId: number
        }

        if(!permissionRoleBody.roleId || !permissionRoleBody.permissionId){
            res.status(400).json("É necessário enviar o id da role e da permission!")
            return
        }

        const permission = await permissionRepository.findOneBy({id: permissionRoleBody.permissionId})

        if(!permission){
            res.status(400).json("A permissão informada não existe!")
            return
        }

        const role = await roleRepository.findOne({ where: {
                id: permissionRoleBody.roleId
            }, relations: ["permissions"]
        })

        if(!role){
            res.status(400).json("A role informada não existe!")
            return
        }

        if(role.permissions.find(x => x.id == permission.id)){
            res.status(400).json("A role já possui está informação!")
            return
        }

        role.permissions.push(permission)
        await roleRepository.save(role)

        res.status(201).json(role)

    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

// adicionar uma role a um usuário
rbacRouter.get("/addRoleToUser", async (req: Request, res: Response) => {
    try {
        const userRoleBody = req.body as {
            roleId: number
            userId: number
        }

        if(!userRoleBody.userId || !userRoleBody.roleId){
            res.status(400).json("O id da role e do usuário são obrigatórios!")
            return
        }

        const role = await roleRepository.findOneBy({ id: userRoleBody.roleId})

        if(!role){
            res.status(400).json("Role inválida!")
            return
        }

        const user = await userRepository.findOne({
            where: {
                id: userRoleBody.userId
            }, relations: ["roles"]
        })

        if(!user){
            res.status(400).json("usuário não existe")
            return
        }

        if(user.roles.find(x => x.id == role.id)){
            res.status(400).json("O usuário já possui está role!")
            return
        }

        user.roles.push(role)
        await userRepository.save(user)

        res.status(201).json(user)
    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

export default rbacRouter