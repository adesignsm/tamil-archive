import React, { useState, useEffect } from "react";
import Scene from "./Scene";
import LoadingScreen from "./Loading";
import "./assets/main.css";

const App = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 15000);
    }, []);

    return (
        <>
            {isLoading ? (<LoadingScreen />) : (<Scene />)}    
        </>
    )
}

export default App;