import { Button, Card, CardActionArea, CardActions, CardContent, Typography } from "@mui/material";
import { Message, ModuleDetailed } from "../../interfaces/interaces";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSubscribeMutation, useUnsubscribeMutation } from "../../redux/api";
import toast from "react-hot-toast";

interface ModuleCardProps {
    module: ModuleDetailed
}
const ModuleCard = ({module} : ModuleCardProps) => {
    const [subscribed, updateSubscribed] = useState(module.IsSubscribed);
    const [hovering, updateHovering] = useState(false);
    const navigate = useNavigate();

    const [subscribe] = useSubscribeMutation(), [unsubscribe] = useUnsubscribeMutation();
    const handleSubscribe = () => {
        if (!subscribed) {
            const promise = subscribe(module.Code).unwrap();
            toast.promise(promise, {
                loading: "Subscribing...",
                success: (payload : Message) =>{
                    updateSubscribed(!subscribed);
                    updateHovering(false);
                    return payload.message;
                },
                error: (payload) =>{
                    try{
                        return payload.data.error;
                    }
                    catch{
                        return "Error, something went wrong!";
                    } 
                }, 
            });
        }  else {
            const promise = unsubscribe(module.Code).unwrap();
            toast.promise(promise, {
                loading: "Unsubscribing...",
                success: (payload : Message) =>{
                    updateSubscribed(!subscribed);
                     updateHovering(false);
                    return payload.message;
                },
                error: (payload) =>{
                    try{
                        return payload.data.error;
                    }
                    catch{
                        return "Error, something went wrong!";
                    } 
                }, 
            });
        }
    }
    
    return (
        <Card sx={{backgroundColor: "#9FA8DA"}}>
            <CardActionArea onClick={()=>{navigate(`/module/${module.Code}`)}}>
                
                    <CardContent>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>{module.Code}</Typography>
                        <Typography variant="h6">{module.Name}</Typography>
                        <Typography variant="h6" color="text.secondary">{module.UserCount+(module.UserCount===1?" member":" members")}</Typography>
                    </CardContent>
            </CardActionArea>
            <CardActions sx={{flexDirection:"row"}}>
                <Button sx={{width:"80px"}}variant="contained" onClick={handleSubscribe} onMouseEnter={()=>updateHovering(true)} onMouseLeave={()=>updateHovering(false)} 
                        color={subscribed ? hovering ? "warning" : "success" : "primary"}>
                    {subscribed ? hovering ? "Leave" : "Joined" : "Join"}
                </Button>
            </CardActions>
        </Card>
    )
}

export default ModuleCard;