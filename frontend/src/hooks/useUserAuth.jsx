import {  useEffect ,useContext} from "react";
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance";


export const useUserAuth = () => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) return; // User is already authenticated

        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                if (isMounted) {
                    updateUser(response.data);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
                if (isMounted) {
                    clearUser();
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [ updateUser, clearUser, navigate]);
}

export default useUserAuth;