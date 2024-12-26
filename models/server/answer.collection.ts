import { IndexType, Permission } from "node-appwrite";
import { db, answersCollection } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
  try {
    await databases.createCollection(db, answersCollection, answersCollection, [
      Permission.read("users"),
      Permission.write("users"),
      Permission.delete("users"),
      Permission.update("users"),
      Permission.read("any"),
    ]);
    console.log(`Collection ${answersCollection} created`);

    // Create attributes
    try {
      await Promise.all([
        databases.createStringAttribute(
          db,
          answersCollection,
          "content",
          10000,
          true
        ),
        databases.createStringAttribute(
          db,
          answersCollection,
          "authorId",
          50,
          true
        ),
      ]);
      console.log(`Attributes created for ${answersCollection}`);
    } catch (attributeError) {
      console.error(`Error creating attributes: ${attributeError}`);
    }

    // Create indexes
    try {
      await Promise.all([
        databases.createIndex(
          db,
          answersCollection,
          "content",
          IndexType.Fulltext,
          ["content"],
          ["asc"]
        ),
      ]);
      console.log(`Indexes created for ${answersCollection}`);
    } catch (indexError) {
      console.error(`Error creating indexes: ${indexError}`);
    }
  } catch (collectionError) {
    console.error(`Error creating collection: ${collectionError}`);
  }
}
