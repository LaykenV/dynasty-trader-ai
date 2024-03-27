/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { Box, Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from '@mantine/form';
import { Link, useNavigate } from "react-router-dom";

export interface LoginObj {
    username: string,
    password: string
}

const LoginForm = () => {
    const {login} = useContext(TimesheetContext);
    const navigate = useNavigate();

    const loginWithFormValues = async (values:LoginObj) => {
        const isSuccess = await login(values);
        isSuccess ? navigate('/dashboard') : console.log('Login Failed: Invalid credentials.') // error banner;
    };

    const form = useForm({
        initialValues: {
            username: '',
            password: ''
        },

        validate: {
            username: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => value.length < 8 ? 'Password must be 8 characters long.' : null
        }
    });

    return(
        <div style={{height:'100%', width:'100%'}}>
            <form style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'space-around'}} onSubmit={form.onSubmit((values) => loginWithFormValues(values))}>
                <TextInput
                    label='Email'
                    placeholder='Your email address'
                    {...form.getInputProps('username')}/>
                <PasswordInput
                    label='Password'
                    placeholder='Your password'
                    {...form.getInputProps('password')}/>
                <Button variant="filled" type="submit">Log in</Button>
            </form>
        </div>
    )
}

export default LoginForm;