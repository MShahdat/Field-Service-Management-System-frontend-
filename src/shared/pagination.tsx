/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Meta } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const getPageArray = (totalPage: number, currentPage: number) => {
  if (totalPage <= 4) {
    return Array.from({ length: totalPage }, (_, idx) => idx + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPage];
  }

  if (currentPage >= totalPage - 2) {
    return [
      1,
      "ellipsis",
      totalPage - 3,
      totalPage - 2,
      totalPage - 1,
      totalPage,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPage,
  ];
};

interface IProps {
  meta: Meta;
}

const Paginations = ({ meta }: IProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());

  // console.log(params)
  const page = searchParams.get("page") ?? 1;

  console.log(page);

  const totalPage = meta.totalPages;
  // const totalPage = 20

  const goToPage = (page: number) => {
    params.set("page", String(page));
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (totalPage <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              goToPage(Math.max(Number(page) - 1, 1));
            }}
            className={
              Number(page) === 1 ? "opacity-50 pointer-events-none" : undefined
            }
          />
        </PaginationItem>
        {getPageArray(totalPage, Number(page)).map((val, idx: number) =>
          val === "ellipsis" ? (
            <PaginationItem key={idx}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={idx}>
              <PaginationLink
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(Number(val));
                }}
                isActive={Number(page) === val}
              >
                {val}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              goToPage(Math.min(Number(page) + 1, totalPage));
            }}
            className={
              Number(page) === totalPage
                ? "opacity-50 pointer-events-none"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginations;
