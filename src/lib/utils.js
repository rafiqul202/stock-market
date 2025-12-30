import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getDateRange = (days) => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - days);
  return {
    to: toDate.toISOString().split("T")[0],
    from: fromDate.toISOString().split("T")[0],
  };
};
export function validateArticle(article) {
  return article.headline && article.summary && article.url && article.datetime;
}
export const formatArticle = (article, isCompanyNews, symbol, index) => ({
  id: isCompanyNews ? Date.now() + Math.random() : article.id + index,
  headline: article.headline.trim(),
  summary:
    article.summary.trim().substring(0, isCompanyNews ? 200 : 150) + "...",
  source: article.source || (isCompanyNews ? "Company News" : "Market News"),
  url: article.url,
  datetime: article.datetime,
  image: article.image || "",
  category: isCompanyNews ? "company" : article.category || "general",
  related: isCompanyNews ? symbol : article.related || "",
});
export const formatDateToday = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});
