import { DBInterface } from "./DBInterface";
import { EntryStruct, ResumeClass } from "./EntryData";

export class SQLDatabase implements DBInterface {
    entryCreate(entry: EntryStruct): number {
      throw new Error("Method not implemented.");
    }
    entryRead(entryId: string): EntryStruct | undefined {
      throw new Error("Method not implemented.");
    }
    entryUpdate(entry: EntryStruct): number {
      throw new Error("Method not implemented.");
    }
    entryDelete(entryId: string): EntryStruct | undefined {
      throw new Error("Method not implemented.");
    }
    resumeCreate(resume: ResumeClass): number {
      // PASSIVELY VERIFY DATA RECEIVED IS IN CORRECT FORMAT.
      
      // PARSE THROUGH SECTIONS, INSERT INTO DATABASE.

      // PARSE THROUGH ENTRIES, INSERT INTO DATABASE.

      // PARSE THROUGH BULLETS, INSERT INTO DATABASE.

      // COMMIT, EXIT 0

      let API_BASE_URL = 'http://localhost:5000'  // TODO: CHANGE THIS
      fetch(`${API_BASE_URL}/db/create`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: 'resume',
          user_id: resume.getUserID()
        })
      }).then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Successfully inserted resume");
          } else {
            console.log("Something went wrong with inserting the resume.");
            return 1;
          }
        })
        .catch((error) => {
          console.log(`Error: Resume creation: ${error}`)
          return 2;
        });

      return 0;
    }
    resumeRead(resumeId: string): ResumeClass | undefined {
        throw new Error("Method not implemented.");
    }
    resumeUpdate(resume: ResumeClass): number {
        throw new Error("Method not implemented.");
    }
    resumeDelete(resumeId: string): ResumeClass | undefined {
        throw new Error("Method not implemented.");
    }

}