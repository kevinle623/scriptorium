import { DatabaseIntegrityException } from "@/types/exceptions";
import {Report as ReportModel} from "@prisma/client";
import { Report } from "@/types/dtos/reports";

export async function getBlogPostReportByUser(
    prismaClient: any,
    userId: number,
    blogPostId: number
): Promise<Report | null> {
    try {
        const report = await prismaClient.report.findFirst({
            where: {
                userId: userId,
                blogPostId: blogPostId,
            },
        }) as ReportModel | null;

        return report ? deserializeReport(report) : null;
    } catch (error) {
        console.error("Database error: ", error);
        throw new DatabaseIntegrityException("Database error: failed to fetch blog post report by user");
    }
}

export async function getCommentReportByUser(
    prismaClient: any,
    userId: number,
    commentId: number
): Promise<Report | null> {
    try {
        const report = await prismaClient.report.findFirst({
            where: {
                userId: userId,
                commentId: commentId,
            },
        }) as ReportModel | null;

        return report ? deserializeReport(report) : null;
    } catch (error) {
        console.error("Database error: ", error);
        throw new DatabaseIntegrityException("Database error: failed to fetch comment report by user");
    }
}

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
        }) as ReportModel;
        return deserializeReport(newReport);
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to create report");
    }
}

export async function deleteReportByCommentId(
    prismaClient: any,
    commentId: number,
    userId: number
): Promise<boolean> {
    try {
        const deletedReport = await prismaClient.report.deleteMany({
            where: {
                commentId: commentId,
                userId: userId,
            },
        });

        return deletedReport.count > 0;
    } catch (error) {
        console.error("Database error: ", error);
        throw new DatabaseIntegrityException("Database error: failed to delete report by comment ID");
    }
}


export async function deleteReportByBlogPostId(
    prismaClient: any,
    blogPostId: number,
): Promise<boolean> {
    try {
        const deletedReport = await prismaClient.report.deleteMany({
            where: {
                blogPostId: blogPostId,
            },
        });

        return deletedReport.count > 0;
    } catch (error) {
        console.error("Database error: ", error);
        throw new DatabaseIntegrityException("Database error: failed to delete report by blog post ID");
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
