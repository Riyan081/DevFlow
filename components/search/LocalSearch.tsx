"use client";
import React from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { clear } from "console";

interface Props {
  route: string;
  imgsrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({ route, imgsrc, placeholder, otherClasses }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchparams = useSearchParams(); //gives you object
  const query = searchparams.get("query") || ""; //select query from that
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newurl = formUrlQuery({
          params: searchparams.toString(), //pra query aayega string main
          key: "query",
          value: searchQuery,
        });

        router.push(newurl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchparams.toString(),
            KeysToremove: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, route, searchparams]);
  return (
    <div className=" bg-[#0A0E12] min-h-[55px] grow flex items-center gap-4 rounded-[10px] px-4">
      <Image src={imgsrc} height={20} width={20} alt="search logo" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-none outline-none shadow-none focus:outline-none focus:ring-0 focus:border-transparent"
      />
    </div>
  );
};

export default LocalSearch;
