/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";


const AccountPage = () => {
    const [opened, { open, close }] = useDisclosure(false);


    return(
        <div>
            <Modal opened={opened} onClose={close} title='NewEntry' centered>

</Modal>
<Button onClick={open}>New Entry</Button>
        </div>
    )
}

export default AccountPage;