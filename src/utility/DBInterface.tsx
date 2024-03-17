import { EntryStruct, ResumeClass } from "./EntryData";

/**
 * Interface for the database class. Implementation should be defined on concrete child class.
 *
 * The concrete class will connect with an actual live database instance.
 *
 * No caching will be performed on the class - this class is an abstraction for interacting
 *  with the database, nothing further.
 */
interface Database {
  /**
   * Given an EntryStruct, creates it in the database. (Inserts new, returns error code if already exists)
   * @param entry
   * @returns Return code: 0 -> Inserted as expected
   *                       1 -> Same ID already exists
   *                       2 -> Some other error
   */
  entryCreate(entry: EntryStruct): number;

  /**
   * Given an entry id, returns the uniquely identified object from the database.
   * @param entryId Unique entry id in string format
   * @returns EntryStruct object if found, undefined if not.
   */
  entryRead(entryId: string): EntryStruct | undefined;

  /**
   * Given an EntryStruct, patches it to an existing entry in the database. Returns error code if doesn't already exist.
   * @param entry
   * @returns Return code: 0 -> Patched as expected
   *                       1 -> EntryStruct with given ID does not exist in the database
   *                       2 -> Some other error
   */
  entryUpdate(entry: EntryStruct): number;

  /**
   * Given an entry id, deletes it from the database and returns it if it exists.
   * @param entryId Unique entry id in string format
   * @returns EntryStruct object if found, undefined if not.
   */
  entryDelete(entryId: string): EntryStruct | undefined;

  /**
   * Given a ResumeClass, creates it in the database. (Inserts new, returns error code if already exists)
   * @param resume
   * @returns Return code: 0 -> Inserted as expected
   *                       1 -> Same ID already exists
   *                       2 -> Some other error
   */
  resumeCreate(resume: ResumeClass): number;

  /**
   * Given a resume id, returns the uniquely identified object from the database.
   * @param resumeId Unique resume id in string format
   * @returns Resume object if found, undefined if not.
   */
  resumeRead(resumeId: string): ResumeClass | undefined;

  /**
   * Given an ResumeClass, patches it to an existing resume in the database. Returns error code if doesn't already exist.
   * @param resume
   * @returns Return code: 0 -> Patched as expected
   *                       1 -> Resume with given ID does not exist in the database
   *                       2 -> Some other error
   */
  resumeUpdate(resume: ResumeClass): number;

  /**
   * Given a resume id, deletes it from the database and returns it if it exists.
   * @param resumeId Unique resume id in string format
   * @returns ResumeClass object if found, undefined if not.
   */
  resumeDelete(resumeId: string): ResumeClass | undefined;
}
