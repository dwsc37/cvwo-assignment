import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Message, ModuleDetailed } from "../../interfaces/interfaces";
import { useSubscribeMutation, useUnsubscribeMutation } from "../../redux/api";
import { CardButton } from "../../util/helper";
interface ModuleCardProps {
    module: ModuleDetailed;
    disableAction: boolean;
}
const ModuleCard = ({ module, disableAction }: ModuleCardProps) => {
    const [subscribed, updateSubscribed] = useState(module.IsSubscribed);
    const [hovering, updateHovering] = useState(false);
    const navigate = useNavigate();

    const [subscribe] = useSubscribeMutation(),
        [unsubscribe] = useUnsubscribeMutation();
    const handleSubscribe = (event: React.MouseEvent) => {
        if (!subscribed) {
            const promise = subscribe(module.Code).unwrap();
            toast.promise(promise, {
                loading: "Subscribing...",
                success: (payload: Message) => {
                    updateSubscribed(!subscribed);
                    updateHovering(false);
                    return payload.message;
                },
                error: (payload) => {
                    try {
                        return payload.data.error;
                    } catch {
                        return "Error, something went wrong!";
                    }
                },
            });
        } else {
            const promise = unsubscribe(module.Code).unwrap();
            toast.promise(promise, {
                loading: "Unsubscribing...",
                success: (payload: Message) => {
                    updateSubscribed(!subscribed);
                    updateHovering(false);
                    return payload.message;
                },
                error: (payload) => {
                    try {
                        return payload.data.error;
                    } catch {
                        return "Error, something went wrong!";
                    }
                },
            });
        }
    };

    return (
        <Card
            elevation={5}
            sx={{
                pointerEvents: disableAction ? "none" : "auto",
                backgroundColor: "#9FA8DA",
            }}
        >
            <CardActionArea
                onClick={() => {
                    if (!disableAction) navigate(`/module/${module.Code}`);
                }}
            >
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {module.Code}
                    </Typography>
                    <Typography noWrap={!disableAction} variant="h6">
                        {module.Name}
                    </Typography>
                    <Typography color="text.secondary">
                        {module.UserCount +
                            (module.UserCount === 1 ? " member" : " members")}
                    </Typography>
                    <CardButton>
                        <Button
                            component="span"
                            fullWidth
                            variant="contained"
                            onClick={handleSubscribe}
                            onMouseEnter={() => updateHovering(true)}
                            onMouseLeave={() => updateHovering(false)}
                            color={
                                subscribed
                                    ? hovering
                                        ? "warning"
                                        : "success"
                                    : "primary"
                            }
                        >
                            {subscribed
                                ? hovering
                                    ? "Leave"
                                    : "Joined"
                                : "Join"}
                        </Button>
                    </CardButton>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ModuleCard;
