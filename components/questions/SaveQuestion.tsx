"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import Image from "next/image";
import { toast } from "sonner";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";

const SaveQuestion = ({ questionId }: { questionId: string }) => {
  const session = useSession();
  const email = session?.data?.user?.email;
  const [user, setUser] = useState(null);
  const userId = user?._id;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (email) {
      api.users.getByEmail(email).then((res) => {
        setUser(res.data);
        console.log(res.data);
      });
    }
  }, [email]);

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId) return toast("Please login to save the question");
    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });
      if (!success) {
        toast.error(error || "Error saving the question");
      }

      toast(data?.saved ? "Question saved" : "Question removed from saved");
    } catch (err) {
      toast("Error saving the question");
    } finally {
      setIsLoading(false);
    }
  };

  const hasSaved = false; // Replace with actual logic to check if the question is saved

  return (
    <Image
      src={ hasSaved ?`/icons/star-filled.svg` :`/icons/star-red.svg`}
      alt="Star Icon"
      height={15}
      width={15}
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
