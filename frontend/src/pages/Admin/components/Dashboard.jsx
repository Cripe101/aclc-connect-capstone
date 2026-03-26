import DashboardLayout from "../../../components/Layouts/BlogLayout/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import moment from "moment";
import {
  LuBookA,
  LuChartLine,
  LuCheckCheck,
  LuGalleryVerticalEnd,
  LuHeart,
  LuUsers,
} from "react-icons/lu";
import DashboardSummaryCard from "../../../components/Cards/DashboardSummaryCard";
import TagInsights from "../../../components/Cards/TagInsights";
import TopPostCard from "../../../components/Cards/TopPostCard";
import RecentCommentsList from "../../../components/Cards/RecentCommentsList";
import { useQuery } from "@tanstack/react-query";
import BlogPostSummary from "../../Blog/components/BlogPostSummary";
import BlogPostSummaryCard from "../../../components/Cards/BlogPostSummaryCard";
import { getMyPosts } from "../../../utils/api";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        API_PATHS.DASHBOARD.GET_DASHBOARD_DATA,
      );
      return res.data;
    },
  });

  const officeDashboardData = useQuery({
    queryKey: "posts",
    queryFn: getMyPosts,
  });

  const topPosts = dashboardData?.topPosts || [];
  const maxViews =
    topPosts.length > 0 ? Math.max(...topPosts.map((p) => p.views)) : 1;

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex justify-center mt-10">Loading...</div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex justify-center mt-10 text-red-500">
          Failed to load dashboard
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      {dashboardData && (
        <>
          <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 mt-5">
            <div>
              <div className="col-span-3">
                <h2 className="text-xl md:text-2xl font-medium">
                  Good Day! {user.name}
                </h2>
                <p className="text-xs md:text-[13px] font-medium text-gray-400 mt-1.5 ">
                  {moment().format("dddd || DD MMMM YYYY")}
                </p>
              </div>
            </div>

            {user.role === "admin" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-3 md:gap-6 mt-5">
                <DashboardSummaryCard
                  icon={<LuGalleryVerticalEnd />}
                  label="Total Posts"
                  value={dashboardData?.stats?.totalPosts || 0}
                  bgColor="bg-sky-100/60"
                  color="text-sky-500"
                />

                <DashboardSummaryCard
                  icon={<LuCheckCheck />}
                  label="Published"
                  value={dashboardData?.stats?.published || 0}
                  bgColor="bg-green-100/60"
                  color="text-green-600"
                />

                {/* 🔥 NEW: Drafts (includes rejected) */}
                <DashboardSummaryCard
                  icon={<LuBookA />}
                  label="Rejected"
                  value={dashboardData?.stats?.drafts || 0}
                  bgColor="bg-yellow-100/60"
                  color="text-yellow-600"
                />

                {/* 🔥 OPTIONAL: Pending */}
                <DashboardSummaryCard
                  icon={<LuChartLine />}
                  label="Pending"
                  value={dashboardData?.stats?.pending || 0}
                  bgColor="bg-purple-100/60"
                  color="text-purple-600"
                />

                <DashboardSummaryCard
                  icon={<LuChartLine />}
                  label="Total Views"
                  value={dashboardData?.stats?.totalViews || 0}
                  bgColor="bg-sky-100/60"
                  color="text-sky-500"
                />

                <DashboardSummaryCard
                  icon={<LuHeart />}
                  label="Total Likes"
                  value={dashboardData?.stats?.totalLikes || 0}
                  bgColor="bg-pink-100/60"
                  color="text-pink-500"
                />

                <DashboardSummaryCard
                  icon={<LuUsers />}
                  label="Total Users"
                  value={dashboardData?.stats?.totalUsers || 0}
                  bgColor="bg-indigo-100/60"
                  color="text-indigo-500"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-3 md:gap-6 mt-5">
                <DashboardSummaryCard
                  icon={<LuGalleryVerticalEnd />}
                  label="Total Posts"
                  value={officeDashboardData.data.counts?.all || 0}
                  bgColor="bg-sky-100/60"
                  color="text-sky-500"
                />

                <DashboardSummaryCard
                  icon={<LuCheckCheck />}
                  label="Published"
                  value={officeDashboardData.data.counts?.approved || 0}
                  bgColor="bg-green-100/60"
                  color="text-green-600"
                />

                {/* 🔥 NEW: Drafts (includes rejected) */}
                <DashboardSummaryCard
                  icon={<LuBookA />}
                  label="Rejected"
                  value={officeDashboardData.data.counts?.rejected || 0}
                  bgColor="bg-yellow-100/60"
                  color="text-yellow-600"
                />

                {/* 🔥 OPTIONAL: Pending */}
                <DashboardSummaryCard
                  icon={<LuChartLine />}
                  label="Pending"
                  value={officeDashboardData.data.counts?.pending || 0}
                  bgColor="bg-purple-100/60"
                  color="text-purple-600"
                />
              </div>
            )}

            {/* <div>
              <h1>Top Posts:</h1>
              {dashboardData.topPosts?.map((post) => (
                <BlogPostSummaryCard
                  key={post._id}
                  title={post.title}
                  imgUrl={
                    post?.coverImageUrl === ""
                      ? post?.images[0]
                      : post?.coverImageUrl
                  }
                  updatedOn={
                    post.updatedAt
                      ? moment(post.updatedAt).format("Do MMM YYYY")
                      : "-"
                  }
                  status={post.status}
                  tags={post.tags}
                  likes={post.likedBy?.length || 0}
                  views={post.views}
                  onClick={() => navigate(`/admin/edit/${post.slug}`)}
                  onDelete={() =>
                    setOpenDeleteAlert({ open: true, data: post._id })
                  }
                />
              ))}
            </div> */}

            <div className="col-span-12 bg-white mt-10 p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Recent Comments</h5>
              </div>
              <RecentCommentsList
                comments={dashboardData.recentComments || []}
              />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
