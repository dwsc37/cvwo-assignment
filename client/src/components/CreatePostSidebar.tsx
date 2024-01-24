import { useState } from "react";
import { Module } from "../interfaces/interfaces";
import { useGetAllModulesQuery } from "../redux/api";
import CreateIcon from "@mui/icons-material/Create";
import {
    Autocomplete,
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreatePostSidebar = () => {
    const navigate = useNavigate();
    const { data: modules, isLoading, error } = useGetAllModulesQuery();
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);

    const handleModuleChange = (
        event: React.SyntheticEvent,
        value: Module | null
    ) => {
        setSelectedModule(value);
    };

    return (
        <Paper
            elevation={5}
            sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "row", gap: "3px" }}>
                <CreateIcon sx={{ marginTop: "3px" }} />
                <Typography variant="h5">Create post in module</Typography>
            </Box>

            <Autocomplete
                value={selectedModule}
                onChange={handleModuleChange}
                options={modules ? modules : []}
                getOptionLabel={(option) => option.Code + ": " + option.Name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search for a module"
                        variant="outlined"
                        fullWidth
                        sx={{ textOverflow: "ellipsis" }}
                    />
                )}
                ListboxProps={{
                    sx: {
                        "::-webkit-scrollbar": { width: "10px" },
                        "::-webkit-scrollbar-track": {
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "10px",
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: "#888",
                            borderRadius: "10px",
                        },
                        "::-webkit-scrollbar-thumb:hover": {
                            background: "#555",
                        },
                        scrollbarWidth: "thin",
                    },
                }}
            />
            <Button
                variant="contained"
                disabled={selectedModule === null}
                onClick={() =>
                    navigate("/module/" + selectedModule?.Code + "/create")
                }
            >
                Create Post
            </Button>
        </Paper>
    );
};

export default CreatePostSidebar;
