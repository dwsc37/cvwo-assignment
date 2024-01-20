import { Grid, Paper, Typography } from "@mui/material";
import ModuleCard from "../components/cards/ModuleCard";
import { useGetAllModulesQuery } from "../redux/api";
import LoadingPage from "./status/LoadingPage";
import ErrorPage from "./status/ErrorPage";

const Modules = () => {
    const { data: modules, isLoading, error } = useGetAllModulesQuery();
    if (isLoading) {
        return <LoadingPage />;
    }

    if (error || !modules) {
        return <ErrorPage />;
    }

    return (
        <Paper
            sx={{
                padding: "10px",
                margin: "20px",
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
                alignItems: "center",
            }}
        >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                Modules
            </Typography>
            {
                <Grid spacing={2} container>
                    {modules.map((module) => (
                        <Grid item xs={3} key={module.ID}>
                            <ModuleCard disableAction={false} module={module} />
                        </Grid>
                    ))}
                </Grid>
            }
        </Paper>
    );
};

export default Modules;
