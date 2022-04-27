import { Request, Response } from 'express'
import { MessageServices } from '../services/messageServices'

class MessageController {
    async create(req: Request, res: Response) {
        const {admin_id,text,user_id} = req.body
        const messageServices = new MessageServices()

        const message = await messageServices.create({
            admin_id,
            text,
            user_id
        })

        return res.json(message)

    }

    async showByUser(req: Request, res: Response){
        const {id} = req.params
        const messageServices = new MessageServices()
        const list = await messageServices.listByUser(id)
        return res.json(list)

    }

}


export { MessageController }