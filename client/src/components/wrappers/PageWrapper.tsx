import { motion } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { api, useValidateQuery } from "../../redux/api"
import store from "../../redux/store"

const defaultAnimationProps = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.5 }
}
interface PageWrapperProps {
    children: ReactNode,
    redirectIfAuth : boolean
    redirectPath : string
}
const PageWrapper = ({children, redirectIfAuth, redirectPath}: PageWrapperProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {isLoading, error} = useValidateQuery(undefined, {refetchOnMountOrArgChange: true});
    const [showPage, setShowPage] = useState(false);

    useEffect(() => {
        if (!isLoading) {
          if ((!error && redirectIfAuth) || (error && !redirectIfAuth)) {
            if (error) {
                store.dispatch(api.util.resetApiState());
            }
            navigate(redirectPath);
          }
          else {
            setShowPage(true);
          }
        }
    }, [isLoading, error, redirectIfAuth, redirectPath, navigate]);

    return( 
        <>
            {showPage ?     
                    (<motion.div {...defaultAnimationProps} key={location.pathname}>
                        <>{children}</>
                    </motion.div>)
                : <></>
           }
        </>   
    )
}

export default PageWrapper;