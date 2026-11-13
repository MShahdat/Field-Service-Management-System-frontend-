import React from "react";
import { ItemShow } from "./items-show";
import SearchBar from "./search-bar";

type Props = {
  label: string;
  controls?: React.ReactNode;
};


const Header = ({ label, controls }: Props) => {
  return (
    <div className="relative rounded-2xl border border-border bg-card px-4 sm:px-5 py-4">
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <p className="whitespace-nowrap text-lg sm:text-xl font-semibold">
              {label ?? "-"}
            </p>
            <SearchBar />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {controls && (
            <div className="flex flex-wrap items-center gap-3">
              {controls}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
