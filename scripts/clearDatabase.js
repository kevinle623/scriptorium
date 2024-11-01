const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function clearDatabase() {
    try {
        console.log("Clearing database...");

        await prisma.vote.deleteMany({});
        await prisma.report.deleteMany({});
        await prisma.comment.deleteMany({});
        await prisma.blogPostTag.deleteMany({});
        await prisma.codeTemplateTag.deleteMany({});
        await prisma.blogPostCodeTemplate.deleteMany({});
        await prisma.codeTemplate.deleteMany({});
        await prisma.blogPost.deleteMany({});
        await prisma.tag.deleteMany({});
        await prisma.user.deleteMany({});
        await prisma.revokedToken.deleteMany({});

        console.log("Database cleared successfully.");
    } catch (error) {
        console.error("Error clearing database:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase().catch((error) => {
    console.error("Failed to clear database:", error);
    process.exit(1);
});
