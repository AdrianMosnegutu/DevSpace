"use client";

import { usePosts } from "@/contexts/posts-context";
import RemovableTagsList from "../removable-tags-list";
import { Input } from "../ui/input";
import { useState } from "react";
import { MAX_TAG_LENGTH } from "@/lib/constants";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { errorToast } from "@/lib/toasts";
import {
  serverGetPosts,
  serverGetPostsOrderedDateAscending,
  serverGetPostsOrderedDateDescending,
  serverGetPostsOrderedLikesAscending,
  serverGetPostsOrderedLikesDescending,
  serverGetPostsWithTags,
} from "@/lib/services/post-service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TPost } from "common";

const orderings = [
  { name: "Newest", serverFunction: serverGetPostsOrderedDateAscending },
  { name: "Oldest", serverFunction: serverGetPostsOrderedDateDescending },
  { name: "Least Liked", serverFunction: serverGetPostsOrderedLikesAscending },
  { name: "Most Liked", serverFunction: serverGetPostsOrderedLikesDescending },
];

export default function SearchBar() {
  const { setPosts } = usePosts();

  const [inputTag, setInputTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [ordering, setOrdering] = useState<string>("Newest");

  function handleRemoveTag(tag: string) {
    setTags((prev) => prev.filter((item) => item !== tag));
  }

  function handleAddTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && inputTag.trim()) {
      e.preventDefault();

      if (inputTag.trim().length <= MAX_TAG_LENGTH) {
        setTags((prev) => [inputTag, ...prev]);
        setInputTag("");
      }
    }
  }

  async function handleOrder({
    name,
    serverFunction,
  }: {
    name: string;
    serverFunction: () => Promise<TPost[]>;
  }) {
    try {
      const posts = await serverFunction();
      setPosts(posts);
      setOrdering(name);
    } catch (error) {
      errorToast("Could not fetch posts!", error);
    }
  }

  async function handleSearch() {
    if (tags.length === 0) {
      try {
        const posts = await serverGetPosts();
        setPosts(posts);
      } catch (error) {
        errorToast("Could not fetch posts!", error);
      }
    } else {
      try {
        const filteredPosts = await serverGetPostsWithTags(tags);
        setPosts(filteredPosts);
      } catch (error) {
        errorToast("Could not search by tags!", error);
      }
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex">
        <Input
          placeholder="Search tags..."
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          onKeyDown={handleAddTag}
          className="w-9/12"
        />
        <Button onClick={handleSearch}>
          <Search strokeWidth={3} />
        </Button>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{ordering}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {orderings.map((order, index) => (
                <DropdownMenuItem
                  key={index}
                  onSelect={() => handleOrder(order)}
                >
                  {order.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <RemovableTagsList tags={tags} handleRemoveTag={handleRemoveTag} />
      </div>
    </div>
  );
}
