import Box from "@mui/material/Box";
import { Ref, useEffect, useRef } from "react";
import * as THREE from "three";

const AnimatedCube = () => {
    const thisRef = useRef<HTMLElement>();
    useEffect(() => {
        console.log("test");
        const divElement = thisRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 500 / 200, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(500, 200);
        renderer.setAnimationLoop(animate);
        divElement?.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: "#90caf9" });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 2;

        function animate() {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        }
        return () => {
            // callback cleanup//////
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            divElement?.removeChild(renderer.domElement);
        };
    }, []);
    return <Box ref={thisRef} sx={{ height: "200px", width: "100%" }}></Box>;
};

export default AnimatedCube;
