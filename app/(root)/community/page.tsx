import React from "react";
import { getUsers } from "@/lib/actions/user.action";
import LocalSearch from "@/components/search/LocalSearch";
import UserCard from "@/components/cards/UserCard";
import CommonFilter from "@/components/filters/CommonFilter";
import { UserFilters } from "@/constants/filter";
import Pagination from "@/components/Pagination";
interface CommunitySearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Community = async ({ searchParams }: CommunitySearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 5,
    query: query || "",
    filter: filter || "newest",
  });

  const users = data?.users || [];
  const { isNext } = data || {};
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Community Users</h1>

<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
      <LocalSearch
        route="/community"
        imgsrc="/icons/search.svg"
        placeholder="Search Users..."
        otherClasses="flex-1 mb-4"
      />
      <CommonFilter
      filters={UserFilters}
      otherClasses="min-h-[56px] sm:min-w-[170px]"
      />
      </div>

      {success ? (
        <div className="flex flex-wrap mt-6">
          {users.map((user) => (
          <UserCard key={user._id} {...user}/>
          ))}
        </div>
      ) : (
        <p className="text-red-500">Error: {error}</p>
      )}
      <Pagination page={page} isNext={!!isNext}/>
    </div>
  );
};

export default Community;
