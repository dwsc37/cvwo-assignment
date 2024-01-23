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
        const modulePath = "/module/";
        const homePath = "/home";
        const allPath = "/all";
        const profilePath = "/profile/";
        // If the pathname starts with "/module/", extract everything until the next "/"
        const moduleIndex = pathname.indexOf(modulePath);
        if (moduleIndex !== -1) {
            const endIndex = pathname.indexOf(
                "/",
                moduleIndex + modulePath.length
            );
            return endIndex !== -1 ? pathname.substring(0, endIndex) : pathname;
        }
        const profileIndex = pathname.indexOf(profilePath);
        if (profileIndex !== -1) {
            const endIndex = pathname.indexOf(
                "/",
                profileIndex + profilePath.length
            );
            return endIndex !== -1 ? pathname.substring(0, endIndex) : pathname;
        }

        if (pathname.startsWith(homePath)) return homePath;
        if (pathname.startsWith(allPath)) return allPath;
        // If not a "/module/" or "/home" or "/all" path, use the full pathname as the key
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
