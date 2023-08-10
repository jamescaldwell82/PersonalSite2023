import React, {useContext, useState, useEffect, ReactNode} from 'react';
import {auth, db} from '../base';
import {doc, setDoc} from 'firebase/firestore';
import { GithubAuthProvider, signInWithPopup, UserCredential, signOut } from 'firebase/auth';

interface User {
    uid: string;
    email: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    currentUser: User | null | undefined;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}


const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth(){
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an authProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({children} : AuthProviderProps){
    const [currentUser, setCurrentUser] = useState<User | null | undefined>();
    const [loading, setLoading] = useState(true);
    
    async function login(){
        try{
            const provider = new GithubAuthProvider();
            provider.setCustomParameters({prompt: 'login'});
            const res : UserCredential = await signInWithPopup(auth, provider);
            authHandler(res);
        }        
        catch(error){
            console.error('Error during login: ', error);
        }
    }

    async function authHandler(authData: UserCredential){
        if(!authData.user){
            return;
        }
        setCurrentUser({
            uid: authData.user.uid,
            email: authData.user.email || '',
            photoURL: authData.user.photoURL || ''
        })

        await setDoc(doc(db, 'users', `${authData.user.uid}`), {
            uid: authData.user.uid,
            displayName: authData.user.displayName,
            email: authData.user.email,
            avatar: authData.user.photoURL,
            admin: authData.user.uid === process.env.REACT_APP_UID
         })
    }

    async function logout(){
        try{
            await signOut(auth);
            setCurrentUser(null);
        }
        catch (error) {
            console.error('Error during logout: ', error);
        }
    }

    const value: AuthContextType = {currentUser, login, logout };

    useEffect(() => {
        const authChange = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => authChange();
    }, [])

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}