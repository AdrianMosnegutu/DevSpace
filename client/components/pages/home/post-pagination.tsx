"use client";

import { usePosts } from "@/contexts/posts-context";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { serverGetPostsOnPage } from "@/lib/services/post-service";
import { errorToast } from "@/lib/toasts";
import clsx from "clsx";

export default function PostPagination() {
  const { setPosts, currentPage, incrementPage, decrementPage } = usePosts();

  async function handleGoToPreviousPage() {
    try {
      const posts = await serverGetPostsOnPage(currentPage - 1);
      setPosts(posts);
      decrementPage();
    } catch (error) {
      errorToast("Could not go to previous page!", error);
    }
  }

  async function handleGoToNextPage() {
    try {
      const posts = await serverGetPostsOnPage(currentPage + 1);
      setPosts(posts);
      incrementPage();
    } catch (error) {
      errorToast("Could not go to next page!", error);
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={clsx(
              "cursor-default",
              currentPage === 0 && "!text-muted-foreground !bg-transparent",
            )}
            onClick={
              currentPage > 0
                ? handleGoToPreviousPage
                : (e) => e.preventDefault()
            }
            href="#"
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#" isActive>{currentPage + 1}</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            className="cursor-default"
            onClick={handleGoToNextPage}
            href="#"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
