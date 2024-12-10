"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Customer, JobReadyProgram } from "@prisma/client";
import { JobReadyProgramInput } from "@/types/schema";
import { checkAuth } from "@/lib/checkAuth";

export async function createJrpApplication(data: JobReadyProgramInput) {
  try {
    await checkAuth();
    const {
      firstName,
      middleName,
      lastName,
      email,
      address,
      phone,
      passportNumber,
      visaExpiry,
      currentVisa,
      ...jrpData
    } = data;
    // create customer record
    const customer = await prisma.customer.create({
      data: {
        firstName,
        middleName,
        lastName,
        email,
        address,
        phone,
        passportNumber,
        visaExpiry,
        currentVisa,
      },
    });
    // create application record
    const application = await prisma.jobReadyProgram.create({
      data: {
        ...jrpData,
        customerId: customer.id,
      },
    });

    revalidatePath("/job-ready-program");
    return { success: true, data: application };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to create application record" };
  }
}

export async function updateJrpApplication(
  id: string,
  data: Partial<JobReadyProgramInput & { customer: Customer }>,
) {
  await checkAuth();

  const {
    firstName,
    middleName,
    lastName,
    email,
    address,
    phone,
    passportNumber,
    visaExpiry,
    currentVisa,
    ...jrpData
  } = data;

  try {
    const updatedApplication = await prisma.jobReadyProgram.update({
      where: { id },
      data: {
        ...jrpData,
        customer: {
          update: {
            firstName,
            middleName,
            lastName,
            email,
            address,
            phone,
            passportNumber,
            visaExpiry,
            currentVisa,
          },
        },
      },
    });
    revalidatePath("/job-ready-program");

    return { success: true, data: updatedApplication };
  } catch (error) {
    console.error("Error updating application record:", error);
    return { success: false, error: "Failed to update application record" };
  }
}

export async function getJrpApplication(
  id: string,
): Promise<(JobReadyProgram & { customer: Customer }) | null> {
  await checkAuth();

  try {
    const application = await prisma.jobReadyProgram.findFirst({
      where: {
        id,
      },
      include: {
        customer: true,
      },
    });
    return application;
  } catch (error) {
    console.error("Error fetching visa application:", error);
    throw new Error("Failed to fetch visa application");
  }
}
export async function getAllJrpApplication(): Promise<
  (JobReadyProgram & { customer: Customer })[] | null
> {
  await checkAuth();

  try {
    const applications = await prisma.jobReadyProgram.findMany({
      include: {
        customer: true,
      },
    });
    return applications;
  } catch (error) {
    console.error("Error fetching JRP applications:", error);
    throw new Error("Failed to fetch JRP applications");
  }
}

export async function deleteJrpApplication(id: string) {
  await checkAuth();
  try {
    await prisma.jobReadyProgram.delete({
      where: {
        id,
      },
    });
    revalidatePath("/job-ready-program");
    return { success: true };
  } catch (error) {
    console.error("Error deleting JRP application:", error);
    return { success: false, error: "Failed to delete JRP application" };
  }
}
