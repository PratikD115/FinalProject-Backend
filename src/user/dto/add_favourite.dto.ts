import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class AddSongToFavourite { 

    @Field()
    userId: string 
    
    @Field()
    songId : string 
}


