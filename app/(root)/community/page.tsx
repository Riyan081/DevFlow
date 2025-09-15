import { SearchParams } from "next/dist/server/request/search-params";
import React from "react";
import { getUsers } from "@/lib/actions/user.action";
import LocalSearch from "@/components/search/LocalSearch";
import UserCard from "@/components/cards/UserCard";

const Community = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "newest",
  });

  const users = data?.users || [];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Community Users</h1>

      <LocalSearch
        route="/community"
        imgsrc="/icons/search.svg"
        placeholder="Search Users..."
        otherClasses="flex-1 mb-4"
      />

      {success ? (
        <div className="flex flex-wrap mt-6">
          {users.map((user) => (
          <UserCard key={user._id} {...user}/>
          ))}
        </div>
      ) : (
        <p className="text-red-500">Error: {error}</p>
      )}
    </div>
  );
};

export default Community;
