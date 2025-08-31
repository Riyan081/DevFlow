import { FilterQuery } from 'mongoose';
import { PaginationSearchParams } from "@/types/global";
import { PaginationSearchSchema } from "../validations";
import action from "../handlers/action";
import Tag from '@/database/tag.model';

export const getTags = async(params:PaginationSearchParams)=>{
    const validationResult = await action({
        params,
        schema: PaginationSearchSchema,
        authorize: false,
      });

      if(validationResult instanceof Error){
        return {success:false, error: validationResult.message};
      }

      const {page=1,pageSize=10, query,filter} = validationResult.params!;
      const skip = (Number(page) - 1) * Number(pageSize);
      const limit = Number(pageSize);
    
      const filterQuery: FilterQuery<typeof Tag>  ={}

      if(query){
        filterQuery.$or =[
            {name: {$regex: query, $options: 'i'}}
        ]
      }

      let sortCriteria = {};

      switch(filter){
        case 'popular':
            sortCriteria = {questions:-1};
            break;

        case 'recent':
            sortCriteria = {createdAt:-1};
            break;

        case 'oldest':
            sortCriteria = {createdAt:1};
            break;
     
        case "name":
            sortCriteria = { name: 1 };
            break;
        
        default:
            sortCriteria = { questions: -1 };
            break;
      }

      try{
        const totalTags = await Tag.countDocuments(filterQuery);


      const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();
      
      

      const isNext = totalTags > skip + tags.length;

      return{
        success:true, data:{tags, isNext}
      }
      }catch(error){
        return {success:false, error: (error as Error).message || "Failed to get tags"};

      }


}