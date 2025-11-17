import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "../NavItems";
import UseDropdownMenu from "../UseDropdownMenu";

const Header = () => {
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
          <NavItems />
        </nav>
        {/* User dropDown */}
        <UseDropdownMenu />
      </div>
    </header>
  );
};

export default Header;
