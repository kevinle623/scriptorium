
import {prisma} from "@server/libs/prisma/client";
import {CreateBlogPostRequest, EditBlogPostRequest} from "@server/types/dtos/blogPosts";
import * as blogPostRepository from "@server/repositories/blogPosts"
import {NotFoundException} from "@server/types/exceptions";

export async function createBlogPost(createBlogPostRequest: CreateBlogPostRequest){
    try {
        const newBlogPost = await blogPostRepository.createBlogPost(prisma, createBlogPostRequest)
        return newBlogPost
    } catch (e) {
        throw e
    }
}

export async function deleteBlogPost(blogPostId) {
    try {
        const existingBlogPost = await blogPostRepository.getBlogPostById(prisma, blogPostId)
        if (!existingBlogPost) {
            throw new NotFoundException("Blog Post does not exist")
        }
        await blogPostRepository.deleteBlogPost(prisma, blogPostId)
        return
    } catch (e) {
        throw e
    }
}

export async function updateBlogPost(editBlogPostRequest: EditBlogPostRequest) {
    try {
        const existingBlogPost = await blogPostRepository.getBlogPostById(prisma, editBlogPostRequest.id)
        if (!existingBlogPost) {
            throw new NotFoundException("Blog Post does not exist")
        }
        await blogPostRepository.editBlogPost(prisma, editBlogPostRequest)
        const updatedBlogPost = await blogPostRepository.getBlogPostById(prisma, editBlogPostRequest.id)
        return updatedBlogPost
    } catch (e) {
        throw e
    }
}

export async function getBlogPostById(blogPostId: number) {
    try {
        const blogPost = await blogPostRepository.getBlogPostById(prisma, blogPostId)
        if (!blogPost) {
            throw new NotFoundException("Blog Post does not exist")
        }
        return blogPost
    } catch (e) {
        throw e
    }
}