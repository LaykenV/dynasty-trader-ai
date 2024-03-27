/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useEffect, useState, SetStateAction, Dispatch, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { LoginObj } from "../components/loginForm";
import { RegisterObj } from "../components/registerForm";

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
    setPrograms: Dispatch<SetStateAction<object[]>>,
    entries: object[],
    setEntries: Dispatch<SetStateAction<object[]>>,
    login: (user: LoginObj) => Promise<boolean>,
    register: (user: RegisterObj) => Promise<boolean>,
    getUser: () => Promise<boolean>,
    updateUser: (userUpdate: object) => Promise<boolean>,
    getPrograms: () => Promise<boolean>,
    getEntries: () => Promise<boolean>,
    createProgram: (program: object) => Promise<boolean>,
    createEntry: (entry: object) => Promise<boolean>,
    updateProgram: (program: object, programId: number) => Promise<boolean>,
    updateEntry: (entry: object, entryId: number) => Promise<boolean>,
    deleteProgram: (programId: number) => Promise<boolean>,
    deleteEntry: (entryId: number) => Promise<boolean>
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
    setUsername: () => {},
    login: async (user: LoginObj) => false,
    register: async (user: RegisterObj) => false,
    getUser: async () => false,
    updateUser: async (userUpdate: object) => false,
    getPrograms: async () => false,
    getEntries: async () => false,
    createProgram: async (program: object) => false,
    createEntry: async (entry: object) => false,
    updateProgram: async (program: object, programId: number) => false,
    updateEntry: async (entry: object, entryId: number) => false,
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
    const [programs, setPrograms] = useState([] as object[]);
    const [entries, setEntries] = useState([] as object[]);
    const [username, setUsername] = useState('');

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
            const url = serverUrl + `users/${userId}`;
            const response = await server.get(url);
            return true;
        } catch(error) {
            console.error('Error fetching user:', error);
            return false;
        }
    }

    const updateUser = async(userUpdate:object) => {
        try {
            const url = serverUrl + `users/${userId}`;
            const response = await server.put(url, userUpdate);
            return true;
            //update state if changed ?
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

    const getEntries = async() => {
        try {
            const url = serverUrl + '/api/timesheetEntries';
            const response = await server.get(url);
            console.log(response);
            setEntries(response.data)
            return true;
        } catch(error) {
            console.error('Error fetching entries', error);
            return false;
        }
    }

    const createProgram = async(program:object) => {
        try {
            const url = serverUrl + '/api/programs';
            const response = await server.post(url, program);
            return true;
            // re fetch programs
        } catch(error) {
            console.error('Error creating program:', error);
            return false;
        }
    }

    const createEntry = async(entry:object) => {
        try {
            const url = serverUrl + '/api/timesheetEntries';
            const response = await server.post(url, entry);
            return true;
            // re fetch entries
        } catch(error) {
            console.error('Error creating entry:', error);
            return false;
        }
    }

    const updateProgram = async(program:object, programId:number) => {
        try {   
            const url = serverUrl + `/api/programs/${programId}`;
            const response = await server.put(url, program);
            return true;
            // re fetch programs
        } catch(error) {
            console.error('Error updating program:', error);
            return false;
        }
    }

    const updateEntry = async(entry:object, entryId:number) => {
        try {
            const url = serverUrl + `/api/timesheetEntries/${entryId}`;
            const response = await server.post(url, entry);
            return true;
            // re fetch entries
        } catch(error) {
            console.error('Error updating entry:', error);
            return false;
        }
    }

    const deleteEntry = async(entryId:number) => {
        try {
            const url = serverUrl + `/api/timesheetEntries/${entryId}`;
            const response = await server.delete(url)
            return true;
            //refetch
        } catch(error) {
            console.error('Error deleting entry:', error);
            return false;
        }
    }

    const deleteProgram = async(programId:number) => {
        try {
            const url = serverUrl + `/api/programs/${programId}`;
            const response = await server.delete(url)
            return true;
            //refetch
        } catch(error) {
            console.error('Error deleting entries:', error);
            return false;
        }
    }

    return(
        <TimesheetContext.Provider value={{updateUser, updateEntry, updateProgram, deleteEntry, deleteProgram, getEntries, getPrograms, createEntry, createProgram, getUser, register, login, jwt, setJwt, admin, setAdmin, userId, setUserId, entries, setEntries, programs, setPrograms, username, setUsername}}>{props.children}</TimesheetContext.Provider>
    )
}

export { TimesheetContext, TimesheetProvider };