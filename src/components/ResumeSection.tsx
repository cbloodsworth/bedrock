import React from "react";
import DroppableContainer from "../components/DroppableContainer";
import { EntryStruct } from "../utility/EntryData";

interface Props {
  id: string;
  header: string;
  box: EntryStruct[];
}

const ResumeSection: React.FC<Props> = ({ id, header, box }) => {
  return <DroppableContainer id={id} header={header} box={box} resumeEntry={true}/>;
};

export default ResumeSection;
