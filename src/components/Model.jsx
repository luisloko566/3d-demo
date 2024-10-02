import { useGLTF, Text, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef } from "react";

export function Model() {
  const { nodes } = useGLTF("/torus.glb");
  const { viewport } = useThree();
  const mesh = useRef();

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const cursor = {};
  cursor.x = 0;
  cursor.y = 0;

  window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
  });

  useFrame((state, delta) => {
    mesh.current.rotation.x += 0.02;
    mesh.current.rotation.y += 0.005;

    const parallaxX = -cursor.x * 0.5;
    const parallaxY = cursor.y * 0.5;

    state.camera.position.x +=
      (parallaxX - state.camera.position.x) * 5 * delta;
    state.camera.position.y +=
      (parallaxY - state.camera.position.y) * 5 * delta;
  });

  const materialProps = useControls({
    thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1 },
    backside: { value: true },
  });

  return (
    <group scale={viewport.width / 5}>
      <Text fontSize={0.6} font="Wosker Demo.otf" position={[0, 0, -0.5]}>
        hello world!
      </Text>
      <mesh ref={mesh} {...nodes.Torus001} position={[0, 0, 0]}>
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </group>
  );
}
