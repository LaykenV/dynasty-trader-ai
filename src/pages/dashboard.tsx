/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, NumberInput, NativeSelect, TextInput } from "@mantine/core";
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

export interface NewEntry {
    date: string,
    description: string,
    hours: number,
    program: number,
    user: number
}

export interface Program {
    createdAt: string,
    description: string,
    name: string,
    programId: number,
    updatedAt: string
}

interface formObj {
    program: string,
    hours: number, 
    description: string
}

const Dashboard = () => {
    const {jwt, userId, getEntries, getPrograms, programs, entries, createEntry} = useContext(TimesheetContext);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [entryOnSelectedDate, setEntryOnSelectedDate] = useState({} as Entry);
    
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

    const findEntryHoursByDate = (date:string, arr:Entry[]) => {
        const entry = arr.find(obj => obj.date === date);
        return entry?.hours;
    }

    const findEntryDescriptionByDate = (date:string, arr:Entry[]) => {
        const entry = arr.find(obj => obj.date === date);
        return entry?.description;
    }

    const findEntryProgramByDate = (date:string, arr:Entry[], programArr:Program[]) => {
        const entry = arr.find(obj => obj.date === date);
        const program = programArr.find(obj => obj.programId === entry?.program);
        return program?.name;
    }

    const findProgramIdbyName = (programName: string, programs: Program[]): number => {
        const prog = programs.find(obj => obj.name === programName);
        const id = prog?.programId;
        return id ?? 0; // Return 0 or any appropriate default value if programId is undefined
    }
    

    const form = useForm({
        initialValues: {
            hours: findEntryHoursByDate(formatDateIgnoreTimezone(selectedDate), entries) || 0,
            program: findEntryProgramByDate(formatDateIgnoreTimezone(selectedDate), entries, programs) || '',
            description: findEntryDescriptionByDate(formatDateIgnoreTimezone(selectedDate), entries) || ''
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

    const convertFormToEntry = (values:formObj) => {
        const obj:NewEntry = {
            hours: values.hours,
            description: values.description,
            program: findProgramIdbyName(values.program, programs),
            date: formatDateIgnoreTimezone(selectedDate),
            user: userId
        }
        return obj;
    }

    const CreateNewEntry = async (values:NewEntry) => {
        const isSuccess = await createEntry(values);
        return console.log(isSuccess);
        
        //success or failure banner
    }
    
    useEffect(() => {
        if (selectedDate) {
            console.log(findEntryHoursByDate(formatDateIgnoreTimezone(selectedDate), entries));
            console.log(findEntryProgramByDate(formatDateIgnoreTimezone(selectedDate), entries, programs));
        }
        form.setValues({hours: findEntryHoursByDate(formatDateIgnoreTimezone(selectedDate), entries) || 0, program: findEntryProgramByDate(formatDateIgnoreTimezone(selectedDate), entries, programs) || ''})
    }, [selectedDate]);
    

    return(
        <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'space-around', alignItems:'center'}}>
                <DatePicker value={selectedDate} onChange={setSelectedDate} size="md"></DatePicker>
                <form style={{display:'flex', flexDirection:'column', justifyContent:'space-around', flexGrow:1}} onSubmit={form.onSubmit((values) => CreateNewEntry(convertFormToEntry(values)))}>
                    <div style={{display:'flex', width:'100%', justifyContent:'space-around'}}>
                        <NumberInput label='How many hours did you work on this day?' {...form.getInputProps('hours')}/>
                        <NativeSelect label="Which Program did you work on this day?" data={programs.map(obj => obj.name)} {...form.getInputProps('program')}/>
                        <TextInput label='Description' placeholder="Write your description as needed" {...form.getInputProps('description')}/>
                    </div>
                    <Button type="submit">Submit Timesheet Entry</Button>
                </form>
        </div>
    )
}

export default Dashboard;