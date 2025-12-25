import { createContext , use, useEffect, useState} from "react";
import axios from "axios";
import { set } from "mongoose";
import { isDataView } from "util/types";
import { User } from "lucide-react";
import { data } from "react-router-dom";
import toast from "react-hot-toast";


export const AdminContext = createContext<any>(null);

export const AdminProvider = ({children}:any) => {

    // const [users, setUsers] = useState<any[]>();
    // 
    const userList: any[] = []

    const fetchUsersList = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(response.data.success) {
                // console.log(response.data.users);
                return response.data.users;
            }

            return [];

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const deleteUser = async (userId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const response = await axios.delete(`api/admin/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('User deleted successfully');
            return response.data.success;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    }    

    const toggleUserStatus  = async (userId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.put(`api/admin/user/${userId}/toggle`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            })

            if(!response.data.success) {
                toast.error('Failed to toggle user status');
                return;
            }

            toast.success('User status toggled successfully');
        } catch (error) {
            
        }
    }

    const fetchRevenue = async () => {
      const token = localStorage.getItem("token");

      const { data } = await axios.get("/api/admin/revenue", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    };



    const value : any = { userList , fetchUsersList  , deleteUser , toggleUserStatus  , fetchRevenue }; 

    return  (
        <AdminContext.Provider value = {value}>
            {children}
        </AdminContext.Provider>
    )
}
