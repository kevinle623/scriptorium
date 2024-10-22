import * as tagRepository from "@server/repositories/tags";
import {prisma} from "@server/libs/prisma/client";

export async function getTagNamesByIds(tagIds: number[]) {
    try {
        const tags = await tagRepository.fetchTagsById(prisma, tagIds)
        const tagNames = tags.map((tag) => tag.name)
        return tagNames
    } catch (e) {
        throw e
    }
}