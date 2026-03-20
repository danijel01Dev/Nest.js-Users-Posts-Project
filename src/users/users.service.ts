import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';

 import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
    
    
  constructor(private db : DatabaseService
    
  ){}

  async updateRefreshToken(userId: number, hashedToken: string) {
  return await this.db.users.update({
    where: { id: userId },
    data: { refreshToken: hashedToken },
  });
}
  async create(createUserDto: CreateUserDto) {
    try{ const hashpass = await bcrypt.hash(createUserDto.password, 10)
       const dbUser =  await this.db.users.create({ data: {
       email : createUserDto.email,
       password : hashpass,
    }})
       
         return dbUser}
    catch(error){
      console.log('error user at line 12', error)
      throw new NotFoundException(' invalid request failed to create user')

    }
  }
    async findByEmail (email : string){
      try {const dbUser =  await this.db.users.findUnique({
        where : {email}
      })
    return dbUser}
      catch(error){
        console.log('user not found' , error)
        throw new NotFoundException(' user not found')

      }
    }
  async findAll() {
    try{const dbUser = await this.db.users.findMany({
      select : {
        email : true,
      }
    })}
    catch(error){
      console.log('error . failed to find all at line 22' , error)
      throw new NotFoundException('invalid request failed to find all users')
    }
  }

  async findOne(id: number) : Promise<any>{
    try{const dbUser = await this.db.users.findUnique({
      where : {id}
    })}
    catch(error){
      console.log('failed to find by id user line 35', error)
      throw new NotFoundException('bad request failed to find user')

    }
  }

 async update(id: number, updateUserDto: UpdateUserDto) {
    try{const dbUser = await this.db.users.update({
      where : {id},
       data : {
         email : updateUserDto.email,
         password : updateUserDto.password,
       } })
       return dbUser;
    }
    catch(error){
      console.log('invalid update at line 46', error)
      throw new NotFoundException('bad request failed to update user')
    }
  }

async   remove(id: number) {
    try{
      
        return await this.db.users.delete({where : {id}})
      }
    
    catch(error){
      console.log('failed to delete user at line 61', error)
      throw new NotFoundException('bad request failed to delete user')

    }
  }
}
