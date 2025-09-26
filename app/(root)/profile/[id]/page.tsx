import { auth } from "@/auth";
import { notFound } from "next/navigation";
import React from "react";
import { getUser, getUserTopTags, getUserStats } from "@/lib/actions/user.action";
import UserAvtar from "@/components/avtar/UserAvtar";
import ProfileLink from "@/components/user/ProfileLink";
import dayjs from "dayjs";
import { api } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IUser } from "@/database/user.model";
import Stats from "@/components/user/Stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionCard from "@/components/cards/QuestionCard";
import { getUserQuestions } from "@/lib/actions/user.action";
import { getUserAnswers } from "@/lib/actions/user.action";
import Pagination from "@/components/Pagination";
import AnswerCard from "@/components/cards/AnswerCard";
import TagCard from "@/components/cards/TagCard";
interface RouteParams {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    pageSize?: string;
  };
}

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { page, pageSize } = await searchParams;
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const loggedInUser = await auth();
  const email = loggedInUser?.user?.email;

  // ✅ Check email exists
  if (!email) {
    notFound();
  }

  // ✅ Add proper error handling and typing
  let loggedInUserId = null;

  try {
    const Userl = (await api.users.getByEmail(email)) as APIResponse<IUser>;

    if (!Userl?.data?._id) {
      notFound();
    }

    loggedInUserId = Userl.data._id;
  } catch (error) {
    console.error("Error fetching user:", error);
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

  const { user } = data || {};
  const { name, _id, image, username, portfolio, location, createdAt, bio } =
    user || {};

    const { data: userStats } = await getUserStats({ userId: id });

  const {
    success: userQuestionsSuccess,
    data: userQuestions,
    error: userQuestionsError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 5,
  });

  const {
    success: userAnswersSuccess,
    data: userAnswers,
    error: userAnswersError,
  } = await getUserAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 5,
  });

  const {
    success: userTopTagsSuccess,
    data: userTopTags,
    error: userTopTagsError,
  } = await getUserTopTags({
    userId: id,
  });

  const { questions, isNext: hasMoreQuestions } = userQuestions || {};
  const { answers, isNext: hasMoreAnswers } = userAnswers || {};
  const { tags } = userTopTags || {};
  return (
    <div className="flex w-full flex-col gap-8 max-w-5xl mx-auto p-4">
      {/* Profile Header Section */}
      <section className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Left Side - Avatar and Basic Info */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Enhanced Avatar Container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <UserAvtar
              id={_id || ""}
              name={name || ""}
              imageUrl={image || ""}
              className="relative size-28 rounded-full object-cover border-3 border-background dark:border-gray-800 shadow-xl"
              fallbackClassName="text-2xl"
            />
          </div>

          <div className="flex flex-col gap-4 text-center sm:text-left">
            {/* Name and username */}
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-foreground dark:text-amber-50">
                {name}
              </h2>
              <p className="text-lg text-muted-foreground dark:text-gray-400">
                @{username}
              </p>
            </div>

            {/* Profile Links */}
            <div className="flex flex-col gap-3 py-2">
              {portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  href={portfolio}
                  title={portfolio.replace(/^https?:\/\//, "")}
                />
              )}
              {location && (
                <ProfileLink
                  imgUrl="/icons/carbon-location.svg"
                  title={location}
                />
              )}

              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={`Joined ${dayjs(createdAt).format("MMMM YYYY")}`}
              />
            </div>

            {/* Bio section */}
            {bio && (
              <div className="pt-2 border-t border-border/50 dark:border-gray-700/50">
                <p className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed max-w-md">
                  {bio}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Edit Button */}
        <div className="flex justify-center sm:justify-end">
          {loggedInUserId === _id && (
            <Link href="/profile/edit">
              <Button className="bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-500 hover:to-orange-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={userStats?.totalQuestions || 0}
        totalAnswers={userStats?.totalAnswers || 0}
        badges={userStats?.badges || { GOLD: 0, SILVER: 0, BRONZE: 0 }}
        reputationPoints={user.reputation || 0}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="">
            <TabsTrigger value="top-posts">Top Posts</TabsTrigger>
            <TabsTrigger value="answers"> Answers</TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            {userQuestionsSuccess && questions && questions.length > 0 ? (
              questions.map((question) => (
                <QuestionCard key={question._id} question={question} showActionBtns={loggedInUserId === _id}/>
              ))
            ) : (
              <div className="mt-10 flex w-full items-center justify-center">
                <p className="text-black  dark:text-amber-50">
                  No Questions Found
                </p>
              </div>
            )}

            <Pagination
              page={Number(page) || 1}
              isNext={hasMoreQuestions}
              containerClasses="justify-start mt-10"
            />
          </TabsContent>

          <TabsContent value="answers">
            {userAnswersSuccess && answers && answers.length > 0 ? (
              answers.map((answer) => (
                <AnswerCard key={answer._id} {...answer} showActionBtn={loggedInUserId === _id} />
              ))
            ) : (
              <div className="mt-10 flex w-full items-center justify-center">
                <p className="text-black  dark:text-amber-50">
                  No Answers Found
                </p>
              </div>
            )}

            <Pagination
              page={Number(page) || 1}
              isNext={hasMoreAnswers}
              containerClasses="justify-start mt-10"
            />
          </TabsContent>
        </Tabs>

        <div className="flex w-1/2 flex1 flex-col max-lg:hidden">
          <h3>Top Tags</h3>
          <div>
            {userTopTagsSuccess && tags && tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <TagCard
                    key={tag._id}
                    _id={tag._id}
                    name={tag.name}
                    questions={tag.count}
                    showCount
                    compact
                  />
                ))}
              </div>
            ) : (
              <div className="mt-10 flex w-full items-center justify-center">
                <p className="text-black  dark:text-amber-50">No Tags Found</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
