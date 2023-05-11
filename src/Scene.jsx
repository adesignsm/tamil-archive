import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useGLTF, OrthographicCamera } from "@react-three/drei";
import { PointerLockControls } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import MODEL from "./assets/models/TamilArchive02.gltf";
import "./assets/scene.css";

const Scene = () => {
    
    const Model = () => {
        const obj = useGLTF(MODEL);
        console.log(obj);

        return (
            <>
                <mesh scale={1} position={[-80, -50, -50]}>
                    <primitive object={obj.scene} />
                </mesh>
            </>
        )
    }

    return (
        <>
            <div>
                <Suspense>
                    <Canvas frameloop="always" camera={{fov: 75, near: 0.1, far: 10000, position: [0, 0, 100]}}>
                        <ambientLight intensity={1.25} />
                        <Model />
                        <Environment preset="sunset" />
                        <OrbitControls />
                        {/* <PointerLockControls selector="canvas" moveSpeed={100} delta={true} /> */}
                    </Canvas>
                </Suspense>
            </div>
        </>
    )
}

export default Scene;