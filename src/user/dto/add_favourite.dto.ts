import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class FavouriteSong { 

    @Field()
    userId: string 
    
    @Field()
    songId : string 
}

