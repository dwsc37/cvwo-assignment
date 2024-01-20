import { Box } from "@mui/material";
import moment from "moment";
import { ReactNode } from "react";

export const calculateDuration = (date: Date) => {
    const duration = moment.duration(moment().diff(date));
    const days = duration.asDays();
    const hours = duration.asHours();
    const minutes = duration.asMinutes();

    if (days >= 1) {
        return `${Math.floor(days)} day` + (days >= 2 ? "s" : "");
    } else if (hours >= 1) {
        return `${Math.floor(hours)} hour` + (hours > 2 ? "s" : "");
    } else if (minutes >= 1) {
        return `${Math.floor(minutes)} minute` + (minutes >= 2 ? "s" : "");
    }
    return "less than a minute";
};

interface CardButtonProps {
    children: ReactNode;
}
export const CardButton = ({ children }: CardButtonProps) => {
    return (
        <Box
            sx={{ pointerEvents: "auto" }}
            onMouseDown={(event: React.MouseEvent) => event.stopPropagation()}
            onClick={(event: React.MouseEvent) => event.stopPropagation()}
        >
            {children}
        </Box>
    );
};
