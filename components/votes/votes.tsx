"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Params {
  upvotes: number;
  downvotes: number;
  hasupVoted?: boolean;
  hasdownVoted?: boolean;
  questionId?: string;
}
const Votes = ({
  upvotes,
  downvotes,
  hasdownVoted,
  hasupVoted,
  questionId,
}: Params) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const session = useSession();

  const userMail = session?.data?.user?.email || "";

  const handleVote = async (type: "upvote" | "downvote") => {
    const user = await api.users.getByEmail(userMail);
              
    const userId = user?.data?._id;
    if (!userId) {
      return toast("Question ID is missing");
    }

    setIsLoading(true);
    try {
      const sucessMessage =
        type === "upvote"
          ? ` Upvote ${!hasupVoted ? "Added" : "Removed"}`
          : ` Downvote ${!hasdownVoted ? "Added" : "Removed"}`;
    } catch (err) {
      toast(
        "Failed to load an error occured while loading. Please Try Again Later"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <Image
          src={hasupVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          alt="Upvote Icon"
          height={18}
          width={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center  rounded-sm p-1 text-amber-50">
          <p className=" font-medium text-white">{formatNumber(upvotes)}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Image
          src={hasdownVoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          alt="Downvote Icon"
          height={18}
          width={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />
        <div className="flex-center  rounded-sm p-1 text-amber-50">
          <p className=" font-medium text-white">{formatNumber(downvotes)}</p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
