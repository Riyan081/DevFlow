import { DEFAULT_Empty } from "@/constants/states";
import React from "react";
import Image from "next/image";

interface Props<T> {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };

  data?: T[] | null | undefined;
  empty?: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
}

interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => {
  return (
    <>
      <div className="mt-16">
        <Image
          src={image.dark}
          alt={image.alt}
          height={150}
          width={150}
          className=" hidden object-contain dark:block mx-auto"
        />
      </div>
    </>
  );
};

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_Empty,
  render,
}: Props<T>) => {
  if (!data || data.length == 0)
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "No Data",
        }}
        title={""}
        message={""}
      />
    );
};

export default DataRenderer;
