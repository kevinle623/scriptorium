import { DatabaseIntegrityException } from "@server/types/exceptions";
import { Report as ReportModel} from "@prisma/client";
import { Report } from "@server/types/dtos/reports";

export async function createReport(
    prismaClient: any,
    reason: string,
    userId: number,
    blogPostId?: number,
    commentId?: number
): Promise<Report> {
    try {
        const newReport = await prismaClient.report.create({
            data: {
                reason,
                userId,
                blogPostId: blogPostId || null,
                commentId: commentId || null,
            },
        });
        return deserializeReport(newReport);
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to create report");
    }
}


function deserializeReport(reportModel: ReportModel): Report {
    return {
        id: reportModel.id,
        userId: reportModel.userId,
        reason: reportModel.reason,
        blogPostId: reportModel.blogPostId || null,
        commentId: reportModel.commentId || null,
        createdAt: reportModel.createdAt,
    };
}
