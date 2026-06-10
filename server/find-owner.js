const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getOwner() {
  let owner = await prisma.ownerProfile.findFirst();
  if (!owner) {
    let user = await prisma.user.findFirst();
    if (!user) {
      console.log("No users found");
      return;
    }
    owner = await prisma.ownerProfile.create({
      data: {
        userId: user.id,
        businessName: "Chennai Parking Co",
        status: "APPROVED"
      }
    });
  }
  console.log("Owner ID:", owner.id);
}

getOwner().finally(() => prisma.$disconnect());
