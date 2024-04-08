import React, { useContext, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { ScrollArea, Modal, Button, TextInput, Grid, Group, Notification } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Program } from "./dashboard";
import { IconCheck, IconX } from "@tabler/icons-react";

export interface NewProgram {
  name: string;
  description: string;
}

const Programs = () => {
  const { admin, programs, updateProgram, deleteProgram, createProgram } = useContext(TimesheetContext);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    color: 'teal', // default for success
});

  const editForm = useForm({
    initialValues: {
      name: "",
      description: "",
    },
  });

  const createForm = useForm({
    initialValues: {
      name: "",
      description: "",
    },
  });

  const handleEditSubmit = async (values: NewProgram) => {
    try {
      if (selectedProgram) {
        await updateProgram(values, selectedProgram.programId);
        setEditModalOpen(false);
        editForm.reset();
        setNotification({ show: true, message: 'Program updated successfully!', color: 'teal' });
      }
    } catch (error) {
      console.log(error);
      setNotification({ show: true, message: 'Error updating Program.', color: 'red'});
    }
    
  };

  const handleCreateSubmit = async(values: NewProgram) => {
    try {
      await createProgram(values);
      setCreateModalOpen(false);
      createForm.reset();
      setNotification({ show: true, message: 'Program created successfully!', color: 'teal' });
    } catch (error) {
      console.log(error);
      setNotification({ show: true, message: 'Error creating Program.', color: 'red'});
    }
    
  };

  const handleDelete = () => {
    try {
      if (selectedProgram) {
        deleteProgram(selectedProgram.programId);
        setDeleteModalOpen(false);
        setNotification({ show: true, message: 'Program deleted successfully!', color: 'teal'});
      }
    } catch (error) {
      console.log(error);
      setNotification({ show: true, message: 'Error deleting Program.', color: 'red'});
    }
    
  };

  if (admin) {
    return (
      <div style={{display:'flex', flexDirection:'column', height:'100%', width:'100%', justifyContent:'flex-start', alignItems:'center', gap:'50px'}}>
        {notification.show && (
                    <div style={{position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: 'auto', maxWidth: '90%'}}>
                        <Notification 
                            icon={notification.color === 'teal' ? <IconCheck size={18} /> : <IconX size={18} />} 
                            color={notification.color} 
                            title={notification.color === 'teal' ? "Success" : "Error"}
                            onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
                        >
                            {notification.message}
                        </Notification>
                    </div>
            )}
        <h1>Programs</h1>
        <ScrollArea style={{ height: 300, width: 750, borderRadius: 10, padding: 10, backgroundColor:'white', color: 'black'}}  scrollbars='y' type="always">
          {programs.map((program) => (
            <Grid key={program.name} my="sm" align="center">
              <Grid.Col span={3}>{program.name}</Grid.Col>
              <Grid.Col span={6}>{program.description}</Grid.Col>
              <Grid.Col span={3}>
                <Group justify="flex-start">
                  <Button
                    onClick={() => {
                      setSelectedProgram(program);
                      setEditModalOpen(true);
                      editForm.setValues(program);
                    }}
                  >
                    Edit
                  </Button>
                  <Button color="red" onClick={() => {
                      setSelectedProgram(program);
                      setDeleteModalOpen(true);
                  }}>
                    Delete
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          ))}
        </ScrollArea>

        <Button my="md" onClick={() => setCreateModalOpen(true)}>
          Create New Program
        </Button>

        <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Program" centered={true}>
          <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
            <TextInput label="Name" required {...editForm.getInputProps("name")} />
            <TextInput label="Description" required {...editForm.getInputProps("description")} />
            <Button type="submit" mt="md">
              Update
            </Button>
          </form>
        </Modal>

        <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title='Are you sure you want to delete this program?' centered={true}>
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'25px'}}>
            <Button onClick={() => handleDelete()} color="red">Delete {selectedProgram?.name}</Button>
          </div>
        </Modal>

        <Modal opened={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Program" centered={true}>
          <form onSubmit={createForm.onSubmit(handleCreateSubmit)}>
            <TextInput label="Name" required {...createForm.getInputProps("name")} />
            <TextInput label="Description" required {...createForm.getInputProps("description")} />
            <Button type="submit" mt="md">
              Create
            </Button>
          </form>
        </Modal>
      </div>
    );
  }

  return <div>not admin</div>;
};

export default Programs;