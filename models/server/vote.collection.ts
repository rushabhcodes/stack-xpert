import { Permission } from "node-appwrite";
import { db, votesCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
  try {
    await databases.createCollection(db, votesCollection, votesCollection, [
      Permission.read("users"),
      Permission.write("users"),
      Permission.delete("users"),
      Permission.update("users"),
      Permission.read("any"),
    ]);
    console.log(`Collection ${votesCollection} created`);

    // Create attributes
    try {
      await Promise.all([
        databases.createEnumAttribute(
          db,
          votesCollection,
          "type",
          ["question", "answer"],
          true
        ),
        databases.createStringAttribute(
          db,
          votesCollection,
          "authorId",
          50,
          true
        ),
        databases.createEnumAttribute(
          db,
          votesCollection,
          "voteStatus",
          ["up", "down"],
          true
        ),
      ]);
      console.log(`Attributes created for ${votesCollection}`);
    } catch (attributeError) {
      console.error(`Error creating attributes: ${attributeError}`);
    }
  } catch (collectionError) {
    console.error(`Error creating collection: ${collectionError}`);
  }
}
