export interface EntryStruct {
  id: string;
  section: string;
  header: string;
  content: string[];
}

export const EntryData = {
  EntryBox1: [
    {
      id: "2",
      section: "Education",
      header: "University of Florida | Gainesville, FL",
      content: [
        "B.S in Computer Science and Minor in mathematics | GPA: 4.0/4.0",
      ],
    },
  ],
  EntryBox2: [
    {
      id: "3",
      section: "Projects",
      header: "Personal Website | React, Python",
      content: ["Created customized personal website as a portfolio"],
    },
    {
      id: "4",
      section: "Projects",
      header: "ML Model for Image Classification | TensorFlow",
      content: [
        "Developed a convolutional neural network (CNN) that achieved an accuracy of 95% on the test dataset",
      ],
    },
    {
      id: "5",
      section: "Projects",
      header: "Autoencoder | Python, Pytorch",
      content: [
        "Implemented autoencoder to compress and decompress images from the MNIST dataset",
      ],
    },
  ],
  EntryBox3: [
    {
      id: "7",
      section: "Experience",
      header: "Software Engineer Intern | Bank of America (2023)",
      content: [
        "Helped create API call for new feature and used tools like Splunk to review code defects",
      ],
    },
    {
      id: "8",
      section: "Experience",
      header:
        "Computer Science Tutor | University of Florida (Fall 2022 - Fall 2023)",
      content: [
        "Tutored students in introductory Computer Science classes such as Data Structures and intro to programming",
      ],
    },
    {
      id: "9",
      section: "Experience",
      header: "Software Engineer | Bank of America (2024)",
      content: ["Worked on API calls using Java"],
    },
  ],
  EntryBox4: [
    {
      id: "10",
      section: "Projects",
      header: "Interpreter | Junit, Java, Git",
      content: [
        "Created an interpreter consisting of a Lexer, Parser, Interpreter, Analyzer and Generator",
        "Implemented more than 300 unit tests using Junit to ensure perfect functionality",
      ],
    },
    {
      id: "11",
      section: "Projects",
      header: "SFML Piano | SFML, C++, Git",
      content: [
        "Used SFML to create a piano visualizer that interprets midi files and then shows the notes falling",
      ],
    },
    {
      id: "12",
      section: "Projects",
      header: "Senior Project | React, Typescript, Git",
      content: [
        "Used react to create a resume drag and drop website",
        "worked on the frontend interface using mostly Typescript",
      ],
    },
  ],
};