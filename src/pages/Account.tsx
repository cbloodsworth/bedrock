import React, { useState } from 'react';
import EntryBox from '../components/EntryBox'
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable , DropResult} from 'react-beautiful-dnd';
import DroppableContainer from '../components/DroppableContainer';
import {Box, Card, Heading, Main, CardHeader} from 'grommet';

const Entries = {
    EntryBox1 : [
        {
            header: "Entry 1",
            text: "Text 1",
            id: "Box1"
        },
        {
            header: "Entry 4",
            text: "Text 4",
            id: "Box4"
        },
        {
            header: "Entry 5",
            text: "Text 5",
            id: "Box5"
        },
        {
            header: "Entry 6",
            text: "Text 6",
            id: "Box6"
        },
        {
            header: "Entry 7",
            text: "Text 7",
            id: "Box7"
        },
    ],
    EntryBox2 : [
    {   
            header: "Entry 2",
            text: "Text 2",
            id: "Box2"
        },  
        {
            header: "Entry 3",
            text: "Text 3",
            id: "Box3"
        },  
    ],
}

const Account: React.FC = () => {
    const [entries, setEntries] = React.useState(Entries);

    const handleDragEnd = (result: DropResult) => {
        console.log("here");
        const src = result.source;
        const dest = result.destination;
        console.log(result);
    
        if (!dest) { //not in any droppable area
            return;
        }
    
        let srcDrop = src.droppableId as keyof typeof entries;
        let destDrop = dest.droppableId as keyof typeof entries;

        //stayed in original droppable area
        if (src.droppableId === dest.droppableId) {
            const res = [...entries[srcDrop]];
            const [removed] = res.splice(src.index, 1);
            res.splice(dest.index, 0, removed);
            const updatedEntries = {...entries};
            updatedEntries[srcDrop] = res;
            setEntries({...updatedEntries});
            return;
        }
    
        //Moved to new droppable area
        console.log("SRC: ", entries[srcDrop]);
        console.log("DEST: ", entries[destDrop]);
    
        const srcArrayCopy = [...entries[srcDrop]];
        const destArrayCopy = [...entries[destDrop]];
        
        const [removedItem] = srcArrayCopy.splice(src.index, 1);
        destArrayCopy.splice(dest.index, 0, removedItem);
    
        const updatedEntries = {
            ...entries,
            [srcDrop]: srcArrayCopy,
            [destDrop]: destArrayCopy,
        };

        setEntries({...updatedEntries});
        console.log(entries);
    };

    return (
        <Main align="center">
        <Heading>
          <Card background="#f0f0f0">
            <CardHeader pad="small">Drag and Drop Trial</CardHeader>
          </Card>
        </Heading>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box>
                <Box pad="small" direction="row" gap="large">
                <DroppableContainer text="Resume" box={entries.EntryBox1 || []} id="EntryBox1"/>
                <DroppableContainer text="Entries" box={entries.EntryBox2 || []} id="EntryBox2"/>
            </Box>
          </Box>
        </DragDropContext>
      </Main>
    );
};

export default Account;
