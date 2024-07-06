import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);


export const useAuth = () => {

    if(!AuthContext){
        throw new Error("the useAuth should be used within AuthProvider");
    }

    return useContext(AuthContext);
}


export const AuthProvider = ({children}) => {


    return (
        <AuthContext.Provider>
            {children}
        </AuthContext.Provider>
    )
}