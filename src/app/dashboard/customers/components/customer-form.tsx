"use client";
import { useState, useCallback } from "react";
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
import { CustomerInputSchema } from "@/types/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCustomer,
  updateCustomer,
} from "@/features/actions/customers/actions";
import Link from "next/link";
import { Customer } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CustomCalendar } from "@/app/components/custom-calender";
interface CustomerFormProps {
  initialData?: Customer;
}

export default function CustomerForm({ initialData }: CustomerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing] = useState(!!initialData);
  const queryClient = useQueryClient();

  const form = useForm<Customer>({
    resolver: zodResolver(CustomerInputSchema),
    defaultValues: initialData || {
      firstName: "",
      middleName: undefined,
      lastName: "",
      email: "",
      address: "",
      passportNumber: undefined,
      currentVisa: undefined,
      visaExpiry: undefined,
      phone: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        variant: "default",
        title: `Registered`,
        description: "Customer Registered successfully",
      });
      form.reset();
      router.push("/dashboard/customers");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `Registration`,
        description: `${error.message}`,
      });
      form.reset();
      router.push("/dashboard/customers");
    },
  });

  const { isPending } = createMutation;

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; data: Partial<Customer> }) =>
      updateCustomer(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        variant: "default",
        title: `Updated`,
        description: "Customer Updated successfully",
      });
      form.reset();
      router.push("/dashboard/customers");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `Registration`,
        description: `${error.message}`,
      });
      form.reset();
      router.push("/dashboard/customers");
    },
  });

  const handleFormSubmit = useCallback(
    (data: Customer) => {
      try {
        if (isEditing && initialData?.id) {
          updateMutation.mutate({ id: initialData.id, data: data });
        } else {
          createMutation.mutate(data);
        }
      } catch (error) {
        if (error instanceof Error) {
          return {
            error: error.message,
          };
        } else {
          return {
            error: "An unknown error occurred",
          };
        }
      }
    },
    [isEditing, initialData, updateMutation, createMutation],
  );
  return (
    <div className="w-full">
      <CardHeader className="pt-0">
        <Link href={"/dashboard/customers"}>
          <Button variant={"link"} className="self-start px-0 flex gap-2 py-8">
            <ArrowLeft size={"15"} /> Back
          </Button>
        </Link>
        <CardTitle>{isEditing ? "Edit Customer" : "Create Customer"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the details of the customer."
            : "Fill in the details to create a new customer."}
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
                    <FormLabel>
                      First Name{" "}
                      <span className="text-red-500" title="Required">
                        *
                      </span>
                    </FormLabel>
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
                    <FormLabel>
                      Last Name{" "}
                      <span className="text-red-500" title="Required">
                        *
                      </span>
                    </FormLabel>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email{" "}
                    <span className="text-red-500" title="Required">
                      *
                    </span>
                  </FormLabel>
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
                  <FormLabel>
                    Address{" "}
                    <span className="text-red-500" title="Required">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                name="currentVisa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Visa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visaExpiry"
                render={({ field }) => (
                  <FormItem className="flex flex-col self-end">
                    <FormLabel>Visa Expiry Date</FormLabel>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full py-2" disabled={isPending}>
              {isEditing ? "Update Customer" : "Register Customer"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
