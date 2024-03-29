// context.ts
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
interface UserContextType {
  userInfo: UserInfo | null;
  logout: () => void;
}

const UserInfoContext = createContext<UserContextType | null>(null);
interface UserInfoProviderProps {
  children: React.ReactNode;
}

export const UserInfoProvider: React.FC<UserInfoProviderProps> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
  };
  const fetchUserInfo = async () => {
    const API_BASE_URL =
      process.env.NODE_ENV === "production" ? `` : "http://localhost:5000";
    let data = JSON.parse(localStorage.getItem("userInfo") || "null");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/userInfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        data = await response.json();
        setUserInfo(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <UserInfoContext.Provider value={{ userInfo, logout }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserInfoContext);

  return context;
};
