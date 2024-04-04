import React, { useContext, useState } from "react";
import { TimesheetContext } from "../context/timesheetContext";
import { ScrollArea, Modal, Button, TextInput, Grid, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Program } from "./dashboard";

export interface NewProgram {
  name: string;
  description: string;
}

const Programs = () => {
  const { admin, programs, getPrograms, updateProgram, deleteProgram, createProgram } = useContext(TimesheetContext);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

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

  const handleEditSubmit = (values: NewProgram) => {
    if (selectedProgram) {
      updateProgram(values, selectedProgram.programId);
      setEditModalOpen(false);
      editForm.reset();
    }
  };

  const handleCreateSubmit = (values: NewProgram) => {
    createProgram(values);
    setCreateModalOpen(false);
    createForm.reset();
    getPrograms();
  };

  if (admin) {
    return (
      <Box>
        <ScrollArea style={{ height: 300 }}>
          {programs.map((program) => (
            <Grid key={program.name} my="md" align="center">
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
                  <Button color="red" onClick={() => deleteProgram(program.programId)}>
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

        <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Program">
          <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
            <TextInput label="Name" required {...editForm.getInputProps("name")} />
            <TextInput label="Description" required {...editForm.getInputProps("description")} />
            <Button type="submit" mt="md">
              Update
            </Button>
          </form>
        </Modal>

        <Modal opened={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Program">
          <form onSubmit={createForm.onSubmit(handleCreateSubmit)}>
            <TextInput label="Name" required {...createForm.getInputProps("name")} />
            <TextInput label="Description" required {...createForm.getInputProps("description")} />
            <Button type="submit" mt="md">
              Create
            </Button>
          </form>
        </Modal>
      </Box>
    );
  }

  return <div>not admin</div>;
};

export default Programs;