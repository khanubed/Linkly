import { createContext , useState, useContext , PropsWithChildren , useEffect} from "react";
import axios from 'axios'
import toast from 'react-hot-toast'


const backendURL = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendURL

type SubscriptionPlan = 'free' | 'pro' | 'business';
type Page = 'landing' | 'signup' | 'login' | 'dashboard' | 'admin';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: "active" | "inactive";
  linksCreated: number;
  totalClicks: number;
  isAdmin: boolean;
  status: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
  subscriptionExpiry ?: string;
}



export const AuthContext = createContext<any>(null);

export const AuthProvider = ({children} : PropsWithChildren) => {
          const [currentPage, setCurrentPage] = useState<Page>('landing');
          const [isAuthenticated, setIsAuthenticated] = useState(false);
          const [isAdmin, setIsAdmin] = useState(false);
          const [userData, setUserData] = useState<User | null>(null);
          const [token, setToken] = useState(localStorage.getItem("token"));

const authCheck = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return;

    const { data } = await axios.get("/api/auth/check", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.success) {
      setUserData(data.user);
      navigate('dashboard');
      setIsAdmin(data.user.isAdmin);
      setIsAuthenticated(true);
      if (data.user.isAdmin) {
        navigate('admin');
      } else {
        navigate('dashboard');
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};  

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const {data} = await axios.post("/api/auth/login" , {email : email, password:  password})
      if(data.success){
        setUserData(data.user)
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token)
        setIsAuthenticated(true);
        // console.log(data.user);

        localStorage.setItem("token" , data.token)
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    }catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }   

  };

  const handleSignup = async  (name: string, email: string, password: string) => {
    try {
      const {data} = await axios.post("/api/auth/signup" , {fullName : name , email, password})
      if(data.success){
              setToken(data.token)
              localStorage.setItem("token" , data.token)
              axios.defaults.headers.common["token"] = data.token;
              setUserData(data.user)
              setIsAuthenticated(true);
              navigate('dashboard');
              toast.success(data.message)
      }
      else{
              toast.error(data.message)
      }
    } catch (error) {
        if (error instanceof Error) {
                toast.error(error.message);
        }else{
                toast.error("Something went wrong")
        }
    }
  };


    const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserData(null);
        setToken(null)
    localStorage.removeItem("token");

    navigate('landing');
  };

  useEffect(() => {
    if (token != null) {
          axios.defaults.headers.common["token"] = token;
    }
    authCheck(); 
  }, [token])  
     

        const value = {axios , userData , handleLogin , handleSignup , handleLogout , authCheck , isAuthenticated , isAdmin , currentPage , navigate , setUserData , setIsAuthenticated , setIsAdmin};

        return (
                <AuthContext.Provider value={value}>
                        {children}
                </AuthContext.Provider>
        )

}