import dotenv from "dotenv";
dotenv.config({ override: true });
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const studentHash = await bcrypt.hash("student123", 10);
  await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      name: 'Student User',
      passwordHash: studentHash,
      role: 'STUDENT',
    },
  });

  const category = await prisma.category.upsert({
    where: { id: 'default-cat' },
    update: {},
    create: {
      id: 'default-cat',
      name: 'General',
    },
  });

  await prisma.note.createMany({
    data: [
      { title: 'Class 10 Math Basics', content: 'Basic math notes for class 10', categoryNameFixed: 'Class 10', creatorName: 'Admin User' },
      { title: 'Class 12 Physics', content: 'Physics notes for class 12', categoryNameFixed: 'Class 12', creatorName: 'Admin User' },
      { title: 'Class 10 Science', content: 'Science notes for class 10', categoryNameFixed: 'Class 10', creatorName: 'Admin User' },
    ],
  });

  await prisma.test.create({
    data: {
      title: 'Class 10 Algebra Quiz',
      categoryNameFixed: 'Class 10',
      creatorName: 'Admin User',
      categoryId: category.id,
      questions: {
        create: [
          {
            content: 'What is x in 2x = 4?',
            optionA: '1',
            optionB: '2',
            optionC: '3',
            optionD: '4',
            correctOption: 'B',
          }
        ]
      }
    }
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
