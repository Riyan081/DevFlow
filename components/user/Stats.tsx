import { formatNumber } from '@/lib/utils';
import { Badges } from '@/types/global';
import Image from 'next/image';
import React from 'react'
interface Props{
 totalAnswers:number;
 totalQuestions:number;
 badges: Badges;
 reputationPoints:number;
}

interface StatsCardProps{
  imgUrl:string;
  value:number;
  title:string;
}
export const StatsCard =({imgUrl,value,title}:StatsCardProps)=>{
  return (
    <div className="flex flex-wrap items-center p-4 bg-gray-800 rounded shadow">
      <Image src={imgUrl} alt={title} height={50} width={40}/>
      <p className="font-bold">{formatNumber(value)}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}
const Stats = ({totalAnswers, totalQuestions,badges,reputationPoints}:Props) => {
  return (
    <div className="mt-3">
       <h4 className="h3-semibold text-dark200_light900">
  Stats{" "}
  <span className="small-semibold primary-text-gradient">
    {formatNumber(reputationPoints)}
  </span>
</h4>;
    <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div>
        <div>
            <p className=" ">{formatNumber(totalQuestions)}</p>
            <p>Questions</p>
        </div>
         <div>
            <p className=" ">{formatNumber(totalAnswers)}</p>
            <p>Answers</p>
        </div>
        </div>

        <StatsCard imgUrl="/icons/gold-medal.svg" value={badges.GOLD} title="Gold Badges"/>
        <StatsCard imgUrl="/icons/silver-medal.svg" value={badges.SILVER} title="Silver Badges"/>
        <StatsCard imgUrl="/icons/bronze-medal.svg" value={badges.BRONZE} title="Bronze Badges"/>

    </div>
    </div>
  )
}

export default Stats