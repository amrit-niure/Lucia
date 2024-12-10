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
  SkillsAssessmentInput,
  SkillsAssessmentInputSchema,
} from "@/types/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkillsAssessment,
  updateSkillsAssessment,
} from "@/features/actions/skills-assessment/actions";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Customer, SkillsAssessment } from "@prisma/client";
import { CustomCalendar } from "@/app/components/custom-calender";

interface SkillsAssessmentProps {
  initialData?: SkillsAssessment & { customer: Customer };
}

export default function SkillsAssessmentForm({
  initialData,
}: SkillsAssessmentProps) {
  const router = useRouter();
  const [isEditing] = useState(!!initialData);
  const queryClient = useQueryClient();

  const form = useForm<SkillsAssessmentInput>({
    resolver: zodResolver(SkillsAssessmentInputSchema),
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
          applicationDate: initialData.applicationDate
            ? new Date(initialData.applicationDate)
            : undefined,
          assessingAuthority: initialData.assessingAuthority,
          stage: initialData.stage,
          outcomeDate: initialData.outcomeDate
            ? new Date(initialData.outcomeDate)
            : undefined,
          occupation: initialData.occupation,
          outcomeResult: initialData.outcomeResult ?? "PENDING",
          totalAmount: initialData.totalAmount,
          totalPaid: initialData.totalPaid,
          rpl: initialData.rpl,
        }
      : {
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          address: "",
          phone: "",
          currentVisa: null,
          passportNumber: "",
          totalAmount: 0,
          totalPaid: 0,
          occupation: "",
          assessingAuthority: "",
          applicationDate: new Date(),
          stage: "STAGE_1",
          outcomeResult: "PENDING",
          outcomeDate: undefined,
          rpl: "",
          visaExpiry: undefined,
        },
  });
  const createMutation = useMutation({
    mutationFn: createSkillsAssessment,
    onSuccess: ({ success, error }) => {
      queryClient.invalidateQueries({ queryKey: ["skills-assessment"] });
      if (success) {
        toast({
          title: "Success",
          description: "Skills Assessment application successfully recorded.",
        });
      } else if (!success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Failed to create skils assessment application",
        });
      }
      form.reset();
      router.push("/dashboard/skills-assessment");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Unknown error occoured",
      });
      form.reset();
      router.push("/dashboard/skills-assessment");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: {
      id: string;
      data: Partial<SkillsAssessmentInput>;
    }) => updateSkillsAssessment(params.id, params.data),
    onSuccess: ({ success, error }) => {
      queryClient.invalidateQueries({ queryKey: ["skills-assessment"] });
      if (success) {
        toast({
          title: "Success",
          description: "Skills Assessment application successfully recorded.",
        });
      } else if (!success) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error || "Failed to create Skills Assessment application",
        });
      }
      form.reset();
      router.push("/dashboard/skills-assessment");
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

  const handleFormSubmit = (data: SkillsAssessmentInput) => {
    if (isEditing && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="pt-0">
        <Link href={"/dashboard/skills-assessment"}>
          <Button variant={"link"} className="self-start px-0 flex gap-2 py-8">
            <ArrowLeft size={"15"} /> Back
          </Button>
        </Link>
        <CardTitle>
          {isEditing
            ? "Edit Skills Assessment Application"
            : "Create Skills Assessment Application"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the details of the JRP application."
            : "Fill in the details to create a new Skills Assessment application."}
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
                name="visaExpiry"
                render={({ field }) => (
                  <FormItem className="flex flex-col self-end">
                    <FormLabel>Current Visa Expiry</FormLabel>
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
                name="assessingAuthority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessing Authority</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                          <SelectValue placeholder="Select stage status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STAGE_1">STAGE_1</SelectItem>
                        <SelectItem value="STAGE_2">STAGE_2</SelectItem>
                        <SelectItem value="INTERVIEW">INTERVIEW</SelectItem>
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
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="applicationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col self-end">
                    <FormLabel>Applied Date</FormLabel>
                    <FormControl>
                      <CustomCalendar
                        date={field.value ?? undefined}
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
                name="rpl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RPL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outcomeDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col self-end">
                    <FormLabel>Outcome Date</FormLabel>
                    <FormControl>
                      <CustomCalendar
                        date={field.value ?? undefined}
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
