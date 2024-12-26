import { Permission } from "node-appwrite";
import { questionsAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionsAttachmentBucket);
    console.log(`Bucket ${questionsAttachmentBucket} exists`);
  } catch (error) {
    console.error("Error getting bucket", error);
    try {
      await storage.createBucket(
        questionsAttachmentBucket,
        questionsAttachmentBucket,
        [
          Permission.read("users"),
          Permission.write("users"),
          Permission.delete("users"),
          Permission.update("users"),
          Permission.read("any"),
        ],
        false,
        undefined,
        undefined,
        ["png", "jpg", "jpeg", "gif", "webp", "heic"]
      );
      console.log(`Bucket ${questionsAttachmentBucket} created`);
    } catch (error) {
      console.error("Error creating bucket", error);
    }
  }
}
