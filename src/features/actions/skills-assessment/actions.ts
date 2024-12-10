"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Customer, SkillsAssessment } from "@prisma/client";
import { SkillsAssessmentInput } from "@/types/schema";
import { checkAuth } from "@/lib/checkAuth";

export async function createSkillsAssessment(data: SkillsAssessmentInput) {
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
      ...skillsAssessmentData
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
    const application = await prisma.skillsAssessment.create({
      data: {
        ...skillsAssessmentData,
        customerId: customer.id,
      },
    });
    revalidatePath("/skills-assessment");
    return { success: true, data: application };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to create skills assessment record",
    };
  }
}

export async function updateSkillsAssessment(
  id: string,
  data: Partial<SkillsAssessmentInput & { customer: Customer }>,
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
    ...skillsAssessmentData
  } = data;
  try {
    const updatedApplication = await prisma.skillsAssessment.update({
      where: { id },
      data: {
        ...skillsAssessmentData,
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
    revalidatePath("/skills-assessment");

    return { success: true, data: updatedApplication };
  } catch (error) {
    console.error("Error updating application record:", error);
    return { success: false, error: "Failed to update application record" };
  }
}

export async function getSkillsAssessment(
  id: string,
): Promise<(SkillsAssessment & { customer: Customer }) | null> {
  await checkAuth();

  try {
    const application = await prisma.skillsAssessment.findFirst({
      where: {
        id,
      },
      include: {
        customer: true,
      },
    });
    return application;
  } catch (error) {
    console.error("Error fetching skills assessment application:", error);
    throw new Error("Failed to fetch skills assessment application");
  }
}
export async function getAllSkillsAssessment(): Promise<
  (SkillsAssessment & { customer: Customer })[] | null
> {
  await checkAuth();
  try {
    const applications = await prisma.skillsAssessment.findMany({
      include: {
        customer: true,
      },
    });
    return applications;
  } catch (error) {
    console.error("Error fetching skills assessment applications:", error);
    throw new Error("Failed to fetch skills assessment applications");
  }
}

export async function deleteSkillsAssessment(id: string) {
  await checkAuth();
  try {
    await prisma.skillsAssessment.delete({
      where: { id },
    });
    revalidatePath("/skills-assessment");
    return { success: true };
  } catch (error) {
    console.error("Error deleting skills assessment application:", error);
    return {
      success: false,
      error: "Failed to delete skills assessment application",
    };
  }
}
