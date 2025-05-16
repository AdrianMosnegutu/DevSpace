"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { TPost, TPostsContext } from "@/common";

interface PostProviderProps {
  posts: TPost[];
  children: ReactNode;
}

export const PostContext = createContext<TPostsContext | undefined>(undefined);

export function usePosts(): TPostsContext {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }

  return context;
}

export const PostProvider: React.FC<PostProviderProps> = ({
  posts: initialPosts,
  children,
}) => {
  const [posts, setPosts] = useState<TPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const createPost = (post: TPost) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  const deletePost = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  const updatePost = (updatedPost: TPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post,
      ),
    );
  };

  const incrementPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const decrementPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        createPost,
        deletePost,
        updatePost,
        currentPage,
        incrementPage,
        decrementPage,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
