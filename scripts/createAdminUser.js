const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("./utils/passwordUtils");

const prisma = new PrismaClient();

async function createAdmin() {
    const ADMIN_EMAIL = 'admin@gmail.com'
    const ADMIN_PASSWORD = '12345'


    const adminUser = {
        email: ADMIN_EMAIL,
        phone: '123-456-7890',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        password: await hashPassword(ADMIN_PASSWORD),
        avatar: undefined
    };

    try {
        const user = await prisma.user.upsert({
            where: { email: adminUser.email },
            update: {},
            create: {
                email: adminUser.email,
                phone: adminUser.phone,
                role: adminUser.role,
                firstName: adminUser.firstName,
                lastName: adminUser.lastName,
                password: adminUser.password,
                avatar: adminUser.avatar
            }
        });
        user.password = '12345'
        console.log('Admin user created successfully.', user);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin().catch((error) => {
    console.error('Failed to create admin user:', error);
    process.exit(1);
});
