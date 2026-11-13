"use client";

import { HeroSection } from "@/shared/hero";
import HowWhy from "@/shared/how-why";
import { useGetAllTech } from "@/hooks";
import { useGetCategories } from "@/hooks";
import TechnicianLists from "@/components/module/technician/technician-lists";
import PublicCategoryLists from "@/components/module/cetegory/pub-category-list";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CardSkeleton } from "@/loading";

const FEATURED_COUNT = "3";

const FeaturedTechnicians = () => {
  const { data, isPending, isError } = useGetAllTech({
    limit: FEATURED_COUNT,
  });

  if (isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        <Card>
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle className="text-lg font-semibold">
              Featured Technicians
            </CardTitle>
            <Link
              href="/technician"
              className="text-sm flex items-center gap-1 font-medium text-primary hover:underline"
            >
              See all technicians{" "}
              <ArrowRight className=" size-4" />
            </Link>
          </CardHeader>
        </Card>
        <CardSkeleton length={3} />
      </div>
    );
  }

  if (isError || !data?.success) {
    return null;
  }

  const technicians = data.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <Card>
        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle className="text-lg font-semibold">
            Featured Technicians
          </CardTitle>
          <Link
            href="/technician"
            className="text-sm flex items-center gap-1 font-medium text-primary hover:underline"
          >
            See all technicians{" "}
            <ArrowRight className="size-4" />
          </Link>
        </CardHeader>
      </Card>

      <TechnicianLists
        technicians={technicians}
        className="grid-cols-1 lg:grid-cols-3 gap-5"
      />
    </div>
  );
};

const FeaturedCategories = () => {
  const { data, isPending, isError } = useGetCategories({
    limit: FEATURED_COUNT,
  });

  if (isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        <Card>
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle className="text-lg font-semibold">
              Service Categories
            </CardTitle>
            <Link
              href="/category"
              className="text-sm flex items-center gap-1 font-medium text-primary hover:underline"
            >
              See all categories{" "}
              <ArrowRight className="size-4" />
            </Link>
          </CardHeader>
        </Card>
        <CardSkeleton length={3} />
      </div>
    );
  }

  if (isError || !data?.success) {
    return null;
  }

  const categories = data.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <Card>
        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle className="text-lg font-semibold">
            Service Categories
          </CardTitle>
          <Link
            href="/category"
            className="text-sm flex items-center gap-1 font-medium text-primary hover:underline"
          >
            See all categories{" "}
            <ArrowRight className="size-4" />
          </Link>
        </CardHeader>
      </Card>

      <PublicCategoryLists
        categories={categories}
        className="grid-cols-1 lg:grid-cols-3 gap-4"
      />
    </div>
  );
};

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <FeaturedTechnicians />
      <FeaturedCategories />
      <HowWhy />
    </div>
  );
}
