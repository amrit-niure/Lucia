"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  JobReadyProgramInput,
  JobReadyProgramInputSchema,
} from "@/types/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createJrpApplication,
  updateJrpApplication,
} from "@/features/actions/job-ready-program/actions";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Customer, JobReadyProgram } from "@prisma/client";
import { CustomCalendar } from "@/app/components/custom-calender";

interface JRPProps {
  initialData?: JobReadyProgram & { customer: Customer };
}

export default function JRPFrom({ initialData }: JRPProps) {
  const router = useRouter();
  const [isEditing] = useState(!!initialData);
  const queryClient = useQueryClient();

  const form = useForm<JobReadyProgramInput>({
    resolver: zodResolver(JobReadyProgramInputSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          firstName: initialData.customer.firstName ?? "",
          middleName: initialData.customer.middleName ?? "",
          lastName: initialData.customer.lastName ?? "",
          email: initialData.customer.email ?? "",
          address: initialData.customer.address ?? "",
          passportNumber: initialData.customer.passportNumber ?? "",
          currentVisa: initialData.customer.currentVisa ?? undefined,
          visaExpiry: initialData.customer.visaExpiry ?? undefined,
          phone: initialData.customer.phone ?? "",
          workplacement: initialData.workplacement ?? undefined,
          employerName: initialData.employerName ?? undefined,
          employerABN: initialData.employerABN ?? undefined,
          supervisorName: initialData.supervisorName ?? undefined,
          supervisorContact: initialData.supervisorContact ?? undefined,
          startDate: initialData.startDate ?? undefined,
          completionDate: initialData.completionDate ?? undefined,
          jrpUserId: initialData.jrpUserId ?? undefined,
          jrpPassword: initialData.jrpPassword ?? undefined,
          question1: initialData.question1 ?? undefined,
          question2: initialData.question2 ?? undefined,
          question3: initialData.question3 ?? undefined,
          totalAmount: initialData.totalAmount,
          totalPaid: initialData.totalPaid,
        }
      : {
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          address: "",
          passportNumber: "",
          currentVisa: undefined,
          visaExpiry: undefined,
          phone: "",
          startDate: undefined,
          stage: "JRE",
          workplacement: undefined,
          employerName: undefined,
          employerABN: undefined,
          supervisorName: undefined,
          supervisorContact: undefined,
          completionDate: undefined,
          outcomeResult: "PENDING",
          jrpUserId: undefined,
          jrpPassword: undefined,
          question1: undefined,
          question2: undefined,
          question3: undefined,
          totalAmount: 0,
          totalPaid: 0,
        },
  });

  const createMutation = useMutation({
    mutationFn: createJrpApplication,
    onSuccess: ({ success, error }) => {
      queryClient.invalidateQueries({ queryKey: ["visaApplications"] });
      if (success) {
        toast({
          title: "Success",
          description: "JRP application successfully recorded.",
        });
      } else if (!success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Failed to create visa application",
        });
      }
      form.reset();
      router.push("/dashboard/job-ready-program");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Unknown error occoured",
      });
      form.reset();
      router.push("/dashboard/job-ready-program");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; data: Partial<JobReadyProgramInput> }) =>
      updateJrpApplication(params.id, params.data),
    onSuccess: ({ success, error }) => {
      queryClient.invalidateQueries({ queryKey: ["visaApplications"] });
      if (success) {
        toast({
          title: "Success",
          description: "Visa application successfully recorded.",
        });
      } else if (!success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Failed to create visa application",
        });
      }
      form.reset();
      router.push("/dashboard/job-ready-program");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Unknown error occoured",
      });
      form.reset();
      router.push("/dashboard/job-ready-program");
    },
  });

  const handleFormSubmit = (data: JobReadyProgramInput) => {
    if (isEditing && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="pt-0">
        <Link href={"/dashboard/job-ready-program"}>
          <Button variant={"link"} className="self-start px-0 flex gap-2 py-8">
            <ArrowLeft size={"15"} /> Back
          </Button>
        </Link>
        <CardTitle>
          {isEditing ? "Edit JRP Application" : "Create JRP Application"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the details of the JRP application."
            : "Fill in the details to create a new JRP application."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? undefined} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentVisa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Visa</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select applied Visa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SUB_500">500</SelectItem>
                        <SelectItem value="SUB_482">482</SelectItem>
                        <SelectItem value="SUB_485">485</SelectItem>
                        <SelectItem value="SUB_407">407</SelectItem>
                        <SelectItem value="SUB_186">186</SelectItem>
                        <SelectItem value="SUB_189">189</SelectItem>
                        <SelectItem value="SUB_190">190</SelectItem>
                        <SelectItem value="SUB_600">600</SelectItem>
                        <SelectItem value="SUB_820">820</SelectItem>
                        <SelectItem value="SUB_801">801</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col self-end">
                    <FormLabel>JRP Start Date</FormLabel>
                    <FormControl>
                      <CustomCalendar
                        date={field.value ?? new Date()}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="completionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col self-end">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <CustomCalendar
                        date={field.value ?? new Date()}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visa status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PSA">PSA</SelectItem>
                        <SelectItem value="JRE">JRE</SelectItem>
                        <SelectItem value="JRWA">JRWA</SelectItem>
                        <SelectItem value="JRFA">JRFA</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="workplacement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Placement</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employerABN"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer ABN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supervisorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supervisorContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor Contact</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outcomeResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outcome Result</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select current Visa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SUCCESSFUL">SUCCESSFUL</SelectItem>
                        <SelectItem value="UNSUCCESSFUL">
                          UNSUCCESSFUL
                        </SelectItem>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Paid</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jrpUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JRP User Id</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jrpPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credentials</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="question1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question and Answer 1</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question and Answer 2</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="question3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question and Answer 3</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full py-2">
              {isEditing ? "Update Application" : "Create Application"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
