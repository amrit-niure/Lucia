"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { filterCustomersByRange } from "@/lib/date-calc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  Edit,
  MoreHorizontal,
  RefreshCwIcon,
  SearchIcon,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllVisaApplication } from "@/features/actions/visa-applications/actions";
import LoadingSpinner from "@/app/components/loading-spinner";

interface Visa {
  id: number;
  name: string;
  email: string;
  address: string;
  passportNumber: string;
  visaAppliedDate: string; // ISO 8601 date format
  visaStatus: string;
  previousVisa: string;
  visaType: string;
  totalAmount: number;
  totalPaid: number;
  overseer: string;
}

export default function Component() {
  const [sortBy, setSortBy] = useState("visaAppliedDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [visaFilter, setVisaFilter] = useState("all");
  const itemsPerPage = 5;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["visa-applications"],
    queryFn: () => getAllVisaApplication(),
  });

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  if (isError) return <p>Error: {error.message}</p>;

  const visaApplications = data || [];

  // Filter and search functionality
  const filteredData = visaApplications.filter(
    (item) =>
      (statusFilter === "all" || item.visaStatus === statusFilter) &&
      (visaFilter === "all" || item.visaType === visaFilter) &&
      (item.customer.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        item.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.passportNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())),
  );

  const sortOptions = [
    { label: "Date", value: "visaAppliedDate", icon: Calendar },
    { label: "Name", value: "firstName", icon: User },
  ];

  const handleSort = (value: string) => {
    if (sortBy === value) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(value);
      setSortOrder("asc");
    }
  };
  const sortedApplications = [...filteredData].sort((a, b) => {
    if (a[sortBy as keyof Visa] < b[sortBy as keyof Visa])
      return sortOrder === "asc" ? -1 : 1;
    if (a[sortBy as keyof Visa] > b[sortBy as keyof Visa])
      return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = sortedApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const appliedToday = filterCustomersByRange(sortedApplications, "today");
  const appliedThisWeek = filterCustomersByRange(sortedApplications, "week");
  const appliedThisMonth = filterCustomersByRange(sortedApplications, "month");

  return (
    <div className="min-h-screen">
      <CardHeader className="space-y-1 px-0 pt-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Visa Applications
          </CardTitle>
          <Button onClick={() => setCurrentPage(1)}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <CardDescription>Manage and track visa applications</CardDescription>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{0}</div>
            <p className="text-xs text-muted-foreground">
              {appliedToday === 1 ? "appointment" : "appointments "}
              scheduled for today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Week&apos;s Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{0}</div>
            <p className="text-xs text-muted-foreground">
              {appliedThisWeek === 1 ? "appointment" : "appointments"} scheduled
              this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month&apos;s Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{0}</div>
            <p className="text-xs text-muted-foreground">
              {appliedThisMonth === 1 ? "appointment" : "appointments"}{" "}
              scheduled this month
            </p>
          </CardContent>
        </Card>
      </div>
      <CardContent className="px-0">
        <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
          <div className="flex-1 space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              Search Applications
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                className="pl-8 md:w-1/2"
                placeholder="Search by name, email, or passport number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-[12rem]">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="APPROVED">APPROVED</SelectItem>
                <SelectItem value="REJECTED">REJECTED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className=" w-full md:w-[12rem]">
            <label htmlFor="status" className="text-sm font-medium">
              Visa
            </label>
            <Select value={visaFilter} onValueChange={setVisaFilter}>
              <SelectTrigger id="visa">
                <SelectValue placeholder="Select visa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="SUB_407">407</SelectItem>
                <SelectItem value="SUB_482">482</SelectItem>
                <SelectItem value="SUB_186">186</SelectItem>
                <SelectItem value="SUB_500">500</SelectItem>
                <SelectItem value="SUB_189">189</SelectItem>
                <SelectItem value="SUB_190">190</SelectItem>
                <SelectItem value="SUB_600">600</SelectItem>
                <SelectItem value="SUB_820">820</SelectItem>
                <SelectItem value="SUB_801">801</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[200px] justify-between"
              >
                <span className="flex items-center">
                  {sortOptions.find((option) => option.value === sortBy)
                    ?.icon &&
                    React.createElement(
                      sortOptions.find((option) => option.value === sortBy)!
                        .icon,
                      { className: "mr-2 h-4 w-4" },
                    )}
                  Sort by{" "}
                  {sortOptions.find((option) => option.value === sortBy)?.label}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center">
                    {React.createElement(option.icon, {
                      className: "mr-2 h-4 w-4",
                    })}
                    {option.label}
                  </span>
                  {sortBy === option.value &&
                    (sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    ))}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Link href={"visa-applications/create"}>
            <Button className="w-full md:w-auto">Add New Record</Button>
          </Link>
        </div>
      </CardContent>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="px-4 py-4">S.N</TableHead>
              <TableHead className="px-4 py-4">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Passport Number</TableHead>
              <TableHead>Visa Applied Date</TableHead>
              <TableHead>Visa Status</TableHead>
              <TableHead>Previous Visa</TableHead>
              <TableHead>Visa Type</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Total Paid</TableHead>
              <TableHead>Overseer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 py-4">
                  {(currentPage - 1) * itemsPerPage + 1 + index}
                </TableCell>
                <TableCell className="px-4 py-4">
                  {item.customer.firstName} {item.customer.middleName}{" "}
                  {item.customer.lastName}
                </TableCell>
                <TableCell>{item.customer.email}</TableCell>
                <TableCell>{item.customer.address}</TableCell>
                <TableCell>{item.customer.passportNumber}</TableCell>
                <TableCell>{item.visaAppliedDate?.toDateString()}</TableCell>
                <TableCell>{item.visaStatus}</TableCell>
                <TableCell>{item.customer.currentVisa}</TableCell>
                <TableCell>{item.visaType}</TableCell>
                <TableCell>${item.totalAmount}</TableCell>
                <TableCell>${item.totalPaid}</TableCell>
                <TableCell>{item.overseer}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link
                          href={`visa-applications/update/${item.id}`}
                          className="flex items-center"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} applications
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
