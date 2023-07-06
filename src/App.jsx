import React, { useState, useEffect } from "react";
import Scene from "./Scene";
import LoadingScreen from "./Loading";
import "./assets/main.css";

const App = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 20000);
    }, []);

    return (
        <>
            {isLoading === true ? <LoadingScreen /> : null}
            <Scene />
        </>
    )
}

export default App;