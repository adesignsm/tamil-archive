import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

import MODEL from "./assets/models/TamilArchive04.gltf";
import "./assets/scene.css";

/*
    Morning: time >= 5am and time <= 12pm
    afternoon: time >= 12pm and time <= 5pm
    Evening: time >= 5pm and time <= 9pm
    Night: time >= 9pm and time <= 4am
*/

const Scene = () => {
    const [time, setTime] = useState(0);
    const [dayState, setDayState] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            let hr = new Date().getHours();
            setTime(hr);

            let hours = parseInt(document.getElementById("time").innerHTML);
            
            if (hours >= 5 && hours < 12) {
                setDayState("MORNING");
            } else if (hours >= 12 &&  hours < 17) {
                setDayState("AFTERNOON");
            } else if (hours >= 17 && hours < 20) {
                setDayState("EVENING");
            } else {
                setDayState("NIGHT");
            }

            let partOfDay = document.getElementById("day-state").innerHTML;
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    const Model = () => {
        const obj = useGLTF(MODEL);

        return (
            <>
                <mesh scale={1} position={[-80, -30, 250]}>
                    <primitive object={obj.scene} />
                </mesh>
            </>
        )
    }

    return (
        <>
            <div>
                <Suspense>
                    <Canvas frameloop="always" camera={{fov: 75, near: 0.1, far: 100000, position: [0, 0, 100]}}>
                        <ambientLight intensity={0} />
                        <Model />
                        <Environment preset="sunset" />
                        <OrbitControls />
                    </Canvas>
                </Suspense>
                <p id="time">{time}</p>
                <p id="day-state">{dayState}</p>
            </div>
        </>
    )
}

export default Scene;