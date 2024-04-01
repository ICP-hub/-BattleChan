import React from "react";
import Post from "./Post";
import { Link } from "react-router-dom";

interface PostData {
  postId: string;
  postName: string;
  postMetaData: string;
  postDes: string;
  expireAt: BigInt;
  createdAt: string;
  createdBy: {
    userName: string;
    userProfile: string;
  }
}

interface PostsProps {
  currentPosts: PostData[];
  type?: string;
}

let comments = 0;
const Posts: React.FC<PostsProps> = ({ currentPosts, type }) => {
  const className = "Dashboard__MainPosts__Posts";

  return (
    <React.Fragment>
      {currentPosts.map((post, index) => (
        <div
          className={
            className +
            " " +
            `laptop:w-1/2 w-full p-2 ${index % 2 !== 0 ? "tablet:mt-6" : ""}`
          }
        >
          <Link
            key={post.postId}
            to={`/dashboard/postDetails/${encodeURIComponent(post.postId)}`}
          >
            <Post
              key={post.postId}
              id={post.postId}
              imageUrl={post.postMetaData}
              userAvatarUrl="/src/images/main-post-user-avatar.jpg"
              timestamp={post.createdAt}
              duration="5:00"
              content={post.postDes}
              likes="0"
              comments={comments}
              expireAt={post.expireAt}
              userName={post.createdBy.userName}
              userProfile={post.createdBy.userProfile}
              type={type}
            />
          </Link>
        </div>
      ))}
    </React.Fragment>
  );
};

export default Posts;
