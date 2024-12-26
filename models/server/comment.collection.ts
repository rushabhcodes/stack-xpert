import { IndexType, Permission } from "node-appwrite";
import { db, commentsCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  try {
    await databases.createCollection(
      db,
      commentsCollection,
      commentsCollection,
      [
        Permission.read("users"),
        Permission.write("users"),
        Permission.delete("users"),
        Permission.update("users"),
        Permission.read("any"),
      ]
    );
    console.log(`Collection ${commentsCollection} created`);

    // Create attributes
    try {
      await Promise.all([
        databases.createEnumAttribute(
          db,
          commentsCollection,
          "type",
          ["question", "answer"],
          true
        ),
        databases.createStringAttribute(
          db,
          commentsCollection,
          "content",
          10000,
          true
        ),
        databases.createStringAttribute(
          db,
          commentsCollection,
          "authorId",
          50,
          true
        ),
      ]);
      console.log(`Attributes created for ${commentsCollection}`);
    } catch (attributeError) {
      console.error(`Error creating attributes: ${attributeError}`);
    }

    // Create indexes
    try {
      await Promise.all([
        databases.createIndex(
          db,
          commentsCollection,
          "content",
          IndexType.Fulltext,
          ["content"],
          ["asc"]
        ),
      ]);
      console.log(`Indexes created for ${commentsCollection}`);
    } catch (indexError) {
      console.error(`Error creating indexes: ${indexError}`);
    }
  } catch (collectionError) {
    console.error(`Error creating collection: ${collectionError}`);
  }
}
