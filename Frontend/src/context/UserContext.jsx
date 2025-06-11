import { useState, useEffect, createContext, useContext } from "react";
import axios from '../service/AxiosInstance';
import { toast } from 'react-toastify';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLogin, setIsLogin] = useState(false);
  const [isHaveAssistant, setIsHaveAssistant] = useState(false)

  const fetchUser = async () => {
      try {
        const res = await axios.get('/user/current');
        setUser(res.data.data);
        setIsHaveAssistant(res.data.data.virtualAssistantName ? true : false);
        setIsLogin(true);
        console.log(res.data.data);
      } catch (err) {
        console.log("Error in fetching user data");
        toast.error(err?.response?.data?.message || "Failed to fetch user data");
      }
    };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLogin, setIsLogin ,isHaveAssistant,setIsHaveAssistant,fetchUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
