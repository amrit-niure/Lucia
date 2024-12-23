"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  Award,
  Book,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  DownloadCloud,
  Inbox,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavItems } from "./nav-items";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCollapse } from "@/store/useCollapse";

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useCollapse();

  return (
    <div
      className={cn(
        "relative h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col justify-between h-screen border-r border-muted bg-">
        <div className="flex flex-col justify-between h-full">
          <div className="">
            <div className="flex items-center p-4 justify-center">
              <Image
                width={80}
                height={60}
                src="/our-company.png"
                alt="Logo"
                className="transition-all duration-300 ease-in-out"
              />
              {/* {!isCollapsed && (
                <span className="ml-2 font-bold text-lg transition-opacity duration-300 ease-in-out">
                  CRM
                </span>
              )} */}
            </div>
            <Separator />
          </div>
          <div className=" flex flex-1 flex-col justify-between ">
            <NavItems
              links={[
                {
                  title: "Home",
                  icon: Inbox,
                  variant: "ghost",
                  url: "/dashboard",
                },
                {
                  title: "Appointments",
                  icon: Book,
                  variant: "ghost",
                  url: "/dashboard/appointments",
                },
                {
                  title: "Enquiries",
                  icon: CircleHelp,
                  variant: "ghost",
                  url: "/dashboard/enquiries",
                },
                // {
                //   title: "Calender",
                //   icon: Calendar,
                //   variant: "ghost",
                //   url: "/dashboard/calender",
                // },
                {
                  title: "Customers",
                  icon: Users,
                  variant: "ghost",
                  url: "/dashboard/customers",
                },
                {
                  title: "Visa Applications",
                  icon: DownloadCloud,
                  variant: "ghost",
                  url: "/dashboard/visa-applications",
                },
                {
                  title: "Job Ready Program",
                  icon: Briefcase,
                  variant: "ghost",
                  url: "/dashboard/job-ready-program",
                },
                {
                  title: "Skills Assesment",
                  icon: Award,
                  variant: "ghost",
                  url: "/dashboard/skills-assessment",
                },
                {
                  title: "Companies",
                  icon: Building2,
                  variant: "ghost",
                  url: "/dashboard/companies",
                },
                {
                  title: "Team",
                  icon: Users,
                  variant: "ghost",
                  url: "/dashboard/team",
                },
              ]}
              isCollapsed={isCollapsed}
              activePath={pathname}
            />
            <div>
              <Separator />
              <NavItems
                links={[
                  {
                    title: "Updates",
                    icon: AlertCircle,
                    variant: "ghost",
                    url: "/dashboard/updates",
                  },
                ]}
                isCollapsed={isCollapsed}
                activePath={pathname}
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-4 right-1 md:flex ${
          isCollapsed ? "left-3 opacity-0" : ""
        } `}
        onClick={() => setIsCollapsed()}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
