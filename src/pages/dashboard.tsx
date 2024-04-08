/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { useDisclosure } from "@mantine/hooks";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Button, NumberInput, NativeSelect, Textarea, Notification, Modal } from '@mantine/core';
import { IconCheck, IconX, IconAdjustments } from '@tabler/icons-react';


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
    const {userId, getEntries, getPrograms, programs, entries, createEntry, updateEntry, deleteEntry, username} = useContext(TimesheetContext);
    const [selectedDate, setSelectedDate] = useState<Date | null>((() => {
        const date = new Date(); // Create a new date object
        date.setHours(0, 0, 0, 0); // Set its time to 00:00:00
        return date; // Return the modified date object
    })());
    const [showForm, setShowForm] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        color: 'teal', // default for success
    });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    
    useEffect(() => {
        const fetchData = async () => {
            if (userId !== 0) {
                await getPrograms();
                await getEntries(userId);
            }
        };
        fetchData();
    }, [userId]);

    useEffect(() => {
        // Check if there's an entry for the selected date when selectedDate changes
        const entryExists = entries.some(entry => formatDateIgnoreTimezone(new Date(entry.date)) === formatDateIgnoreTimezone(selectedDate));
        setShowForm(entryExists);
        entryExists ? setAlreadySubmitted(true) : setAlreadySubmitted(false);
    }, [selectedDate, entries]);

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
        console.log(id);
        
        return id ?? 0; // Return 0 or any appropriate default value if programId is undefined
    }

    const form = useForm({
        initialValues: {
            hours: 0,
            program: '',
            description: ''
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

    const CreateNewEntry = async (values: NewEntry, entries: Entry[]) => {
        try {
            const existingEntry = entries.find(entry => entry.date === values.date);
            
            if (existingEntry) {
                // If an entry exists, update it
                await updateEntry(values, existingEntry.entryId);
                setNotification({ show: true, message: 'Entry updated successfully!', color: 'teal' });
            } else {
                // If no entry exists for this date, create a new one
                await createEntry(values);
                setNotification({ show: true, message: 'Entry created successfully!', color: 'teal' });
            }
        } catch (error) {
            console.error(error);
            setNotification({ show: true, message: 'Failed to submit entry.', color: 'red' });
        }
    };

    
    
    useEffect(() => {
        if (selectedDate && programs.length > 0) {
            form.setValues({
                hours: findEntryHoursByDate(formatDateIgnoreTimezone(selectedDate), entries) || 0,
                program: findEntryProgramByDate(formatDateIgnoreTimezone(selectedDate), entries, programs) || programs[0].name,
                description: findEntryDescriptionByDate(formatDateIgnoreTimezone(selectedDate), entries) || ''
            })
        }
    }, [selectedDate, programs, entries]);

    const handleDelete = async () => {
        const existingEntry = entries.find((entry) => formatDateIgnoreTimezone(selectedDate) === formatDateIgnoreTimezone(new Date(entry.date)));
        console.log(existingEntry);
        if (existingEntry) {
            await deleteEntry(existingEntry.entryId);
            setDeleteModalOpen(false);            
        }
    }
    
    

    return(
        <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'center', gap:'50px', padding:'30px'}}>
                {notification.show && (
                    <div style={{position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: 'auto', maxWidth: '90%'}}>
                        <Notification 
                            icon={notification.color === 'teal' ? <IconCheck size={18} /> : <IconX size={18} />} 
                            color={notification.color} 
                            title={notification.color === 'teal' ? "Success" : "Error"}
                            onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
                        >
                            {notification.message}
                        </Notification>
                    </div>
            )}
                <h1>{username}'s Timesheet</h1>
                <div style={{backgroundColor:'white', color: 'black', borderRadius: '5%', padding: '5px'}}><DatePicker value={selectedDate} onChange={setSelectedDate} size="xl"></DatePicker></div>
                {showForm ? (
                <form style={{display:'flex', flexDirection:'column', justifyContent:'space-around', width:'60%', height:'40%', gap:'20px'}} onSubmit={form.onSubmit((values) => CreateNewEntry(convertFormToEntry(values), entries))}>
                    <div style={{display:'flex', width:'100%', justifyContent:'center', height:'20%', gap:'40px'}}>
                            <NumberInput label='How many hours did you work on this day?' {...form.getInputProps('hours')}/>
                            <NativeSelect label="Which Program did you work on this day?" data={programs.map(obj => obj.name)} {...form.getInputProps('program')}/>
                    </div>
                    <Textarea label='Description' placeholder="Write your description as needed" {...form.getInputProps('description')} size="lg" autosize minRows={3}/>
                    {alreadySubmitted ? 
                    (<div style={{display:'flex', flexDirection:'column', gap:'20px', alignItems: 'center'}}><Button type="submit" style={{width:'50%'}}>Update Timesheet Entry</Button><Button color="red" style={{width:'50%'}} onClick={() => {setDeleteModalOpen(true)}}>Delete Timesheet Entry</Button></div>) : 
                    (<Button type="submit" style={{width:'50%', alignSelf:'center'}}>Submit Timesheet Entry</Button>)}
                </form>
                ): (
                    <Button onClick={() => setShowForm(true)} size="lg" rightSection={<IconAdjustments/>}>Add Entry</Button>
                )}
            
            <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title='Are you sure you want to delete this entry?' centered={true}>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'25px'}}>
                    <Button onClick={() => handleDelete()} color="red">Delete</Button>
                </div>
            </Modal>
        
        </div>
    )
}

export default Dashboard;