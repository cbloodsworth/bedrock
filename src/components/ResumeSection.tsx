import React from "react";
import DroppableContainer from "../components/DroppableContainer";
import { EntryStruct } from "../utility/EntryData";

interface Props {
  id: string;
  header: string;
  box: EntryStruct[];
  editEntry? : boolean;
}

const ResumeSection: React.FC<Props> = ({ id, header, box, editEntry }) => {
  return <DroppableContainer id={id} header={header} box={box} editEntry={editEntry} resumeEntry={true}/>;
};

export default ResumeSection;
