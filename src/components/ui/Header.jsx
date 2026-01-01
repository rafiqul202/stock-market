import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "../NavItems";
import UseDropdownMenu from "../UseDropdownMenu";
import { searchStocks } from "@/lib/action/finnhub.actions";

const Header = async ({ user }) => {
  const initialStocks = await searchStocks();
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href={"/"}>
          <Image
            src={"/assets/icons/logo.svg"}
            alt="Signalist Logo"
            width={140}
            height={32}
            className="cursor-pointer h-8 w-auto"
          />
        </Link>
        <nav className="hidden sm:block">
          {/* NavItems */}
          <NavItems initialStocks={initialStocks} />
        </nav>
        {/* User dropDown */}
        <UseDropdownMenu user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
};

export default Header;
