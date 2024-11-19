import { DatabaseIntegrityException } from "@/types/exceptions";
import {Report as ReportModel} from "@prisma/client";
import { Report } from "@/types/dtos/reports";
import {GetCommentReportsRequest, GetCommentReportsResponse} from "@types/dtos/comments";
import {GetBlogPostReportsRequest, GetBlogPostReportsResponse} from "@types/dtos/blogPosts";

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

export async function getBlogPostReports(
    prismaClient: any,
    request: GetBlogPostReportsRequest
): Promise<GetBlogPostReportsResponse> {
    try {
        const { page = 1, limit = 10, blogPostId } = request;
        const skip = (page - 1) * limit;

        const reports = await prismaClient.report.findMany({
            where: {
                blogPostId: blogPostId,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });

        const totalCount = await prismaClient.report.count({
            where: {
                blogPostId: blogPostId,
            },
        });

        return {
            totalCount,
            reports: reports.map(deserializeReport),
        };
    } catch (error) {
        console.error("Database error: ", error);
        throw new DatabaseIntegrityException("Database error: failed to fetch blog post reports");
    }
}

export async function getCommentReports(
    prismaClient: any,
    request: GetCommentReportsRequest
): Promise<GetCommentReportsResponse> {
    try {
        const { page = 1, limit = 10, commentId } = request;
        const skip = (page - 1) * limit;

        const reports = await prismaClient.report.findMany({
            where: {
                commentId: commentId,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });

        const totalCount = await prismaClient.report.count({
            where: {
                commentId: commentId,
            },
        });

        return {
            totalCount,
            reports: reports.map(deserializeReport),
        };
    } catch (error) {
        console.error("Database error: ", error);
        throw new DatabaseIntegrityException("Database error: failed to fetch comment reports");
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
