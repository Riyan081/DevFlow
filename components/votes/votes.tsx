"use client";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ActionResponse } from "@/lib/handlers/fetch";
import { HasVotedParams, HasVotedResponse } from "@/types/global";
import { createVote } from "@/lib/actions/vote.action";

interface Params {
  targetType: "question" | "answer";
  upvotes: number;
  downvotes: number;
  targetId?: string;

  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;

}
const Votes = ({
  targetType,
  targetId,
  upvotes,
  downvotes,

  hasVotedPromise
}: Params) => {
 const {success,data} = use(hasVotedPromise) || {};

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {hasUpvoted,hasDownvoted} = data || {};
  const session = useSession();

  const userMail = session?.data?.user?.email || "";

  const handleVote = async (type: "upvote" | "downvote") => {
    const user = await api.users.getByEmail(userMail);
              
    const userId = user?.data?._id;
    if (!userId) {
      return toast("User ID is missing");
    }

    setIsLoading(true);
    try {
      const result = await createVote({
        targetId: targetId!,
        targetType,
        voteType: type,
        
      })

      if(!result.success){
        return toast(result.error || "Failed to process your vote. Please try again later.");
      }
      const sucessMessage =
        type === "upvote"
          ? ` Upvote ${!hasUpvoted ? "Added" : "Removed"}`
          : ` Downvote ${!hasDownvoted ? "Added" : "Removed"}`;
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
          src={ success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
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
          src={ success && hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
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
