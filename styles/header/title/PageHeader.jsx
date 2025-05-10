"use client"; // Marking this as a client component

import React from "react";
import { usePathname } from "next/navigation"; // Correct import for Next.js routing

const PageHeader = ({ title }) => {
  const pathname = usePathname(); // Using Next.js's hook to get the current path

  return (
    <div>
      <section className="pageHeader">
        <div className="page-header-box">
          <h2>
            Home <span>⇒</span> {pathname.split("/")[1]} {/* Splitting pathname */}
          </h2>
          <h1>{title}</h1>
        </div>
      </section>
    </div>
  );
};

export default PageHeader;
