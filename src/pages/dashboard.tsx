/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, NumberInput, NativeSelect } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";

 export interface Entry {
    date: string,
    description: string,
    entryId: number,
    hours: number,
    program: number,
    user: number
}


const Dashboard = () => {
    const {jwt, userId, getEntries, getPrograms, programs, entries} = useContext(TimesheetContext);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    async function getData() {
        await getPrograms();
        await getEntries(userId);
    }

    useEffect(() => {
        if (userId !== 0) {
            console.log(jwt);
            getData();    
        }
    }, [userId]);

    useEffect(() => {
        console.log(entries);
        console.log(programs);
        
    }, [entries])

    const findEntryByDate = (date:string, arr:Entry[]) => {
        return arr.find(obj => obj.date === date);
    }

    

    const form = useForm({
        initialValues: {
            hoursWorked: {},
            program: 'React'
        }
    })

    function formatDateIgnoreTimezone(date: Date | null): string {
        if (!date) return ''; 
    
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
    
    useEffect(() => {
        if (selectedDate) {
            console.log(findEntryByDate(formatDateIgnoreTimezone(selectedDate), entries));
            
            console.log(formatDateIgnoreTimezone(selectedDate));
        }
    }, [selectedDate]);
    

    return(
        <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'space-around', alignItems:'center'}}>
                <DatePicker value={selectedDate} onChange={setSelectedDate} size="md"></DatePicker>
                <form style={{display:'flex', flexDirection:'column', justifyContent:'space-around', flexGrow:1}}>
                    <div style={{display:'flex', width:'100%', justifyContent:'space-around'}}>
                        <NumberInput label='How many hours did you work on this day?' {...form.getInputProps('hoursWorked')}/>
                        <NativeSelect label="Which Program did you work on this day?" data={['React', 'Angular', 'Vue']} {...form.getInputProps('program')}/>
                    </div>
                    <Button>Submit Timesheet Entry</Button>
                </form>
        </div>
    )
}

export default Dashboard;