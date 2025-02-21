import { faker } from "@faker-js/faker";
import { prisma } from "./src/lib/prisma";
import { createUserWithSkillsAndLocation } from "./actions/user_apis";

const generateRandomLocation = () => ({
  city: faker.location.city(),
  state: faker.location.state(),
  country: faker.location.country(),
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
});

const generateRandomSkills = () => {
  const skillPool = [
    "React",
    "Nodejs",
    "TypeScript",
    "Python",
    "Django",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Elasticsearch",
    "Kafka",
    "RabbitMQ",
    "Nginx",
    "Apache",
    "Jenkins",
    "Git",
    "CI/CD",
    "Terraform",
    "Ansible",
    "Kubernetes",
    "Microservices",
    "Serverless",
    "REST",
    "gRPC",
    "OAuth",
    "JWT",
  ];
  return faker.helpers.arrayElements(
    skillPool,
    faker.number.int({ min: 2, max: 5 })
  );
};

const seedUsers = async (count: number) => {
  console.log(`🌱 Seeding ${count} users...`);

  for (let i = 0; i < count; i++) {
    const userId = faker.string.uuid();
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const headline = faker.lorem.sentence();
    const cover_image = faker.image.urlPicsumPhotos();
    const githubId = faker.internet.userName();
    const avatar = faker.image.avatar();
    const bio = faker.person.bio();
    const skills = generateRandomSkills();
    const interests = faker.helpers.arrayElements(
      ["AI", "Blockchain", "Web Dev", "IoT", "Cybersecurity"],
      3
    );
    const experience = faker.number.int({ min: 1, max: 15 });
    const location = { ...generateRandomLocation(), users: [] };

    await createUserWithSkillsAndLocation(
      userId,
      name,
      email,
      githubId,
      avatar,
      bio,
      skills,
      interests,
      experience,
      location,
      headline,
      cover_image
    );
  }

  console.log("✅ Seeding complete!");
};

seedUsers(10)
  .catch((error) => {
    console.error("Seeding failed:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
