import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

 const TOKEN_PREFIX= 'Bearer ';
 const AUTH_USER_KEY = 'authenticatedUser';
 const TOKEN_KEY = 'token';
 const ROLE_KEY = 'role';
 const AUTH_ID_KEY = 'id';

export const userAPI = {
    upgrade: async(userStatusChange)=>{
        axiosInstance
        .patch("/users/{id}",userStatusChange)
        .then((res) => {
        const data = res.data;
        let token = TOKEN_PREFIX + data.token;
        setSessionStorage(data.id, data.email, token, data.role);
        return res;
        })
        .catch((err) => {
        console.log(err);
        toast.error("Error converting user to paid user. Please try again.")
        });
    }
};
