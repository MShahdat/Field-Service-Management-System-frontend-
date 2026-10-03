import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const TechnicianDashboardpage = () => {
  return (
    <div>
      technician page
      <Link href={"/"}>
        <Button>home</Button>
      </Link>
    </div>
  );
};

export default TechnicianDashboardpage;
