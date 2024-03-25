import { createContext, useEffect, useState, SetStateAction, Dispatch } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export interface TimesheetContextInterface {
    jwt: string,
    setJwt: Dispatch<SetStateAction<string>>,
    admin: boolean,
    setAdmin: Dispatch<SetStateAction<boolean>>,
    userId: number,
    setUserId: Dispatch<SetStateAction<number>>,
    username: string,
    setUsername: Dispatch<SetStateAction<string>>,
    programs: object[],
    setPrograms: Dispatch<SetStateAction<unknown>>,
    entries: object[],
    setEntries: Dispatch<SetStateAction<unknown>>
}

const TimesheetContext = createContext<TimesheetContextInterface> ({
    jwt: '',
    setJwt: () => {},
    admin: false,
    setAdmin: () => {},
    userId: 0,
    setUserId: () => {},
    programs: [],
    setPrograms: () => {},
    entries: [],
    setEntries: () => {},
    username: '',
    setUsername: () => {}
});

export interface Props {
    children: unknown;
}

const TimesheetProvider = (props: Props) => {
    const [jwt, setJwt] = useState('');
    const [admin, setAdmin] = useState(false);
    const [userId, setUserId] = useState(0);
    const [programs, setPrograms] = useState([] as object[]);
    const [entries, setEntries] = useState([] as object[]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (jwt) {
            const decoded = jwtDecode(jwt);
            console.log(decoded);
            //assign admin, userID, username  
        }
    }, [jwt])

    const server = axios.create({
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        }
    });
    
    const serverUrl = 'https://localhost:8080';

    const login = async (user: object) => {
        try {
            const url = serverUrl + '/authenticate';
            const response = await server.post(url, user);
            setJwt(JSON.parse(response.data));
            
        } catch (error) {
            console.error('Error authenticating user:', error);
        }
    }

    const register = async(user:object) => {
        try {
            const url = serverUrl + '/users/register';
            const response = await server.post(url, user);
            console.log(response);
            //login with new user
        } catch(error) {
            console.error('Error with registration:', error);
        }
    }

    const getUser = async() => {
        try {
            const url = serverUrl + `users/${userId}`;
            const response = await server.get(url);
        } catch(error) {
            console.error('Error fetching user:', error);
        }
    }

    const updateUser = async(userUpdate:object) => {
        try {
            const url = serverUrl + `users/${userId}`;
            const response = await server.put(url, userUpdate);
            //update state if changed ?
        } catch(error) {
            console.error('Error updating user', error);
        }
    }

    const getPrograms = async() => {
        try {
            const url = serverUrl + '/api/programs';
            const response = await server.get(url);
            //set programs
        } catch(error) {
            console.error('Error fetching programs', error);
        }
    }

    const getEntries = async() => {
        try {
            const url = serverUrl + '/api/timesheetEntries';
            const response = await server.get(url);
            //set entries
        } catch(error) {
            console.error('Error fetching entries', error);
        }
    }

    const createProgram = async(program:object) => {
        try {
            const url = serverUrl + '/api/programs';
            const response = await server.post(url, program);
            // re fetch programs
        } catch(error) {
            console.error('Error creating program:', error);
        }
    }

    const createEntry = async(entry:object) => {
        try {
            const url = serverUrl + '/api/timesheetEntries';
            const response = await server.post(url, entry);
            // re fetch entries
        } catch(error) {
            console.error('Error creating entry:', error);
        }
    }

    const updateProgram = async(program:object, programId:number) => {
        try {   
            const url = serverUrl + `/api/programs/${programId}`;
            const response = await server.put(url, program);
            // re fetch programs
        } catch(error) {
            console.error('Error updating program:', error);
        }
    }

    const updateEntry = async(entry:object, entryId:number) => {
        try {
            const url = serverUrl + `/api/timesheetEntries/${entryId}`;
            const response = await server.post(url, entry);
            // re fetch entries
        } catch(error) {
            console.error('Error updating entry:', error);
        }
    }

    const deleteEntry = async(entryId:number) => {
        try {
            const url = serverUrl + `/api/timesheetEntries/${entryId}`;
            const response = await server.delete(url)
            //refetch
        } catch(error) {
            console.error('Error deleting entry:', error);
        }
    }

    const deleteProgram = async(programId:number) => {
        try {
            const url = serverUrl + `/api/programs/${programId}`;
            const response = await server.delete(url)
            //refetch
        } catch(error) {
            console.error('Error deleting entries:', error);
        }
    }

    return(
        <TimesheetContext.Provider value={{jwt, setJwt, admin, setAdmin, userId, setUserId, entries, setEntries, programs, setPrograms, username, setUsername}}>{props.children}</TimesheetContext.Provider>
    )
}

export { TimesheetContext, TimesheetProvider };