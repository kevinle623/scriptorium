import {DatabaseIntegrityException} from "@server/types/exceptions";
import {Tag as TagModel} from "@prisma/client"
import {Tag} from "@server/types/dtos/tags"

export async function deleteBlogPostTags(
    prismaClient: any,
    blogPostId: number
): Promise<void> {
    try {
        await prismaClient.blogPostTag.deleteMany({
            where: {
                blogPostId: blogPostId,
            },
        });
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException("Database error: Failed to delete blog post tags");
    }
}
export async function updateBlogPostTags(
    prismaClient: any,
    blogPostId: number,
    newTagNames: string[]
): Promise<void> {
    try {
        await prismaClient.blogPostTag.deleteMany({
            where: {
                blogPostId: blogPostId,
            },
        });
        await createBlogPostTags(prismaClient, blogPostId, newTagNames)
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException("Database error: Failed to update blog post tags");
    }
}

export async function createBlogPostTags(
    prismaClient: any,
    blogPostId: number,
    newTagNames: string[]
): Promise<void> {
    try {
        for (const tagName of newTagNames) {
            let tag = await prismaClient.tag.findUnique({
                where: {
                    name: tagName,
                },
            });

            if (!tag) {
                tag = await prismaClient.tag.create({
                    data: {
                        name: tagName,
                    },
                });
            }

            await prismaClient.blogPostTag.create({
                data: {
                    blogPostId: blogPostId,
                    tagId: tag.id,
                },
            });
        }

    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException("Database error: Failed to update blog post tags");
    }
}

export async function deleteCodeTemplateTags(
    prismaClient: any,
    codeTemplateId: number,
): Promise<void> {
    try {
        await prismaClient.codeTemplateTag.deleteMany({
            where: {
                codeTemplateId: codeTemplateId,
            },
        });
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException("Database error: Failed to delete code template tags");
    }
}

export async function updateCodeTemplateTags(
    prismaClient: any,
    codeTemplateId: number,
    newTagNames: string[]
): Promise<void> {
    try {
        await deleteCodeTemplateTags(prismaClient, codeTemplateId)
        await createCodeTemplateTags(prismaClient, codeTemplateId, newTagNames)
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException("Database error: Failed to update code template tags");
    }
}

export async function createCodeTemplateTags(
    prismaClient: any,
    codeTemplateId: number,
    newTagNames: string[]
): Promise<void> {
    try {
        for (const tagName of newTagNames) {
            let tag = await prismaClient.tag.findUnique({
                where: {
                    name: tagName,
                },
            });

            if (!tag) {
                tag = await prismaClient.tag.create({
                    data: {
                        name: tagName,
                    },
                });
            }

            await prismaClient.codeTemplateTag.create({
                data: {
                    codeTemplateId: codeTemplateId,
                    tagId: tag.id,
                },
            });
        }

    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException("Database error: Failed to update code template tags");
    }
}

export async function fetchTagsById(prismaClient: any, tagIds: number[]): Promise<Tag[]> {
    try {
        const tagModels = await prismaClient.tag.findMany({
            where: {
                id: {
                    in: tagIds,
                },
            },
        });

        return tagModels.map(deserializeTag);
    } catch (e) {
        console.error("Database Error", e);
        throw new DatabaseIntegrityException("Database error: Failed to fetching tags");
    }
}

function deserializeTag(tagModel: TagModel): Tag {
    return {
        id: tagModel.id,
        name: tagModel.name,
    };
}




