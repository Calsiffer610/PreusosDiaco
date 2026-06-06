import { NextResponse } from "next/server";
import { APP_MESSAGES } from "@/constants/messages";
import { prisma } from "@/lib/prisma";

type SubmissionPayload = {
  formId?: string;
  formTitle?: string;
  operator?: string;
  turn?: string;
  date?: string;
  completion?: number;
  issueCount?: number;
  responses?: Record<string, string>;
  notes?: Record<string, string>;
};

function toSavedInspection(submission: {
  id: string;
  formTitle: string;
  operatorName: string;
  turn: string;
  date: Date;
  completion: number;
  issueCount: number;
  createdAt: Date;
  data: unknown;
}) {
  const data = submission.data && typeof submission.data === "object" ? submission.data : {};
  const payload = data as {
    formId?: string;
    responses?: Record<number, string>;
    notes?: Record<number, string>;
  };

  return {
    id: submission.id,
    formId: payload.formId ?? "",
    formTitle: submission.formTitle,
    operator: submission.operatorName,
    turn: submission.turn,
    date: submission.date.toISOString().slice(0, 10),
    savedAt: submission.createdAt.toISOString(),
    completion: submission.completion,
    issueCount: submission.issueCount,
    responses: payload.responses ?? {},
    notes: payload.notes ?? {},
  };
}

export async function GET() {
  try {
    const submissions = await prisma.formSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        formTitle: true,
        operatorName: true,
        turn: true,
        date: true,
        completion: true,
        issueCount: true,
        createdAt: true,
        data: true,
      },
    });

    return NextResponse.json({
      submissions: submissions.map(toSavedInspection),
    });
  } catch {
    return NextResponse.json(
      { error: APP_MESSAGES.forms.loadError },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmissionPayload;
    const formId = body.formId?.trim();
    const formTitle = body.formTitle?.trim();
    const operator = body.operator?.trim();
    const turn = body.turn?.trim();
    const date = body.date?.trim();

    if (!formId || !formTitle || !operator || !turn || !date) {
      return NextResponse.json(
        { error: APP_MESSAGES.forms.requiredFields },
        { status: 400 },
      );
    }

    const submission = await prisma.formSubmission.create({
      data: {
        formTitle,
        operatorName: operator,
        turn,
        date: new Date(`${date}T00:00:00.000Z`),
        completion: body.completion ?? 0,
        issueCount: body.issueCount ?? 0,
        data: {
          formId,
          responses: body.responses ?? {},
          notes: body.notes ?? {},
        },
        template: {
          connectOrCreate: {
            where: {
              slug: formId,
            },
            create: {
              slug: formId,
              title: formTitle,
            },
          },
        },
      },
      select: {
        id: true,
        formTitle: true,
        operatorName: true,
        turn: true,
        date: true,
        completion: true,
        issueCount: true,
        createdAt: true,
        data: true,
      },
    });

    return NextResponse.json(
      { submission: toSavedInspection(submission) },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: APP_MESSAGES.forms.createError },
      { status: 500 },
    );
  }
}
