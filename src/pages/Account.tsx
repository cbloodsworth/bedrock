import React from 'react'; //{ useState }
//import { Link } from 'react-router-dom';
import { DragDropContext, DropResult} from 'react-beautiful-dnd'; //Droppable
import DroppableContainer from '../components/DroppableContainer';
import {Box, Grid} from 'grommet'; //Card, Heading, Main, CardHeader 
import Resume from '../components/Resume'
import '../styles/Account.css'

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
        }
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
    EntryBox3 : [
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
    EntryBox4 : [
        {
            header: "Entry 8",
            text: "Text 8",
            id: "Box8"
        },
        {
            header: "Entry 9",
            text: "Text 9",
            id: "Box9"
        },
        {
            header: "Entry 10",
            text: "Text 10",
            id: "Box10"
        },
    ]
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
        <DragDropContext onDragEnd={handleDragEnd}>
            <Grid
            columns={['75%', '23%']}
            gap="medium"
        >
            <Box>
                <Resume>
                    <DroppableContainer text="Header 1" box={entries.EntryBox1 || []} id="EntryBox1"/>
                    <DroppableContainer text="Header 2" box={entries.EntryBox3 || []} id="EntryBox3"/>
                    <DroppableContainer text="Header 3" box={entries.EntryBox4 || []} id="EntryBox4"/>
                </Resume>
            </Box>
            <Box>
                    <DroppableContainer text="Entries" box={entries.EntryBox2 || []} id="EntryBox2"/>
            </Box>
          </Grid>
        </DragDropContext>
    );
};

export default Account;
