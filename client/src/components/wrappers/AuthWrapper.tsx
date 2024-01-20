import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, useValidateQuery } from "../../redux/api";
import store from "../../redux/store";

interface AuthWrapperProps {
    children: ReactNode;
    redirectIfAuth: boolean;
    redirectPath: string;
}
const AuthWrapper = ({
    children,
    redirectIfAuth,
    redirectPath,
}: AuthWrapperProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, error } = useValidateQuery(location.pathname);
    const [showPage, setShowPage] = useState(false);
    const deriveKey = (pathname: string) => {
        // If the pathname starts with "/module/", extract everything until the next "/"
        const modulePath = "/module/";
        const moduleIndex = pathname.indexOf(modulePath);
        if (moduleIndex !== -1) {
            const endIndex = pathname.indexOf(
                "/",
                moduleIndex + modulePath.length
            );
            return endIndex !== -1 ? pathname.substring(0, endIndex) : pathname;
        }

        // If not a "/module/" path, use the full pathname as the key
        return pathname;
    };

    const key = deriveKey(location.pathname);
    useEffect(() => {
        if (!isLoading) {
            if ((!error && redirectIfAuth) || (error && !redirectIfAuth)) {
                if (error) {
                    store.dispatch(api.util.resetApiState());
                }
                navigate(redirectPath);
            } else {
                setShowPage(true);
            }
        }
    }, [isLoading, error, redirectIfAuth, redirectPath, navigate]);

    return showPage ? <div key={key}>{children}</div> : <></>;
};

export default AuthWrapper;
