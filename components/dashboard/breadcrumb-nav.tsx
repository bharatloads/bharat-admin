"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments
    .map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Handle user ID segment
      if (segment === "user" && segments[index + 1]) {
        label = "User Details";
      } else if (segments[index - 1] === "user") {
        return null; // Skip the ID segment in breadcrumb
      }

      return {
        href,
        label,
      };
    })
    .filter(Boolean);

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbs.map(
        (crumb, index) =>
          crumb && (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <Link
                href={crumb.href}
                className={`px-2 py-1 hover:text-foreground ${
                  index === breadcrumbs.length - 1
                    ? "text-foreground font-medium"
                    : ""
                }`}
              >
                {crumb.label}
              </Link>
            </div>
          )
      )}
    </nav>
  );
}
