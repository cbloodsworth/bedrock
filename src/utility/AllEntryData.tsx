export interface EntryStruct {
    id: string;
    section: string;
    header: string;
    content: string[];
  }
  
  
  const Sections = {
    Education: "Education",
    Experience: "Experience",
    Projects: "Projects",
  };
  
  export const SectionHeaders = [
    Sections.Education,
    Sections.Experience,
    Sections.Projects,
  ];
  
  export type SectionMap = {
    [key: string]: Section;
  };
  
  export type Section = {
    sectionHeader: string;
    entryList: EntryStruct[];
  };
  
  export class AllDataClass {
    private sectionArray: Section[];
    private lastError: string;
    public constructor() {
      this.sectionArray = ALL_DATA;
      this.lastError = "";
    }
    
  
    /**
     * 
     * @param sectionName Name of new Section Header
     */
    public addSection(sectionName: String) {
      ALL_DATA.push({
          sectionHeader: `${sectionName}`, //`${sectionName} SEB_ID: ${highestNumber + 1}`,
          entryList: [],
      }
      )
      return;
    }
  
    /**
     * Swaps two sections given relevant info.
     * @param srcSectionIndex  From section
     * @param destSectionIndex To section
     * @returns Error code:
     *                   0: No error, swapped as expected
     *                   1: Error, either srcSectionIndex or destSectionIndex is invalid
     *                   2: Error, no support for moving non-resume sections
     */
    public moveSections(srcSectionIndex: number, destSectionIndex: number) {
      // Input validation
      if (
        // Index should be valid
        srcSectionIndex < 0 ||
        destSectionIndex < 0 ||
        srcSectionIndex >= this.sectionArray.length ||
        destSectionIndex >= this.sectionArray.length
      ) {
        this.lastError =
          "moveSections: Either srcSectionIndex or destSectionIndex is invalid";
        return 1;
      }
      const [removed] = this.sectionArray.splice(srcSectionIndex, 1);
      this.sectionArray.splice(destSectionIndex, 0, removed);
  
      return 0;
    }

    public moveEntries(
        srcSectionID: string,
        destSectionID: string,
        srcEntryIndex: number,
        destEntryIndex: number
      ) {
        const src = this.getSection(srcSectionID).elem;
        const dest = this.getSection(destSectionID).elem;
        if (!src || !dest) {
          this.lastError = "Either srcSectionID or destSectionID is invalid.";
          return 1;
        }
    
        const [removed] = src.entryList.splice(srcEntryIndex, 1); // removes entry
        dest.entryList.splice(destEntryIndex, 0, removed); // reinserts it at the new spot
    
        return 0;
      }


    public getSections() {
        return this.sectionArray;
    }

    public getSection(
        sectionID: string
      ): { i: number; elem: Section } | { i: undefined; elem: undefined } {
        const sectionTuple = {
          i: this.sectionArray.findIndex(
            (section) => section.sectionHeader === sectionID
          ),
          elem: this.sectionArray.find(
            (section) => section.sectionHeader === sectionID
          ),
        };
    
        if (typeof sectionTuple.elem === "undefined") {
          this.lastError = `getSection: Could not find section with sectionID: ${sectionID}`;
          return { i: undefined, elem: undefined };
        }
    
        return sectionTuple;
      }

    public getError() {
        return "Error: " + this.lastError;
      }

    public addDefaultEntry() {
      const section = this.getSection("Uncategorized");
      const defaultEntry = {
        id: `${this.findNextAvailableId()}`, 
        section: "Uncategorized",
        header: "Header here",
        content: ["Text Here"],
      };
      section.elem?.entryList.push(defaultEntry);
    }

    private findNextAvailableId(): string {
      let maxId = 0;
      ALL_DATA.forEach(section => {
        section.entryList.forEach(entry => {
          const idNumber = parseInt(entry.id);
          if (!isNaN(idNumber) && idNumber > maxId) {
            maxId = idNumber;
          }
        });
      });
      return (maxId + 1).toString();
    }


}
  
  export const ALL_DATA: Section[] = [
    {
      sectionHeader: Sections.Education,
      entryList: [
        {
          id: "2",
          section: Sections.Education,
          header: "University of Florida | Gainesville, FL",
          content: [
            "B.S in Computer Science and Minor in mathematics | GPA: 4.0/4.0",
          ],
        },
      ],
    },
    {
      sectionHeader: Sections.Experience,
      entryList: [
        {
          id: "7",
          section: Sections.Experience,
          header: "Software Engineer Intern | Bank of America (2023)",
          content: [
            "Helped create API call for new feature and used tools like Splunk to review code defects",
          ],
        },
        {
          id: "8",
          section: Sections.Experience,
          header:
            "Computer Science Tutor | University of Florida (Fall 2022 - Fall 2023)",
          content: [
            "Tutored students in introductory Computer Science classes such as Data Structures and intro to programming",
          ],
        },
        {
          id: "9",
          section: Sections.Experience,
          header: "Software Engineer | Bank of America (2024)",
          content: ["Worked on API calls using Java"],
        },
        {
          id: "13",
          section: Sections.Experience,
          header:
            "Software Engineering TA | University of Florida (Fall 2023 - Spring 2024)",
          content: [
            "Advised students on software engineering",
            "Held office hours",
          ],
        },
      ],
    },
    {
      sectionHeader: Sections.Projects,
      entryList: [
        {
          id: "10",
          section: Sections.Projects,
          header: "Interpreter | Junit, Java, Git",
          content: [
            "Created an interpreter consisting of a Lexer, Parser, Interpreter, Analyzer and Generator",
            "Implemented more than 300 unit tests using Junit to ensure perfect functionality",
          ],
        },
        {
          id: "11",
          section: Sections.Projects,
          header: "SFML Piano | SFML, C++, Git",
          content: [
            "Used SFML to create a piano visualizer that interprets midi files and then shows the notes falling",
          ],
        },
        {
          id: "12",
          section: Sections.Projects,
          header: "Senior Project | React, Typescript, Git",
          content: [
            "Used react to create a resume drag and drop website",
            "worked on the frontend interface using mostly Typescript",
          ],
        },
        {
          id: "3",
          section: Sections.Projects,
          header: "Personal Website | React, Python",
          content: ["Created customized personal website as a portfolio"],
        },
        {
          id: "4",
          section: Sections.Projects,
          header: "ML Model for Image Classification | TensorFlow",
          content: [
            "Developed a convolutional neural network (CNN) that achieved an accuracy of 95% on the test dataset",
          ],
        },
        {
          id: "5",
          section: Sections.Projects,
          header: "Autoencoder | Python, Pytorch",
          content: [
            "Implemented autoencoder to compress and decompress images from the MNIST dataset",
          ],
        },
      ],
    },
    {
      sectionHeader: "Uncategorized",
      entryList: [],
    }
  ];
  