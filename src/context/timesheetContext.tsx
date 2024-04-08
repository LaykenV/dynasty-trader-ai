/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useEffect, useState, SetStateAction, Dispatch, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { LoginObj } from "../components/loginForm";
import { RegisterObj } from "../components/registerForm";
import { Entry, NewEntry, Program } from "../pages/dashboard";
import { NewProgram } from "../pages/programs";


export interface TimesheetContextInterface {
    jwt: string,
    setJwt: Dispatch<SetStateAction<string>>,
    userEmail: string,
    admin: boolean,
    setAdmin: Dispatch<SetStateAction<boolean>>,
    userId: number,
    setUserId: Dispatch<SetStateAction<number>>,
    username: string,
    setUsername: Dispatch<SetStateAction<string>>,
    programs: Program[],
    setPrograms: Dispatch<SetStateAction<Program[]>>,
    entries: Entry[],
    setEntries: Dispatch<SetStateAction<Entry[]>>,
    login: (user: LoginObj) => Promise<boolean>,
    register: (user: RegisterObj) => Promise<boolean>,
    getUser: () => Promise<boolean>,
    updateUser: (userUpdate: object, userId: number) => Promise<boolean>,
    getPrograms: () => Promise<boolean>,
    getEntries: (userId:number) => Promise<boolean>,
    createProgram: (program: NewProgram) => Promise<boolean>,
    createEntry: (entry: NewEntry) => Promise<boolean>,
    updateProgram: (program: NewProgram, programId: number) => Promise<boolean>,
    updateEntry: (entry: Entry, entryId: number) => Promise<boolean>,
    deleteProgram: (programId: number) => Promise<boolean>,
    deleteEntry: (entryId: number) => Promise<boolean>
}

const TimesheetContext = createContext<TimesheetContextInterface> ({
    jwt: '',
    setJwt: () => {},
    userEmail: '',
    admin: false,
    setAdmin: () => {},
    userId: 0,
    setUserId: () => {},
    programs: [],
    setPrograms: () => {},
    entries: [],
    setEntries: () => {},
    username: '',
    setUsername: () => {},
    login: async (user: LoginObj) => false,
    register: async (user: RegisterObj) => false,
    getUser: async () => false,
    updateUser: async (userUpdate: object, userId: number) => false,
    getPrograms: async () => false,
    getEntries: async (userId:number) => false,
    createProgram: async (program: NewProgram) => false,
    createEntry: async (entry: NewEntry) => false,
    updateProgram: async (program: NewProgram, programId: number) => false,
    updateEntry: async (entry: Entry, entryId: number) => false,
    deleteProgram: async (programId: number) => false,
    deleteEntry: async (entryId: number) => false
}); 

export interface Props {
    children: ReactNode;
}

interface CustomJwtPayload {
    sub: string; 
    roles: string[];
    id: number;
    iat: number;
    exp: number;
  }

const TimesheetProvider = (props: Props) => {
    const [jwt, setJwt] = useState('');
    const [admin, setAdmin] = useState(false);
    const [userId, setUserId] = useState(0);
    const [programs, setPrograms] = useState([] as Program[]);
    const [entries, setEntries] = useState([] as Entry[]);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        if (jwt) {
          const decoded = jwtDecode<CustomJwtPayload>(jwt);
          console.log(decoded);
          if (decoded.roles.includes('USER')) {
            setAdmin(false);
          } else {
            setAdmin(true);
          }
          setUserId(decoded.id);
          setUsername(decoded.sub);
        }
      }, [jwt]);

    const server = axios.create({
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        }
    });
    
    const serverUrl = 'http://localhost:8080';

    const login = async (user: LoginObj): Promise<boolean> => {
        try {
            const url = serverUrl + '/authenticate';
            const response = await server.post(url, user);
            console.log(response);
            setJwt(response.data.jwt);
            setUserEmail(user.username);
            return true;
        } catch (error) {
            console.error('Error authenticating user:', error);
            return false;
        }
    }

    const register = async(user:RegisterObj) => {
        try {
            const url = serverUrl + '/users/register';
            const response = await server.post(url, user);
            console.log(response);
            const obj:LoginObj = {
                username: response.data.email,
                password: user.password
            }
            await login(obj);
            return true;
        } catch(error) {
            console.error('Error with registration:', error);
            return false;
        }
    }

    const getUser = async() => {
        try {
            const url = serverUrl + `/users/${userId}`;
            const response = await server.get(url);
            return true;
        } catch(error) {
            console.error('Error fetching user:', error);
            return false;
        }
    }

    const updateUser = async(userUpdate:object, userId:number) => {
        try {
            const url = serverUrl + `/users/${userId}`;
            console.log(url);
            
            const response = await server.put(url, userUpdate);
            console.log(response);
            return true;
        } catch(error) {
            console.error('Error updating user', error);
            return false;
        }
    }

    const getPrograms = async() => {
        try {
            const url = serverUrl + '/api/programs';
            const response = await server.get(url);
            setPrograms(response.data)
            return true;
        } catch(error) {
            console.error('Error fetching programs', error);
            return false;
        }
    }

    const getEntries = async(userId:number) => {
        try {
            const url = serverUrl + `/api/timesheetEntries/users/${userId}`;
            const response = await server.get(url);
            console.log(response);
            setEntries(response.data)
            return true;
        } catch(error) {
            console.error('Error fetching entries', error);
            return false;
        }
    }

    const createProgram = async(program:NewProgram) => {
        try {
            const url = serverUrl + '/api/programs';
            const response = await server.post(url, program);
            await getPrograms()
            return true;
        } catch(error) {
            console.error('Error creating program:', error);
            return false;
        }
    }

    const createEntry = async(entry:NewEntry) => {
        try {
            const url = serverUrl + '/api/timesheetEntries';
            const response = await server.post(url, entry);
            console.log(response);
            await getEntries(userId);
            return true;
        } catch(error) {
            console.error('Error creating entry:', error);
            return false;
        }
    }

    const updateProgram = async(program:NewProgram, programId:number) => {
        try {   
            const url = serverUrl + `/api/programs/${programId}`;
            const response = await server.put(url, program);
            await getPrograms();
            return true;
        } catch(error) {
            console.error('Error updating program:', error);
            return false;
        }
    }

    const updateEntry = async(entry:NewEntry, entryId:number) => {
        try {
            const url = serverUrl + `/api/timesheetEntries/${entryId}`;
            const response = await server.put(url, entry);
            await getEntries(userId);
            return true;
        } catch(error) {
            console.error('Error updating entry:', error);
            return false;
        }
    }

    const deleteEntry = async(entryId:number) => {
        try {
            const url = serverUrl + `/api/timesheetEntries/${entryId}`;
            const response = await server.delete(url);
            await getEntries(userId);
            return true;
        } catch(error) {
            console.error('Error deleting entry:', error);
            return false;
        }
    }

    const deleteProgram = async(programId:number) => {
        try {
            const url = serverUrl + `/api/programs/${programId}`;
            const response = await server.delete(url)
            await getPrograms();
            return true;
        } catch(error) {
            console.error('Error deleting entries:', error);
            return false;
        }
    }

    return(
        <TimesheetContext.Provider value={{updateUser, userEmail, updateEntry, updateProgram, deleteEntry, deleteProgram, getEntries, getPrograms, createEntry, createProgram, getUser, register, login, jwt, setJwt, admin, setAdmin, userId, setUserId, entries, setEntries, programs, setPrograms, username, setUsername}}>{props.children}</TimesheetContext.Provider>
    )
}

export { TimesheetContext, TimesheetProvider };