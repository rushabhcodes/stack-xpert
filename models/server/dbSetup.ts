import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database found");
  } catch (error) {
    console.error("Database not found", error);
    try {
      await databases.create(db, db);
      console.log("Database created");
      // delay to allow database to be created
      await new Promise((resolve) => setTimeout(resolve, 10000));
      try {
        await Promise.all([
          createAnswerCollection(),
          createCommentCollection(),
          createQuestionCollection(),
          createVoteCollection(),
        ]);
        console.log("Collections created");
      } catch (error) {
        console.error("Error creating collections", error);
      }
    } catch (error) {
      console.error("Error creating database", error);
    }
  }
  return databases;
}
