"use client";

import React from "react";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/lib/url";
import { removeKeysFromUrlQuery } from "@/lib/url";
import { useRouter } from "next/navigation";

const filters = [
  {name:"React", value:'react'},
  {name:"JavaScript", value:"javascript"},
  
  // { name: "Newest", value: "newest" },
  // { name: "Popular", value: "popular" },
  // { name: "Unanswered", value: "unanswerd" },
  // { name: "Recommended", value: "recommmended" },
];

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParams = searchParams.get("filter");
  const [active, setActive] = useState(filterParams || "");

  const handleTypeClick = (filter: string) => {
    let newUrl = "";
    if (filter == active) {
      setActive("");
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        KeysToremove: ["filter"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(filter);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => (
        <Button
          key={filter.name}
          className={cn(
            // Base styles
            "rounded-full px-5 py-2 capitalize font-semibold transition-all duration-200 shadow-none border border-transparent bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-700 focus:outline-none   dark:bg-[#181818] dark:text-gray-200 dark:hover:bg-[#232323] dark:hover:text-orange-400",
            // Active styles
            active === filter.value &&
              "border-orange-500 bg-orange-100 text-orange-700 dark:bg-[#232323] dark:border-orange-400 dark:text-orange-400"
          )}
          onClick={() => handleTypeClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;