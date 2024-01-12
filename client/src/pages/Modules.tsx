import { Grid, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import ModuleCard from "../components/cards/ModuleCard";
import { useGetAllModulesQuery } from "../redux/api";
import LoadingPage from "./LoadingPage";


const Modules = () => {
    const {data:modules, isLoading, error} = useGetAllModulesQuery();

    const mappedModules = useMemo(() => {
        return isLoading || error || !modules
            ? <LoadingPage />
            : <Grid spacing={2} container>
                {
                    modules.map((module) => (
                        <Grid item xs={3} key={module.ID} > 
                            <ModuleCard module={module} />
                        </Grid>
                    ))
                }
            </Grid>
    }, [modules, isLoading, error])
    
    return (    
        <Paper sx={{
            padding: "10px",
            margin: "20px",
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
        }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>Modules</Typography>
            {mappedModules}
            
        </Paper>
    )
}

export default Modules