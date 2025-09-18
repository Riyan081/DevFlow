"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formUrlQuery } from "@/lib/url";

// interface Filter{
//     name:string;
//     value:string;
// }

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const CommonFilter = ({
  filters,
  otherClasses = "",
  containerClasses = "",
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsFilter = searchParams.get("filter");
  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
        params:searchParams.toString(),
        key:"filter",
        value
    });
    
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className={cn("relative pl-8 pr-8", containerClasses)}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramsFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            "w-full  border  bg-[#0A0E12] text-ellipsis  text-left  min-w-[120px]  rounded-[10px] px-4 py-3  focus:ring-0 focus:border-transparent  ",
            otherClasses
          )}
        >
          <div>
            <SelectValue placeholder="Filter by" />
          </div>
        </SelectTrigger>

        <SelectContent className="bg-[#0A0E12]">
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value} className="bg-[#0A0E12]">
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;
