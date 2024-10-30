import { DatabaseIntegrityException } from "@server/types/exceptions";
import {PrismaClient, Report as ReportModel} from "@prisma/client";
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
        }) as ReportModel;
        return deserializeReport(newReport);
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to create report");
    }
}

export async function getBlogPostIdsByReportCount(
    prismaClient: any,
    page: number = 1,
    pageSize: number = 10
): Promise<{ totalCount: number; blogPostIds: number[] }> {
    const skip = (page - 1) * pageSize;

    const totalCount = await prismaClient.report.groupBy({
        by: ['blogPostId'],
        _count: true,
    }).then((groups: any)=> groups.length);

    const reports = await prismaClient.report.groupBy({
        by: ['blogPostId'],
        _count: {
            blogPostId: true
        },
        orderBy: {
            _count: {
                blogPostId: 'desc'
            }
        },
        skip,
        take: pageSize,
    }) as unknown as { blogPostId: number }[];

    const blogPostIds = reports.map((report) => report.blogPostId);

    return { totalCount, blogPostIds };
}

export async function getCommentIdsByReportCount(
    prismaClient: any,
    page: number = 1,
    pageSize: number = 10
): Promise<{ totalCount: number; commentIds: number[] }> {
    const skip = (page - 1) * pageSize;

    const totalCount = await prismaClient.report.groupBy({
        by: ['commentId'],
        _count: true,
        where: { commentId: { not: null } }
    }).then((groups: any) => groups.length);

    const reports = await prismaClient.report.groupBy({
        by: ['commentId'],
        _count: {
            commentId: true
        },
        where: { commentId: { not: null } },
        orderBy: {
            _count: {
                commentId: 'desc'
            }
        },
        skip,
        take: pageSize,
    }) as unknown as { commentId: number }[];

    const commentIds = reports.map((report) => report.commentId);

    return { totalCount, commentIds };
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
