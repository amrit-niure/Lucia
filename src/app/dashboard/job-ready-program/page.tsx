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
  ArrowDownIcon,
  ArrowUp,
  ArrowUpIcon,
  Calendar,
  ChevronDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  Edit,
  MoreHorizontal,
  RefreshCwIcon,
  SearchIcon,
  Trash,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteJrpApplication,
  getAllJrpApplication,
} from "@/features/actions/job-ready-program/actions";
import LoadingSpinner from "@/app/components/loading-spinner";
import { toast } from "@/hooks/use-toast";

export default function JobReadyProgram() {
  const queryClient = useQueryClient();
  const [sort, setSort] = useState({ by: "startDate", order: "asc" });
  const [filters, setFilters] = useState({
    stage: "all",
    outcome: "all",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortOptions = [
    { label: "Date", value: "startDate", icon: Calendar },
    { label: "Name", value: "programType", icon: User },
  ];
  // Handle sorting
  const handleSort = (value: string) => {
    setSort((prevSort) => ({
      by: value,
      order: prevSort.by === value && prevSort.order === "asc" ? "desc" : "asc",
    }));
  };

  // Handle filtering
  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
  };
  //handle delete
  const mutation = useMutation({
    mutationFn: deleteJrpApplication,
    onSuccess: ({ success, error }) => {
      queryClient.invalidateQueries({ queryKey: ["jrpApplications"] });
      if (success) {
        toast({
          title: "Success",
          description: "JRP application successfully deleted.",
        });
      } else if (!success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Failed to create delete application",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Unknown error occoured",
      });
    },
  });

  // Handle delete
  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jrpApplications"],
    queryFn: () => getAllJrpApplication(),
  });

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  if (isError) return <p>Error: {error.message}</p>;

  const jrpAppplications = data || [];

  // Filter data
  const filteredData = jrpAppplications.filter((item) => {
    const searchText = filters.search.toLowerCase();
    const customer = item.customer;
    return (
      (filters.stage === "all" || item.stage === filters.stage) &&
      (filters.outcome === "all" || item.outcomeResult === filters.outcome) &&
      (customer.firstName.toLowerCase().includes(searchText) ||
        customer.email.toLowerCase().includes(searchText))
    );
  });

  // Sort data
  const sortedApplications = [...filteredData].sort((a, b) => {
    const aValue = a[sort.by] ?? "";
    const bValue = b[sort.by] ?? "";

    if (aValue < bValue) return sort.order === "asc" ? -1 : 1;
    if (aValue > bValue) return sort.order === "asc" ? 1 : -1;
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
            JobReadyProgram Applications
          </CardTitle>
          <Button onClick={() => setCurrentPage(1)}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Manage and track JobReady Program applications
        </CardDescription>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Applications
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{0}</div>
            <p className="text-xs text-muted-foreground">
              {appliedToday === 1 ? "application" : "applications"}
              scheduled for today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Week&apos;s Applications
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{0}</div>
            <p className="text-xs text-muted-foreground">
              {appliedThisWeek === 1 ? "application" : "applications"} {""}
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
              {appliedThisMonth === 1 ? "application" : "applications"} {""}
              this month
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
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-[12rem]">
            <label htmlFor="stage" className="text-sm font-medium">
              Stage
            </label>
            <Select
              value={filters.stage}
              onValueChange={(value) => handleFilterChange("stage", value)}
            >
              <SelectTrigger id="stage">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="JRE"> JRE</SelectItem>
                <SelectItem value="JRWA">JRWA</SelectItem>
                <SelectItem value="JRFA">JRFA</SelectItem>
                <SelectItem value="PSA">PSA</SelectItem>
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
                  {sortOptions.find((option) => option.value === sort.by)
                    ?.icon &&
                    React.createElement(
                      sortOptions.find((option) => option.value === sort.by)!
                        .icon,
                      { className: "mr-2 h-4 w-4" },
                    )}
                  Sort by{" "}
                  {
                    sortOptions.find((option) => option.value === sort.by)
                      ?.label
                  }
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
                  {sort.by === option.value &&
                    (sort.order === "asc" ? (
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
            onClick={() => handleSort(sort.by)} // This will toggle the sort order
            className="px-3"
          >
            {sort.order === "asc" ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
          </Button>
          <Link href={"job-ready-program/create"}>
            <Button className="w-full md:w-auto">Add New Record</Button>
          </Link>
        </div>
      </CardContent>
      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="px-4 py-4">S.N</TableHead>
              <TableHead className="px-4 py-4">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Work Placement</TableHead>
              <TableHead>Employer Name Type</TableHead>
              <TableHead>ABN</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Supervisor Contact</TableHead>
              <TableHead>Completion Date</TableHead>
              <TableHead>User Id</TableHead>
              <TableHead>Credentials</TableHead>
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
                <TableCell>{item.startDate?.toDateString()}</TableCell>
                <TableCell>{item.completionDate?.toDateString()}</TableCell>
                <TableCell>{item.stage}</TableCell>
                <TableCell>{item.workplacement}</TableCell>
                <TableCell>{item.employerName}</TableCell>
                <TableCell>{item.employerABN}</TableCell>
                <TableCell>{item.supervisorName}</TableCell>
                <TableCell>{item.supervisorContact}</TableCell>
                <TableCell>{item.completionDate?.toDateString()}</TableCell>
                <TableCell>{item.jrpUserId}</TableCell>
                <TableCell>{item.jrpPassword}</TableCell>
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
                          href={`job-ready-program/update/${item.id}`}
                          className="flex items-center"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
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
