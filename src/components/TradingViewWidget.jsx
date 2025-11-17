"use client";
import React, { useRef, memo } from "react";
import useTradingViewWidget from "../../hooks/UseTrandingViewWidget";
import { cn } from "@/lib/utils";

function TradingViewWidget({
  title,
  scriptUrl,
  config,
  height = 600,
  className,
}) {
  const container = useTradingViewWidget(scriptUrl, config, height);
  console.log(container);

  return (
    <div className="w-full">
      {title && (
        <h3 className="font-semibold text-gray-100 text-2xl mb-5">{title}</h3>
      )}
      <div
        className={cn("tradingview-widget-container", className)}
        ref={container}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height, width: "100%" }}
        ></div>
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
            rel="noopener nofollow"
            target="_blank"
          >
            <span className="blue-text">AAPL stock chart</span>
          </a>
          <span className="trademark"> by TradingView</span>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
