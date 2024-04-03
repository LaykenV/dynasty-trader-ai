import React, { useContext, useEffect, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, NavLink } from "@mantine/core";
import { IconFingerprint, IconActivity, IconChevronRight} from '@tabler/icons-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ( { children } ) => {
    const {jwt, setJwt, admin} = useContext(TimesheetContext);
    const navigate = useNavigate();
    const [pathname, setPathName] = useState('');

    useEffect(() => {
        setPathName(window.location.pathname);
    })

    const signOut = () => {
         setJwt('');
        navigate('/')
    };

    if (jwt == '') {
        return <Navigate to='/' replace />
    }
        
        return(
            <div style={{display:'flex'}}>
                <div style={{display:'flex', flexDirection:'column', width:'256px', gap:'5px', height:'100vh', justifyContent:'space-between', paddingTop:'30px', paddingBottom:'50px', backgroundColor: 'lightgray'}}>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>Zyxware Timesheet App</div>
                    <div>
                        { admin ? <NavLink href="#required-for-focus" active={pathname == '/programs' ? true : false} label='Programs (Admin only)' rightSection={<IconChevronRight size='2rem' stroke={1.5}/>} leftSection={<IconFingerprint size='2rem' stroke={1.5}/>} onClick={() => {navigate('/programs')}}></NavLink> : null}
                        <NavLink href="#required-for-focus" active={pathname == '/account' ? true : false} label='Account' rightSection={<IconChevronRight size='2rem' stroke={1.5}/>} leftSection={<IconFingerprint size='2rem' stroke={1.5}/>} onClick={() => {navigate('/account')}}></NavLink>
                        <NavLink href="#required-for-focus" active={pathname == '/dashboard' ? true : false} label='Dashboard' rightSection={<IconChevronRight size='2rem' stroke={1.5}/>} leftSection={<IconActivity size='2rem' stroke={1.5}/>} onClick={() => {navigate('/dashboard')}}></NavLink>
                    </div>
                    <div></div>
                    <Button onClick={() => {signOut}} color="red">Sign Out</Button>
                </div>
                <div style={{flexGrow:1}}>
                 {children}
                </div>
            </div>
        )
    

}

export default Layout;