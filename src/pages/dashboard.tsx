/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";

const Dashboard = () => {
    const {jwt, userId, getEntries, getPrograms, programs, entries} = useContext(TimesheetContext);

    useEffect(() => {
        console.log(jwt);
        async function getData() {
            await getPrograms();
            await getEntries();
        }
        getData();
    }, [])

    return(
        <div>
            Dashboard 
        </div>
    )
}

export default Dashboard;