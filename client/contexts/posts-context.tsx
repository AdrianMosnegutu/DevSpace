"use client";

import { TPost, TPostsContext } from "@/common";
import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("date-desc");

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortOrder) {
      case "date-desc":
        result.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
        break;
      case "date-asc":
        result.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
        break;
      case "likes-desc":
        result.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "likes-asc":
        result.sort((a, b) => a.upvotes - b.upvotes);
        break;
    }

    return result;
  }, [posts, searchQuery, sortOrder]);

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
        posts: filteredAndSortedPosts,
        setPosts,
        createPost,
        deletePost,
        updatePost,
        currentPage,
        incrementPage,
        decrementPage,
        setSearchQuery,
        setSortOrder,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
