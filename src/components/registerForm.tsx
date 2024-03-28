/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { Box, Button, Group, PasswordInput, Radio, Stack, TextInput } from "@mantine/core";
import { useForm } from '@mantine/form';
import { Link, useNavigate } from "react-router-dom";

export interface RegisterObj {
    email: string,
    password: string, 
    username: string, 
    role: string,
}

interface formObj {
    email: string,
    password: string, 
    username: string, 
    role: boolean,
}

const RegisterForm = () => {
    const {register} = useContext(TimesheetContext);
    const navigate = useNavigate();

    const registerWithFormValues = async (values:RegisterObj) => {
        console.log(values);
        
       const isSuccess = await register(values);
       isSuccess ? navigate('/dashboard') : console.log('Login Failed: Invalid credentials.') // error banner;
    };

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            email: '',
            role: false
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => value.length < 8 ? 'Password must be 8 characters long.' : null,
        }
    });

    const convertToInterface = (values:formObj) => {
        if (values.role) {
            const obj:RegisterObj = {
                username: values.username,
                password: values.password,
                email: values.email,
                role: 'ADMIN'
            }
            return obj;
        } 

        const obj:RegisterObj = {
            username: values.username,
            password: values.password,
            email: values.email,
            role: 'USER'
        };

        return obj;
    };

    return(
        <div style={{height:'100%', width:'100%'}}>
            <form style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'space-around'}} onSubmit={form.onSubmit((values) => registerWithFormValues(convertToInterface(values)))}>
                <TextInput
                    label='Email'
                    placeholder='Your email address'
                    {...form.getInputProps('email')}/>
                <TextInput
                    label='Username'
                    placeholder='FirstName.LastName'
                    {...form.getInputProps('username')}/>
                <PasswordInput
                    label='Password'
                    placeholder='Your password'
                    {...form.getInputProps('password')}/>
                <Radio.Group name="admin">
                    <div style={{display:'flex', justifyContent:'space-between', width:"100%", flexDirection:'row'}}>
                        <Radio value='false' onChange={() => {form.setValues({role:false})}} label={'User'}/>
                        <Radio value='true' onChange={() => {form.setValues({role:true})}} label={'Admin'}/>
                     </div>
                </Radio.Group>
                <Button variant="filled" type="submit">Log in</Button>
            </form>
        </div>
    )
}

export default RegisterForm;