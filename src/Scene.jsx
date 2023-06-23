import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PointerLockControls, useGLTF, useVideoTexture } from "@react-three/drei";
import { Bloom, Noise, Vignette, EffectComposer } from '@react-three/postprocessing'
import * as THREE from "three";

// import MODEL from "./assets/models/TamilArchive05-embedded.gltf";
import MODEL from "./assets/models/TamilArchive_Final.glb";
import EAST_VIDEO from "./assets/media/East_Animation_lowReso.mp4";
import WEST_VIDEO from "./assets/media/West_Animation_LowReso.mp4";
import SOUTH_VIDEO from "./assets/media/South_Animation_LowReso.mp4";
import "./assets/scene.css";

const Scene = () => {
    const [time, setTime] = useState(0);
    const [dayState, setDayState] = useState("");
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);
    const controlsRef = useRef();
    let frameId = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            let hr = new Date().getHours();
            setTime(hr);

            if (hr >= 5 && hr < 12) {
                setDayState("MORNING");
            } else if (hr >= 12 && hr < 17) {
                setDayState("AFTERNOON");
            } else if (hr >= 17 && hr < 20) {
                setDayState("EVENING");
            } else {
                setDayState("NIGHT");
            }
        }, 1000);

        return () => {
        clearInterval(interval);
        };
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === "w" || event.key === "W") moveForward.current = true;
        if (event.key === "a" || event.key === "A") moveLeft.current = true;
        if (event.key === "s" || event.key === "S") moveBackward.current = true;
        if (event.key === "d" || event.key === "D") moveRight.current = true;
    };

    const handleKeyUp = (event) => {
        if (event.key === "w" || event.key === "W") moveForward.current = false;
        if (event.key === "a" || event.key === "A") moveLeft.current = false;
        if (event.key === "s" || event.key === "S") moveBackward.current = false;
        if (event.key === "d" || event.key === "D") moveRight.current = false;
    };

useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
    }
}, []);

useEffect(() => {
    const handleMovement = () => {
        const velocity = new THREE.Vector3();
        const direction = new THREE.Vector3();
        const rotation = new THREE.Euler(0, 0, 0, "YXZ");
        const clock = new THREE.Clock();
      
        return function updateMovement() {
            const moveSpeed = 20;
            const maxPosX = 30; // Maximum allowed X position
            const minPosX = -40; // Minimum allowed X position
            const maxPosZ = 200; // Maximum allowed Z position
            const minPosZ = -190; // Minimum allowed Z position
      
            if (controlsRef.current) {
                rotation.set(controlsRef.current.getObject().rotation.x,controlsRef.current.getObject().rotation.y,0);
      
                direction.z = Number(moveBackward.current) - Number(moveForward.current);
                direction.x = Number(moveRight.current) - Number(moveLeft.current);
                direction.y = 0; // Set Y direction to 0 to restrict vertical movement
                direction.normalize();
      
                // Apply camera rotation to the direction vector
                direction.applyEuler(controlsRef.current.getObject().rotation);
      
                // Update camera position
                if (moveForward.current || moveBackward.current || moveLeft.current || moveRight.current) {
                    velocity.copy(direction).multiplyScalar(moveSpeed);
      
                    const elapsedTime = clock.getElapsedTime();
                    const bobbingOffset = Math.sin(elapsedTime * 15) * 0.2; // Adjust the bobbing amount
      
                    const currentPosition = controlsRef.current.getObject().position;
                    const newPositionX = THREE.MathUtils.clamp(currentPosition.x + velocity.x * 0.1,minPosX,maxPosX);
                    const newPositionZ = THREE.MathUtils.clamp(
                    currentPosition.z + velocity.z * 0.1,minPosZ,maxPosZ);
                    controlsRef.current.getObject().position.set(newPositionX,currentPosition.y + bobbingOffset,newPositionZ);

                    console.log(rotation);

                    if (currentPosition.x == 30 && currentPosition.z == -190) {
                        console.log("hit");
                    }
                }
            }
        };
    };
      
      
    const updateMovement = handleMovement();
    frameId.current = requestAnimationFrame(animate);

    function animate() {
        updateMovement();
        frameId.current = requestAnimationFrame(animate);
    }

    return () => {
        cancelAnimationFrame(frameId.current);
    };
}, []);
  

    const Model = () => {
        const { scene } = useGLTF(MODEL);

        return (
            <mesh scale={1} position={[-80, -30, 250]}>
                <primitive object={scene} />
            </mesh>
        );
    };

    const VideoPlane = ({ videoSource, xPos, yPos, zPos, yRot }) => {
        const texture = useVideoTexture(videoSource);
        return (
            <mesh scale={1} position={[xPos, yPos, zPos]} rotation={[0, yRot, 0]}>
                <planeBufferGeometry args={[140, 80]} />
                <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
        );
    };

    const DayTime = () => {
        return (
            <>
                <ambientLight intensity={0.3} />
                <directionalLight position={[0, 10, 10]} intensity={0.1} />
                <pointLight position={[0, 20, 10]} intensity={1} color={"#ff69b4"} />
            </>
        )
    }

    const EveningTime = () => {
        return (
            <>
                <ambientLight intensity={0.2} />
                <directionalLight position={[0, 10, 10]} intensity={0.05} />
                <pointLight position={[0, 20, 10]} intensity={0.8} color={"#ff8c69"} />
            </>
        );
    };

    return (
        <div>
            <Suspense>
                <Canvas frameloop="always" camera={{ fov: 10, near: 0.1, far: 100000, position: [0, 15, 100] }}>
                    {dayState === "MORNING" || dayState === "AFTERNOON" ? <DayTime /> : <EveningTime />}

                    <Model />

                    <VideoPlane videoSource={SOUTH_VIDEO} xPos={-8} yPos={8} zPos={-235} yRot={0} />
                    <VideoPlane videoSource={EAST_VIDEO} xPos={-80} yPos={16} zPos={-25} yRot={1.6} />
                    <VideoPlane videoSource={WEST_VIDEO} xPos={65} yPos={16} zPos={-40} yRot={-1.6} />
            
                    <PointerLockControls ref={controlsRef}/>

                    <EffectComposer>
                        <Bloom luminanceThreshold={0} luminanceSmoothing={0.5} height={window.innerHeight} />
                        <Noise opacity={0.2} />
                        <Vignette eskil={true} offset={1.5} darkness={0.2} />
                    </EffectComposer>
                </Canvas>
            </Suspense>
        </div>
    );
};

export default Scene;

/**
 

 */