"use client";

import { TPost } from "@/common";
import RemovableTagsList from "@/components/removable-tags-list";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { usePosts } from "@/contexts/posts-context";
import { MAX_TAG_LENGTH } from "@/lib/constants";
import {
    serverGetAllPosts,
    serverGetPostsOrderedDateAscending,
    serverGetPostsOrderedDateDescending,
    serverGetPostsOrderedLikesAscending,
    serverGetPostsOrderedLikesDescending,
    serverGetPostsWithTags,
} from "@/lib/services/post-service";
import { errorToast } from "@/lib/toasts";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const { setPosts } = usePosts();

  const orderings = [
    {
      name: "Newest",
      serverFunction: () => serverGetPostsOrderedDateAscending(),
    },
    {
      name: "Oldest",
      serverFunction: () => serverGetPostsOrderedDateDescending(),
    },
    {
      name: "Least Liked",
      serverFunction: () => serverGetPostsOrderedLikesAscending(),
    },
    {
      name: "Most Liked",
      serverFunction: () => serverGetPostsOrderedLikesDescending(),
    },
  ];

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
        const posts = await serverGetAllPosts();
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
      <div className="flex w-full gap-4">
        <Input
          placeholder="Search tags..."
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          onKeyDown={handleAddTag}
          className="flex-1"
        />

        <Button onClick={handleSearch}>
          <Search strokeWidth={3} />
        </Button>

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

      <div>
        <RemovableTagsList tags={tags} handleRemoveTag={handleRemoveTag} />
      </div>
    </div>
  );
}
