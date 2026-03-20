import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PostsService {
  constructor(private db : DatabaseService){}
 async create(createPostDto: CreatePostDto) {
    try{
      const dbUser = await this.db.post.create({data: {
    title: createPostDto.title,
    content: createPostDto.content,
    author: { connect: { id: createPostDto.author } }
    
  }})
  return dbUser
    }
    catch(error){
      console.log(' create issue line 7', error)
      throw new NotFoundException('failed to create post :(')

    }
  }

 async findAll() {
  try{const dbUser = await this.db.post.findMany({
    where : 
    { published : true},
    include : {author : true}
  })}
  catch(error){
    console.log('failed to load all posts')
    throw new NotFoundException('failed to load all users ')
  }
    
  }

  async findOne(id: number) {
    try{const dbUser = await this.db.post.findUnique({where : { id : id}})
  if(!dbUser){ throw new NotFoundException('Post not found')}
return dbUser }
    catch(error){
      console.log('error failed to find line 40 ' , error)
  throw new NotFoundException('bad request')
    }
  }

 async update(id: number, updatePostDto: UpdatePostDto) {
    try{const dbUser = await this.db.post.update(
     { where : {id},
    data : {title : updatePostDto.title,
          content : updatePostDto.content,},
          include : {author : true} }
    )
  }
   
   catch(error){
    console.log('failed to update at line 50' , error)
    throw new NotFoundException('bad request , failed to update user')
   }
  }

  async remove(id: number) {
    try{
      const check =  await this.findOne(id)
    if(!check){ throw new NotFoundException('failed to delete this user')}
    
    
      return await this.db.post.delete({where : {id}})
    }
    catch(error){
      console.log(' failed to delete user line 70' , error)
      throw new NotFoundException('failed to delete user , bad request ')
    }
    
  }
}
