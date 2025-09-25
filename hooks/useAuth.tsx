import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { initialUsers } from '../data/mock-data';

const USERS_KEY = 'desparches_users';
const CURRENT_USER_KEY = 'desparches_currentUser';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    isPrimaryAdmin: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, pass: string) => Promise<User | null>;
    updateUser: (updatedUser: User) => Promise<void>;
    getAllUsers: () => Promise<User[]>;
    deleteUser: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    isPrimaryAdmin: false,
    login: async () => { throw new Error("Auth context not initialized"); },
    logout: async () => {},
    register: async () => null,
    updateUser: async () => {},
    getAllUsers: async () => [],
    deleteUser: async () => {},
});

const getMockUsers = (): User[] => {
    try {
        const usersJson = localStorage.getItem(USERS_KEY);
        if (usersJson) {
            return JSON.parse(usersJson);
        } else {
            // Seed with initial data if not present
            localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
            return initialUsers;
        }
    } catch (e) {
        console.error("Failed to load users from localStorage", e);
        return initialUsers;
    }
};

const saveMockUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        try {
            const currentUserJson = localStorage.getItem(CURRENT_USER_KEY);
            if (currentUserJson) {
                setUser(JSON.parse(currentUserJson));
            }
        } catch(e) {
            console.error("Failed to load current user", e);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, pass: string): Promise<void> => {
        // NOTE: Password is not checked in this mock implementation
        const users = getMockUsers();
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
        } else {
            throw new Error("User not found");
        }
    };
    
    const register = async (email: string, pass: string): Promise<User | null> => {
        const users = getMockUsers();
        if (users.some(u => u.email === email)) {
            throw new Error("Email already in use");
        }
        
        const newUser: User = {
            uid: `user_${Date.now()}`,
            email: email,
            displayName: email.split('@')[0] || 'Usuario',
            photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
            role: email === 'admin01@gmail.com' ? Role.ADMIN_PRIMARIO : Role.USUARIO,
            favoriteCategories: [],
        };
        
        const updatedUsers = [...users, newUser];
        saveMockUsers(updatedUsers);
        
        setUser(newUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

        return newUser;
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    };

    const updateUser = async (updatedUser: User) => {
        let users = getMockUsers();
        users = users.map(u => u.uid === updatedUser.uid ? updatedUser : u);
        saveMockUsers(users);
        
        if (user?.uid === updatedUser.uid) {
            setUser(updatedUser);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        }
    };
    
    const getAllUsers = async (): Promise<User[]> => {
        return getMockUsers();
    };

    const deleteUser = async (uid: string) => {
        let users = getMockUsers();
        users = users.filter(u => u.uid !== uid);
        saveMockUsers(users);
    };

    const isAdmin = user?.role === Role.ADMIN_PRIMARIO || user?.role === Role.ADMIN_SECUNDARIO;
    const isPrimaryAdmin = user?.role === Role.ADMIN_PRIMARIO;

    const value = {
        user,
        loading,
        isAdmin,
        isPrimaryAdmin,
        login,
        logout,
        register,
        updateUser,
        getAllUsers,
        deleteUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);