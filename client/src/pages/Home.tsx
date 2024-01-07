import { Link } from "react-router-dom"
import { useLogoutMutation } from "../redux/api";
import toast from "react-hot-toast";
import { Message } from "../interfaces/interaces";

const Home = () => {
    const [logout] = useLogoutMutation();
    const handleLogout = (event: React.MouseEvent) => {
        event.preventDefault();
        
        const promise = logout().unwrap();
        toast.promise(promise, {
            loading: "Logging out...",
            success: (payload : Message) =>{
                return payload.message;
            },
            error: (payload) =>{
                try{
                    return payload.data.error;
                }
                catch{
                    return "Error";
                } 
            }, 
        });
    }
    return (    
        <div>
            <Link to="/login" onClick={handleLogout}>Logout </Link>
        </div>
    )
}

export default Home;