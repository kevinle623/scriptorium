const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("./utils/passwordUtils");

const prisma = new PrismaClient();

async function populateData() {
    try {
        console.log("Generating data...");

        // Generate Tags
        const tags = await Promise.all(
            ["JavaScript", "Python", "React", "Node.js", "CSS", "HTML"].map((tag) =>
                prisma.tag.upsert({
                    where: { name: tag },
                    update: {},
                    create: { name: tag },
                })
            )
        );
        console.log(`Generated ${tags.length} tags.`);

        // Generate Users
        const users = [];
        for (let i = 1; i <= 50; i++) {
            const user = await prisma.user.create({
                data: {
                    email: `user${i}@example.com`,
                    password: await hashPassword("password123"),
                    firstName: `FirstName${i}`,
                    lastName: `LastName${i}`,
                    phone: `123-456-78${i}0`,
                    avatar: null,
                },
            });
            users.push(user);
        }
        console.log(`Generated ${users.length} users.`);

        // Generate Blog Posts
        const blogPosts = [];
        for (let i = 1; i <= 60; i++) {
            const user = users[i % users.length];
            const blogPost = await prisma.blogPost.create({
                data: {
                    title: `Blog Post ${i}`,
                    description: `This is the description of blog post ${i}.`,
                    content: `This is the content of blog post ${i}.`,
                    user: { connect: { id: user.id } },
                    tags: {
                        create: tags.slice(0, (i % tags.length) + 1).map((tag) => ({
                            tag: { connect: { id: tag.id } },
                        })),
                    },
                },
            });
            blogPosts.push(blogPost);
        }
        console.log(`Generated ${blogPosts.length} blog posts.`);

        // Generate Code Templates
        const codeTemplates = [];
        for (let i = 1; i <= 55; i++) {
            const user = users[i % users.length];
            const codeTemplate = await prisma.codeTemplate.create({
                data: {
                    title: `Code Template ${i}`,
                    code: `console.log("Hello, world! Template ${i}");`,
                    language: "JavaScript",
                    explanation: `This is the explanation for template ${i}.`,
                    user: { connect: { id: user.id } },
                    tags: {
                        create: tags.slice(0, (i % tags.length) + 1).map((tag) => ({
                            tag: { connect: { id: tag.id } },
                        })),
                    },
                },
            });
            codeTemplates.push(codeTemplate);
        }
        console.log(`Generated ${codeTemplates.length} code templates.`);

        // Associate Code Templates with Blog Posts
        for (const blogPost of blogPosts) {
            await prisma.blogPostCodeTemplate.createMany({
                data: codeTemplates.slice(0, 3).map((template) => ({
                    blogPostId: blogPost.id,
                    codeTemplateId: template.id,
                })),
            });
        }
        console.log("Associated code templates with blog posts.");

        // Generate Comments
        const comments = [];
        for (const blogPost of blogPosts) {
            const numComments = Math.floor(Math.random() * 5) + 1; // 1-5 comments per blog post
            for (let i = 0; i < numComments; i++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const comment = await prisma.comment.create({
                    data: {
                        content: `This is a comment on blog post ${blogPost.id}.`,
                        user: { connect: { id: user.id } },
                        blogPost: { connect: { id: blogPost.id } },
                    },
                });
                comments.push(comment);
            }
        }
        console.log("Generated comments for blog posts.");

        // Generate Reports
        for (const blogPost of blogPosts) {
            if (Math.random() > 0.7) {
                // 30% of blog posts get a report
                const user = users[Math.floor(Math.random() * users.length)];
                await prisma.report.create({
                    data: {
                        reason: `This is a report for blog post ${blogPost.id}.`,
                        user: { connect: { id: user.id } },
                        blogPost: { connect: { id: blogPost.id } },
                    },
                });
            }
        }

        for (const comment of comments) {
            if (Math.random() > 0.5) {
                // 50% of comments get a report
                const user = users[Math.floor(Math.random() * users.length)];
                await prisma.report.create({
                    data: {
                        reason: `This is a report for comment ${comment.id}.`,
                        user: { connect: { id: user.id } },
                        comment: { connect: { id: comment.id } },
                    },
                });
            }
        }
        console.log("Generated reports for blog posts and comments.");

        // Generate Votes
        // Generate Votes for Blog Posts
        for (const blogPost of blogPosts) {
            const numVotes = Math.floor(Math.random() * 20) + 1; // 1-10 votes per blog post
            for (let i = 0; i < numVotes; i++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const voteType = Math.random() > 0.5 ? "UP" : "DOWN";

                // Check for existing vote using the unique constraint
                const existingVote = await prisma.vote.findUnique({
                    where: {
                        unique_blog_vote: {
                            userId: user.id,
                            blogPostId: blogPost.id,
                        },
                    },
                });

                if (!existingVote) {
                    await prisma.vote.create({
                        data: {
                            userId: user.id,
                            blogPostId: blogPost.id,
                            voteType,
                        },
                    });
                }
            }
        }

        // Generate Votes for Comments
        for (const comment of comments) {
            const numVotes = Math.floor(Math.random() * 20) + 1; // 1-5 votes per comment
            for (let i = 0; i < numVotes; i++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const voteType = Math.random() > 0.5 ? "UP" : "DOWN";

                // Check for existing vote using the unique constraint
                const existingVote = await prisma.vote.findUnique({
                    where: {
                        unique_comment_vote: {
                            userId: user.id,
                            commentId: comment.id,
                        },
                    },
                });

                if (!existingVote) {
                    await prisma.vote.create({
                        data: {
                            userId: user.id,
                            commentId: comment.id,
                            voteType,
                        },
                    });
                }
            }
        }

        console.log("Generated votes for blog posts and comments.");

        console.log("Data population complete.");
    } catch (error) {
        console.error("Error populating data:", error);
    } finally {
        await prisma.$disconnect();
    }
}

populateData().catch((error) => {
    console.error("Failed to populate data:", error);
    process.exit(1);
});
