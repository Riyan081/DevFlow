import { auth } from "@/auth";
import { notFound } from "next/navigation";
import React from "react";
import { getUser } from "@/lib/actions/user.action";
import UserAvtar from "@/components/avtar/UserAvtar";
interface RouteParams {
  params: {
    id: string;
  };
}

// {params:{id:number}}

const Profile = async ({ params }: RouteParams) => {
  const { id } = params;
  if (!id) {
    notFound();
  }



  const { success, data, error } = await getUser({
    userId: id,
  });

  if (!success) {
    return (
      <div>
        <div>{error}</div>
      </div>
    );
  }

  const { user, totalQuestions, totalAnswers } = data || {};

  return (
  <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
  <UserAvtar
  id={user?._id || ""}
  name={user?.name || ""}
  imageUrl={user?.image || ""}
  className="size-24 rounded-full object-cover"
  fallbackClassName="text-xl"

  
  />
  </section>
  );
};

export default Profile;
