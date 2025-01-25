const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateViewCount() {
  try {
    const updatedCount = await prisma.tweak.updateMany({
      data: {
        viewCount: {
          set: prisma.tweak.viewCount ?? BigInt(0)
        }
      },
    })

    console.log(`Updated ${updatedCount.count} records`)
  } catch (error) {
    console.error('Error migrating viewCount:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateViewCount()
