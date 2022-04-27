import { getCustomRepository, Repository } from "typeorm"
import { User } from "../entities/User";
import { UsersRepository } from "../repositories/usersRepositories"



class UserServices {

    private usersRepository: Repository<User>;

    constructor() {
        this.usersRepository = getCustomRepository(UsersRepository)
    }
    async create(email: string) {

        //verificar se o usuario existe

        const userExists = await this.usersRepository.findOne({
            email
        })

        if (userExists) {
            return userExists
        }

        const user = this.usersRepository.create({
            email
        })

        await this.usersRepository.save(user)

        return user
    }

    async findByEmail(email:string){
        const userExists = await this.usersRepository.findOne({
            email
        })

        if (userExists) {
            return userExists
        }
    }
}


export { UserServices }