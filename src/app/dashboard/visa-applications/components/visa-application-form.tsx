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
  VisaApplicationInput,
  VisaApplicationInputSchema,
} from "@/types/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createVisaApplication,
  updateVisaApplication,
} from "@/features/actions/visa-applications/actions";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Customer, VisaApplication } from "@prisma/client";
import { CustomCalendar } from "@/app/components/custom-calender";

interface VisaApplicationFormProps {
  initialData?: VisaApplication & { customer: Customer };
}

export default function VisaApplicationForm({
  initialData,
}: VisaApplicationFormProps) {
  const router = useRouter();
  const [isEditing] = useState(!!initialData);
  const queryClient = useQueryClient();

  const form = useForm<VisaApplicationInput>({
    resolver: zodResolver(VisaApplicationInputSchema),
    defaultValues: initialData
      ? {
          firstName: initialData.customer.firstName,
          middleName: initialData.customer.middleName,
          lastName: initialData.customer.lastName,
          email: initialData.customer.email,
          address: initialData.customer.address,
          phone: initialData.customer.phone,
          currentVisa: initialData.customer.currentVisa,
          visaExpiry: initialData.customer.visaExpiry
            ? new Date(initialData.customer.visaExpiry)
            : null,
          passportNumber: initialData.customer.passportNumber,
          visaAppliedDate: new Date(initialData.visaAppliedDate),
          visaStatus: initialData.visaStatus,
          visaType: initialData.visaType,
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
          visaAppliedDate: new Date(),
          visaStatus: "PENDING",
          visaType: undefined,
          totalAmount: 0,
          totalPaid: 0,
          currentVisa: undefined,
          visaExpiry: new Date(),
          phone: "",
        },
  });

  const createMutation = useMutation({
    mutationFn: createVisaApplication,
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
      router.push("/dashboard/visa-applications");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Unknown error occoured",
      });
      form.reset();
      router.push("/dashboard/visa-applications");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; data: Partial<VisaApplication> }) =>
      updateVisaApplication(params.id, params.data),
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
      router.push("/dashboard/visa-applications");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Unknown error occoured",
      });
      form.reset();
      router.push("/dashboard/visa-applications");
    },
  });

  const handleFormSubmit = (data: VisaApplicationInput) => {
    if (isEditing && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="pt-0">
        <Link href={"/dashboard/visa-applications"}>
          <Button variant={"link"} className="self-start px-0 flex gap-2 py-8">
            <ArrowLeft size={"15"} /> Back
          </Button>
        </Link>
        <CardTitle>
          {isEditing ? "Edit Visa Application" : "Create Visa Application"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the details of the visa application."
            : "Fill in the details to create a new visa application."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
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
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={
                          initialData?.customer.passportNumber || undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Visa</FormLabel>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visaStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visa Status</FormLabel>
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
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="APPROVED">APPROVED</SelectItem>
                        <SelectItem value="REJECTED">REJECTED</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applied - Visa Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visaAppliedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col self-end">
                    <FormLabel>Visa Applied Date</FormLabel>
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
                name="visaExpiry"
                render={({ field }) => (
                  <FormItem className="flex flex-col self-end">
                    <FormLabel>New Visa Expiry Date</FormLabel>
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
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
