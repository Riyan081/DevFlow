"use client"

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { formUrlQuery } from "@/lib/url";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  page: number | undefined | string;
  isNext: boolean;
  containerClasses?: string;
}

const Pagination = ({ page = 1, isNext, containerClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (type: "next" | "prev") => {
    const nextPage = type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const value = nextPage > 1 ? nextPage.toString() : null;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: value ?? "",
    });

    router.push(newUrl);
  };

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-4 py-8",
        containerClasses
      )}
    >
      {/* Previous page button */}
      {Number(page) > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          variant="outline"
          className="flex h-10 items-center gap-2 px-4 py-2 text-sm font-medium text-dark-300 transition-all duration-200 hover:bg-light-800 hover:text-dark-500 dark:text-light-700 dark:hover:bg-dark-300 dark:hover:text-light-900"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rotate-180"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Previous</span>
        </Button>
      )}

      {/* Current page indicator */}
      <div className="flex min-w-[60px] items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-sm font-semibold text-white shadow-sm ring-1 ring-primary-500/20">
          {page}
        </div>
      </div>

      {/* Next page button */}
      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          variant="outline"
          className="flex h-10 items-center gap-2 px-4 py-2 text-sm font-medium text-dark-300 transition-all duration-200 hover:bg-light-800 hover:text-dark-500 dark:text-light-700 dark:hover:bg-dark-300 dark:hover:text-light-900"
        >
          <span>Next</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      )}
    </div>
  );
};

export default Pagination;