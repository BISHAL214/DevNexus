"use server";

import {
  redis_host,
  redis_password,
  redis_port,
  redis_userName,
} from "@/constants/redis_creds";
import { Location, User } from "@/interfaces/app_database_models";
import { __cosineSimilarity } from "@/lib/__cosine_similarity";
import {
  __getCurrentTechTrends,
  __getUserEmbedding,
} from "@/lib/gen_ai_functions";
import { prisma } from "@/lib/prisma";
import { JsonValue } from "@prisma/client/runtime/library";
import { createClient } from "redis";

const redisClient = createClient({
  username: redis_userName,
  password: redis_password,
  socket: {
    host: redis_host,
    port: redis_port,
  },
});

redisClient.connect().catch((err) => console.log(err));

// Helper function to get data from Redis
const getFromCache = async (key: string) => {
  try {
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error("Error reading from Redis cache:", error);
    return null;
  }
};

// Helper function to set data in Redis
const setInCache = async (key: string, data: any, ttl: number) => {
  try {
    await redisClient.set(key, JSON.stringify(data), {
      EX: ttl, // Set expiration time in seconds
    });
  } catch (error) {
    console.error("Error writing to Redis cache:", error);
  }
};

export const getUserById = async (firebase_uid: string) => {
  const cacheKey = `userById:${firebase_uid}`; // Unique cache key based on the user
  const cacheTTL = 24 * 24 * 60 * 60; // Cache duration in seconds (48 hours)

  if (!firebase_uid) {
    console.log("User ID not provided");
    return {
      success: false,
      error: true,
      message: "User ID not provided",
      user_data: null,
    };
  }

  try {
    // Check if data exists in the cache
    const cached_user = await getFromCache(cacheKey);
    if (cached_user) {
      console.log("Returning cached user");
      return cached_user;
    }

    // If not in cache, fetch user data from the database
    const user = await prisma.user.findUnique({
      where: { firebase_uid: firebase_uid },
    });

    if (!user) {
      console.log("User not found");
      return {
        success: false,
        error: true,
        message: "User not found",
        user_data: null,
      };
    }

    // Store the data in Redis cache
    await setInCache(cacheKey, user, cacheTTL);
    console.log("Returning fresh user");
    return {
      success: true,
      error: false,
      message: "User Found",
      user_data: user,
    };
  } catch (error) {
    console.log("Error fetching user data:", error);
    return {
      success: false,
      error: true,
      message: "Something went wrong",
      user_data: null,
    };
  }
};

export const createUserWithSkillsAndLocation = async (
  userId: string,
  name: string,
  email: string,
  githubId: string,
  avatar: string | null,
  bio: string,
  skills: string[],
  interests: string[],
  experience: number | null,
  location: Location
) => {
  try {
    // console.log("Starting user creation...");
    // console.log("User ID:", userId);
    // console.log("Name:", name);
    // console.log("Email:", email);
    // console.log("GitHub ID:", githubId);
    // console.log("Avatar:", avatar);
    // console.log("Bio:", bio);
    // console.log("Skills:", skills);
    // console.log("Interests:", interests);
    // console.log("Experience:", experience);
    // console.log("Location:", location);

    // step 1: Generate user embedding and store along the the new user
    const lowercased_skills = skills.map((skill) =>
      skill.replace(/\s+/g, "").toLowerCase()
    );
    const lowercased_interests = interests.map((interest) =>
      interest.replace(/\s+/g, "").toLowerCase()
    );
    const final_embedding_data = [
      ...lowercased_skills,
      ...lowercased_interests,
      bio,
      `Experience: ${experience} years in the tech field`,
    ];

    const user_embedding = await __getUserEmbedding(final_embedding_data);

    // Step 2: Create the user with basic information
    const newUser = await prisma.user.create({
      data: {
        firebase_uid: userId,
        name,
        email,
        githubId,
        avatar,
        bio,
        interests: lowercased_interests,
        experience: Number(experience),
        embedding: user_embedding,
      },
    });

    // console.log("User created:", newUser);
    const skillIds: string[] = [];
    // Step 3: Handle skills
    for (const skillName of lowercased_skills) {
      const existingSkill = await prisma.skill.findUnique({
        where: { name: skillName },
      });

      if (existingSkill) {
        // Update existing skill with the new user
        await prisma.skill.update({
          where: { id: existingSkill.id },
          data: {
            users: { connect: { id: newUser.id } },
          },
        });
        skillIds.push(existingSkill.id);
        // console.log(`Updated existing skill: ${skillName}`);
      } else {
        // Create new skill and associate with the user
        const newSkill = await prisma.skill.create({
          data: {
            name: skillName,
            users: { connect: { id: newUser.id } },
          },
        });
        // console.log(`Created new skill: ${newSkill.name}`);
        skillIds.push(newSkill.id);
      }
    }

    // Step 4: Handle location
    const existingLocation = await prisma.location.findFirst({
      where: { city: location.city },
    });

    let locationId;

    if (existingLocation) {
      // Update existing location with the new user
      await prisma.location.update({
        where: { id: existingLocation.id },
        data: {
          users: { connect: { id: newUser.id } },
        },
      });
      locationId = existingLocation.id;
      // console.log(`Updated existing location: ${location.city}`);
    } else {
      // Create new location and associate with the user
      const newLocation = await prisma.location.create({
        data: {
          city: location.city,
          state: location.state,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude,
          users: { connect: { id: newUser.id } },
        },
      });
      locationId = newLocation.id;
      // console.log(`Created new location: ${newLocation.city}`);
    }

    let updated_user = {};

    // Step 5: Update the user with location ID
    if (locationId && skillIds.length > 0) {
      updated_user = await prisma.user.update({
        where: { id: newUser.id },
        data: {
          location: { connect: { id: locationId } },
          skills: { connect: skillIds.map((id) => ({ id })) },
        },
      });
    }

    // console.log("User updated with skills and location.");

    return {
      success: true,
      error: false,
      message: "User created and updated successfully",
      created_user: updated_user,
    };
  } catch (error: any) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }
    return {
      success: false,
      error: true,
      message: error.message,
      created_user: null,
    };
  }
};

export const getRecommendedDevelopers = async (userId: string) => {
  try {
    const [user, allDevelopers] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { embedding: true },
      }),
      prisma.user.findMany({
        select: { id: true, name: true, skills: true, embedding: true },
      }),
    ]);

    if (!user || !allDevelopers) return [];

    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { embedding: true },
    // });

    // if (!user) return [];

    // const allDevelopers = await prisma.user.findMany({
    //   select: { id: true, name: true, skills: true, embedding: true },
    // });

    console.log(
      "All developers from --getRecommendedDevelopers--:",
      allDevelopers.map((dev) => dev.name)
    );

    if (allDevelopers.length <= 1) return [];

    const otherDevelopers = allDevelopers.filter((dev) => dev.id !== userId); // Exclude current user

    console.log("Embeddings type:", typeof otherDevelopers[0]?.embedding);

    // Map with async calls and await using Promise.all
    const recommendations = await Promise.all(
      otherDevelopers.map(async (dev) => ({
        ...dev,
        score:
          user.embedding && dev.embedding
            ? await __cosineSimilarity(
                user.embedding as number[],
                dev.embedding as number[]
              )
            : 0,
      }))
    );

    // Sort by highest similarity score
    const sortedRecommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .map((dev) => ({
        id: dev.id,
        name: dev.name,
        score: dev.score,
      }));

    console.log("Sorted Recommendations:", sortedRecommendations);

    return sortedRecommendations.slice(0, 10); // Return top 10 matches
  } catch (error) {
    console.log("Error fetching recommended developers:", error);
    return [];
  }
};

export const generateTechTrends = async (prompt: string | string[]) => {
  const cacheKey = `techTrends:${JSON.stringify(prompt)}`; // Unique cache key based on the prompt
  const cacheTTL = 24 * 60 * 60; // Cache duration in seconds (24 hours)

  try {
    // Check if data exists in the cache
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
      console.log("Returning cached data");
      return cachedData;
    }

    // If not in cache, fetch data from the API
    const response_string = await __getCurrentTechTrends(prompt);
    if (!response_string) return [];

    // Clean and parse the response
    const cleanedData = response_string.replace(/```json|```/g, "").trim();
    const response = JSON.parse(cleanedData);

    // Store the data in Redis cache
    await setInCache(cacheKey, response, cacheTTL);
    console.log("Returning fresh data");
    return response;
  } catch (error) {
    console.log("Error generating tech trends:", error);
    return [];
  }
};

export const getDevelopersBySkills = async (skills: string[]) => {
  try {
    if (skills.length === 0) {
      return {
        developers: null,
        success: false,
        message: "Skill not provided",
      };
    }
    const developers = await prisma.user.findMany({
      where: {
        skills: {
          some: {
            name: {
              in: skills.map((skill) => skill.toLowerCase()),
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        headline: true,
        cover_image: true,
        avatar: true,
        skills: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!developers) {
      return {
        developers: null,
        success: false,
        message: "No developers found",
      };
    }

    // console.log(
    //   "these are the skills - ",
    //   skills,
    //   JSON.stringify(developers)
    // );
    return {
      developers: developers,
      success: true,
      message: "Developers found",
    };
  } catch (error: any) {
    if (error instanceof Error) console.log("Error: ", error.stack);
    console.log("Error fetching developers by skills:", error);
    return {
      developers: null,
      success: false,
      message: error.message,
    };
  }
};

export const getTopskills = async () => {
  const cacheKey = `topskills`; // Unique cache key
  const cacheTTL = 5 * 60 * 60; // Cache duration in seconds (5 hours)

  try {
    // Check if data exists in the cache
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
      console.log("Returning cached top skills");
      return {
        topSkills: cachedData,
        success: true,
        message: "Top skills found",
      }
    }

    // If not in cache, fetch data from the database
    const topSkills = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        users: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        users: {
          _count: "desc",
        },
      },
    });

    // Filter skills with at least 5 users
    const filteredSkills = topSkills.filter(
      (skill) => skill.users.length >= 3
    ).slice(0, 10);

    if (filteredSkills.length === 0) {
      return {
        topSkills: null,
        success: false,
        message: "No top skills found with at least 5 users",
      };
    }

    // Store the data in Redis cache
    await setInCache(cacheKey, filteredSkills, cacheTTL);
    console.log("Returning fresh top skills");
    return {
      topSkills: filteredSkills,
      success: true,
      message: "Top skills found",
    };
  } catch (error) {
    console.log("Error fetching top skills:", error);
    return {
      topSkills: null,
      success: false,
      message: "Something went wrong",
    };
  }
};

