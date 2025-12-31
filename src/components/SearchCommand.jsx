"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "./ui/command";
import {Loader2,  TrendingUp} from "lucide-react";
import Link from "next/link";

const SearchCommand = ({ renderAs, label, initialStocks }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState(initialStocks);
  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);
  useEffect(() => {
    const onKeydown = (e) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);
  return (
    <div>
      {renderAs === "text" ? (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="search-dialog"
      >
        <div className="search-field">
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search stocks..."
            className="search-input"
          />
          {loading && <Loader2 className="animate-spin search-loader" />}
        </div>
        <CommandList>
          {loading ? (
            <CommandEmpty className="search-list-empty">
              Loading stocks...
            </CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? "No Result Found " : "No Stocks Available "}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? "Search Result " : "Popular Stocks"}
                {displayStocks?.length || 0}
                  </div>
                  {
                    displayStocks?.map((stock, i) => (
                      <li key={stock.symble} className="search-item">
                        <Link href={`/stocks/${stock.symbol}`} className="search-item-link">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <div className="search-item-name">
                              {stock.name}
                            </div>

                          </div>
                        </Link>

                      </li>
                    ))
                  }
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SearchCommand;
