import React, { createContext, useContext, useState, useEffect } from "react";
import auth from "./fire_auth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUsername(user.displayName || "");
                setEmail(user.email || "");
            } else {
                setIsAuthenticated(false);
                setUsername("");
                setEmail("");
                setPassword("");
            }
        });
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUsername(userCredential.user.displayName || "");
            setEmail(userCredential.user.email || "");
        } catch (e) {
            console.error(e);
        }
    };

    const register = async (username, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: username });
            setUsername(username);
            setEmail(userCredential.user.email || "");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <AuthContext.Provider value={{ username, email, isAuthenticated, login, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export function isAuthenticatedCheck() {
    // This function is no longer needed as the authentication state is managed by the AuthProvider
    console.warn("isAuthenticatedCheck is deprecated. Use the AuthProvider and useAuth hook instead.");
}

export default function Authentication() {
    const { login, register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    return (
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
            {/* Login Form */}
            <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "5px" }}>
                <h2>Login</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        login(email, password);
                    }}
                >
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>

            {/* Register Form */}
            <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "5px" }}>
                <h2>Register</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        register(username, email, password);
                    }}
                >
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}