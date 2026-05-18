import { useGLTF, Center } from '@react-three/drei';

export function PhoneShell() {
    const { scene } = useGLTF('/models/iphone_air.glb');
    return (
        <Center>
            <primitive object={scene} scale={2} rotation={[Math.PI / 2, 0, 0]} />
        </Center>
    );
}
useGLTF.preload('/models/iphone_air.glb');
