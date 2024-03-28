import React, { useContext, useEffect, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { useNavigate } from "react-router-dom";
import { Button, NavLink } from "@mantine/core";
import { IconFingerprint, IconActivity, IconChevronRight} from '@tabler/icons-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ( { children } ) => {
    const {jwt, setJwt} = useContext(TimesheetContext);
    const navigate = useNavigate();
    const [pathname, setPathName] = useState('');

    useEffect(() => {
        setPathName(window.location.pathname);
    })

    const signOut = () => {
         setJwt('');
        navigate('/')
    };

    if (jwt !== '') {
        
        return(
            <div style={{display:'flex'}}>
                <div style={{display:'flex', flexDirection:'column', width:'256px', gap:'5px', height:'100vh'}}>
                    <NavLink href="#required-for-focus" active={pathname == '/account' ? true : false} label='Account' rightSection={<IconChevronRight size='2rem' stroke={1.5}/>} leftSection={<IconFingerprint size='2rem' stroke={1.5}/>} onClick={() => {navigate('/account')}}></NavLink>
                    <NavLink href="#required-for-focus" active={pathname == '/dashboard' ? true : false} label='Dashboard' rightSection={<IconChevronRight size='2rem' stroke={1.5}/>} leftSection={<IconActivity size='2rem' stroke={1.5}/>} onClick={() => {navigate('/dashboard')}}></NavLink>
                    <Button onClick={() => {signOut()}} color="red">Sign Out</Button>
                </div>
                <div style={{flexGrow:1, backgroundColor: 'gray'}}>
                 {children}
                </div>
            </div>
        )
    } else navigate('/');

}

export default Layout;