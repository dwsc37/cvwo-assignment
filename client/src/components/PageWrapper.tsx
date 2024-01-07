import { ReactNode, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useValidateQuery } from "../redux/api"
import LoadingPage from "../pages/LoadingPage"
import { AnimatePresence, motion } from "framer-motion"

const defaultAnimationProps = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
    transition: { duration: 0.3 }
}
interface PageWrapperProps {
    children: ReactNode,
    redirectIfAuth : boolean
    redirectPath : string
}
const PageWrapper = ({children, redirectIfAuth, redirectPath}: PageWrapperProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {isLoading, error} = useValidateQuery();
    
    const [showPage, setShowPage] = useState(false);
   
    useEffect(() => {
        if (!isLoading) {
          if ((!error && redirectIfAuth) || (error && !redirectIfAuth)) {
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
                (<AnimatePresence mode="wait">
                    <motion.div {...defaultAnimationProps} key={location.pathname}>
                        <>{children}</>
                    </motion.div>
                </AnimatePresence>
                ) : <LoadingPage />
           }
        </>   
    )
}

export default PageWrapper;