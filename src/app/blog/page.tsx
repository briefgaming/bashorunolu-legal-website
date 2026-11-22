"use client";

import React from "react";

import Blog from "@/assets/Blog.png";
import Blog1 from "@/assets/Blog1.png";
import Blog2 from "@/assets/Blog2.png";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/NavBar";
import TopPost from "@/app/components/TopPost";
import BlogPost from "@/app/components/TopPost";


const Page = () => {
  return (
    <div className="bg-white">
      <div className="px-2 md:px-20 pb-20 pt-2 bg-blogHeadingBg">
        <Navbar />
        <h1 className="text-white font-extrabold text-6xl py-5">Blog</h1>
        <h4 className="text-primary font-extrabold text-2xl pt-2">Top Post</h4>

        <div className="flex gap-3">
          <div className="flex-grow h-full " style={{}}>
            <BlogPost
              image={Blog}
              title="Top"
              route="/blog/1"
              description="posts"
            />
          </div>

          <div className="hidden lg:flex flex-col gap-3" style={{ width: "22rem" }}>
            <TopPost
              image={Blog1}
              title="Top"
              route="/blog/1"
              description="posts"
            />
            <TopPost
              image={Blog2}
              title="Top"
              route="/blog/1"
              description="posts"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
