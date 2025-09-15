import React from "react";
import Image from "next/image";
interface UserCardProps {
  _id: string;
  name: string;
  image?: string;
  username: string;
}

const UserCard = ({ _id, name, image, username }: UserCardProps) => {
  return (
    <div className="flex flex-col items-center bg-[#18181b] rounded-xl p-4 mb-4 mr-1 w-40 mx-auto shadow-lg">
     <Image
  src={image || "/default-avatar.png"}
  alt={name}
  height={64}
  width={64}
  className="rounded-full object-cover mb-2 border-2 border-gray-700"
/>
      <span className="text-white font-semibold text-lg">{name}</span>
      <span className="text-gray-400 text-sm">@{username}</span>
    </div>
  );
};

export default UserCard;