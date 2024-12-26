import { IndexType, Permission } from "node-appwrite";

import { db, questionsCollection } from "../name";

import { databases } from "./config";

export default async function createQuestionCollection() {
  try {
    await databases.createCollection(
      db,
      questionsCollection,
      questionsCollection,
      [
        Permission.read("users"),
        Permission.write("users"),
        Permission.delete("users"),
        Permission.update("users"),
        Permission.read("any"),
      ]
    );
    console.log(`Collection ${questionsCollection} created`);

    // Create attributes
    await Promise.all([
      databases.createStringAttribute(
        db,
        questionsCollection,
        "title",
        100,
        true
      ),
      databases.createStringAttribute(
        db,
        questionsCollection,
        "content",
        10000,
        true
      ),
      databases.createStringAttribute(
        db,
        questionsCollection,
        "authorId",
        50,
        true
      ),
      databases.createStringAttribute(
        db,
        questionsCollection,
        "tags",
        50,
        true,
        undefined,
        true
      ),
      databases.createStringAttribute(
        db,
        questionsCollection,
        "attachmentId",
        50,
        false
      ),
    ]);
    console.log(`Attributes created for ${questionsCollection}`);

    // Create indexes
    await Promise.all([
      databases.createIndex(
        db,
        questionsCollection,
        "title",
        IndexType.Fulltext,
        ["title"],
        ["asc"]
      ),
      databases.createIndex(
        db,
        questionsCollection,
        "content",
        IndexType.Fulltext,
        ["content"],
        ["asc"]
      ),
    ]);
  } catch (error) {
    console.error(`Error creating collection or attributes: ${error}`);
  }
}
