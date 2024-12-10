"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Customer, VisaApplication } from "@prisma/client";
import { VisaApplicationInput } from "@/types/schema";
import { checkAuth } from "@/lib/checkAuth";
export async function createVisaApplication(data: VisaApplicationInput) {
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
      ...visaData
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
    const application = await prisma.visaApplication.create({
      data: {
        ...visaData,
        customerId: customer.id,
      },
    });

    revalidatePath("/visa-applications");
    return { success: true, data: application };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to create application record" };
  }
}

export async function updateVisaApplication(
  id: string,
  data: Partial<VisaApplicationInput & { customer: Customer }>,
) {
  await checkAuth();

  const {
    firstName,
    middleName,
    lastName,
    email,
    address,
    phone,
    visaExpiry,
    passportNumber,
    currentVisa,
    ...applicationData
  } = data;

  try {
    const updatedApplication = await prisma.visaApplication.update({
      where: { id },
      data: {
        ...applicationData,
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

export async function getVisaApplication(
  id: string,
): Promise<(VisaApplication & { customer: Customer }) | null> {
  try {
    const application = await prisma.visaApplication.findFirst({
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
export async function getAllVisaApplication(): Promise<
  (VisaApplication & { customer: Customer })[] | null
> {
  try {
    const applications = await prisma.visaApplication.findMany({
      include: {
        customer: true,
      },
    });
    return applications;
  } catch (error) {
    console.error("Error fetching visa applications:", error);
    throw new Error("Failed to fetch visa applications");
  }
}
export async function deleteVisaApplication(id: string) {
  try {
    await prisma.visaApplication.delete({
      where: { id },
    });
    revalidatePath("/visa-applications");
    return { success: true };
  } catch (error) {
    console.error("Error deleting visa application:", error);
    return { success: false, error: "Failed to delete visa application" };
  }
}
