import { getCustomRepository, Repository } from "typeorm"
import { Setting } from "../entities/Setting";
import { SettingsRepository } from "../repositories/settingsRepository"

interface ISettingsCreate{
    chat:boolean;
    username:string;
}

class SettingsServices {

    private settingsRepository: Repository<Setting>;

    constructor(){
        this.settingsRepository = getCustomRepository(SettingsRepository)
    }

    async create({chat,username}:ISettingsCreate){
    
        const userAlreadyExists = await this.settingsRepository.findOne(
            {username}
        )

        if(userAlreadyExists){
            throw new Error("user already exists")
        }


        const settings = this.settingsRepository.create({
            chat,
            username
        })
    
        await this.settingsRepository.save(settings)

        return settings
    }

    async findByUserName(username:string){
        const settings = await this.settingsRepository.findOne({
            username
        })
        return settings
    }

    async update(username:string,chat:boolean){
        const settings = await this.settingsRepository.createQueryBuilder()
        .update(Setting)
        .set({chat})
        .where("username = :username",{
            username
        }).execute()
    }
}

export {SettingsServices}