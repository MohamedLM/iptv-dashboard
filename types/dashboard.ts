import { ReactNode } from "react";

export type SearchParams = {
  s: string;
  page: number;
  pageSize: number;
  column?: string;
  direction?: string;
  [key: string]: any;
};

export type PageProps = {
  params: {
    siteId: string;
  };
  searchParams: SearchParams;
};

export type SitePageProps = {
  params: {
    siteId: string;
  };
  searchParams: SearchParams;
};

export type SiteLayoutProps = {
  children: ReactNode;
  params: { siteId: string };
};

export type MenuProps = {
  title: string;
  icon?: ReactNode;
  path?: string;
  siteId?: string;
  menus?: MenuProps[];
  items?: Array<{ title: string; path: string; }>;
  cap?: string;
};
