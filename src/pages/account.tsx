/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { TextInput, Chip, Button } from "@mantine/core";
import { useForm } from '@mantine/form';
import { Link, useNavigate } from "react-router-dom";

export interface updateUserObj {
    username: string,
    role: boolean
}



const AccountPage = () => {
const {username, userEmail, admin, updateUser, userId, setJwt} = useContext(TimesheetContext);
const navigate = useNavigate();
const form = useForm({
    initialValues: {
        username: username,
        role: admin
    }
});

const signOut = () => {
    setJwt('');
    navigate('/');
}

const submitForm = async (values:updateUserObj) => {
    const updateValues = {
        username: values.username,
        role: values.role ? 'ADMIN' : 'USER'
    };
    const isSuccess = await updateUser(updateValues, userId);
    isSuccess ? signOut() : console.log('error updating user');
    
}   

    return(
        <form style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'center', padding:'30px'}} onSubmit={form.onSubmit((values) => submitForm(values))}>
            <h1>User Account</h1>
            <div style={{width:'50%', height:'20%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <TextInput label='Email' value={userEmail} disabled size="lg"/>
                <TextInput label='Username' value={username} size="lg" {...form.getInputProps('username')}/>
            </div>
            <div style={{width:'50%', height:'5%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Chip checked={form.values.role} onChange={() => form.setValues({role:!admin})}>I am an Administrator</Chip>
            </div>
            <div style={{width:'50%', height:'20%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Button type="submit">Update User Info</Button>
            </div>

        </form>
    )
}

export default AccountPage;