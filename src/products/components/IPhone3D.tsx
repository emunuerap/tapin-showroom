import {
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

const PHONE_MODEL_PATH = '/models/iphone-16/iphone.glb';
const PHONE_TARGET_HEIGHT = 2.72;
const PHONE_SCREEN_MASK = `url("data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 697"><path fill="white" fill-rule="evenodd" d="M0 0H320V697H0V0ZM190 23m-5.4 0a5.4 5.4 0 1 0 10.8 0a5.4 5.4 0 1 0 -10.8 0Z"/></svg>',
)}")`;

const PHONE_SCREEN_MASK_STYLE = {
    WebkitMaskImage: PHONE_SCREEN_MASK,
    maskImage: PHONE_SCREEN_MASK,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
} as CSSProperties;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
type PassportView = 'today' | 'taste' | 'memory';

interface IPhone3DProps {
    active?: boolean;
}

export function IPhone3D({ active = false }: IPhone3DProps) {
    const [zoomed, setZoomed] = useState(false);
    const stageRef = useRef<HTMLDivElement>(null);
    const shellRef = useRef<HTMLDivElement>(null);
    const tilt = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });
    const drag = useRef({
        active: false,
        moved: false,
        startX: 0,
        startY: 0,
    });

    useEffect(() => {
        if (!stageRef.current) return;
        gsap.to(stageRef.current, {
            scale: zoomed ? 1.22 : 1,
            y: zoomed ? -10 : 0,
            duration: 0.95,
            ease: 'expo.out',
        });
    }, [zoomed]);

    useEffect(() => {
        let raf = 0;
        const render = () => {
            const shell = shellRef.current;
            const current = tilt.current;
            current.rx += (current.tx - current.rx) * 0.1;
            current.ry += (current.ty - current.ry) * 0.1;

            if (shell) {
                shell.style.transform = `rotateX(${current.rx}deg) rotateY(${current.ry}deg)`;
            }

            raf = window.requestAnimationFrame(render);
        };

        raf = window.requestAnimationFrame(render);
        return () => window.cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        if (zoomed) {
            tilt.current.tx = 0;
            tilt.current.ty = 0;
        }
    }, [zoomed]);

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (zoomed) return;
        drag.current = {
            active: true,
            moved: false,
            startX: event.clientX,
            startY: event.clientY,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!drag.current.active || zoomed) return;
        const dx = event.clientX - drag.current.startX;
        const dy = event.clientY - drag.current.startY;

        if (Math.abs(dx) + Math.abs(dy) > 8) {
            drag.current.moved = true;
        }

        tilt.current.ty = clamp(dx * 0.045, -9, 9);
        tilt.current.tx = clamp(-dy * 0.035, -5.5, 5.5);
    };

    const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!drag.current.active || zoomed) return;
        drag.current.active = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        if (!drag.current.moved) {
            setZoomed(true);
            return;
        }

        gsap.to(tilt.current, {
            tx: 0,
            ty: 0,
            duration: 1.1,
            ease: 'elastic.out(1, 0.45)',
        });
    };

    return (
        <div
            ref={stageRef}
            data-phone-stage
            className={`tapin-phone-stage relative h-full w-full overflow-visible [perspective:1400px] [&_canvas]:!h-full [&_canvas]:!w-full ${
                zoomed ? 'z-40' : 'z-10'
            }`}
            style={{ transformOrigin: '50% 52%' }}
            onClick={(event) => {
                if (!zoomed) return;
                if ((event.target as HTMLElement).closest('.tapin-phone-screen')) return;
                setZoomed(false);
            }}
        >
            <div
                ref={shellRef}
                className="relative h-full w-full overflow-visible will-change-transform [transform-style:preserve-3d]"
                style={{ transformOrigin: '50% 52%' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                <PhoneCanvas active={active} zoomed={zoomed} />
                <PhoneScreenLayer zoomed={zoomed} onCollapse={() => setZoomed(false)} />
            </div>
        </div>
    );
}

function PhoneScreenLayer({ zoomed, onCollapse }: { zoomed: boolean; onCollapse: () => void }) {
    const drag = useRef({ x: 0, y: 0, moved: false });

    return (
        <div
            data-phone-screen
            className={`tapin-phone-screen absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black shadow-[0_0_30px_rgba(204,255,0,0.06)] transition-[width,opacity,filter] duration-700 ${
                zoomed ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-95'
            }`}
            style={{
                ...PHONE_SCREEN_MASK_STYLE,
                aspectRatio: '320 / 697',
                width: zoomed ? 'min(23.52rem, 84.12%)' : 'min(22.29rem, 82.12%)',
                borderRadius: zoomed ? 49 : 47,
                top: zoomed ? '49.42%' : '49.47%',
            }}
            onPointerDown={(event) => {
                drag.current = { x: event.clientX, y: event.clientY, moved: false };
            }}
            onPointerMove={(event) => {
                if (Math.abs(event.clientX - drag.current.x) + Math.abs(event.clientY - drag.current.y) > 10) {
                    drag.current.moved = true;
                }
            }}
            onClick={(event) => {
                if (!zoomed || drag.current.moved) return;
                if ((event.target as HTMLElement).closest('.tapin-phone-scroll')) return;
                onCollapse();
            }}
        >
            <TapInPhoneApp />
        </div>
    );
}

function PhoneCanvas({
    active,
    zoomed,
}: {
    active: boolean;
    zoomed: boolean;
}) {
    return (
        <Canvas
            className="h-full w-full"
            shadows
            gl={{
                alpha: true,
                antialias: true,
                preserveDrawingBuffer: false,
                powerPreference: 'high-performance',
            }}
            dpr={[1, 1.85]}
            camera={{ position: [0, 0, zoomed ? 4.45 : 4.85], fov: zoomed ? 30 : 32 }}
            style={{ width: '100%', height: '100%', cursor: zoomed ? 'default' : 'pointer' }}
            onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.18;
            }}
        >
            <CameraChoreography zoomed={zoomed} />

            <ambientLight intensity={0.82} color="#f4f7f0" />
            <directionalLight position={[0, 4.5, 5]} intensity={2.2} color="#ffffff" />
            <directionalLight position={[-3.4, 1.4, 3.2]} intensity={1.65} color="#ccff00" />
            <directionalLight position={[4, 1.6, 2.8]} intensity={1.25} color="#dfe6e8" />
            <pointLight position={[0.45, 0.95, 1.65]} intensity={0.75} color="#ccff00" distance={4.5} />

            <Suspense fallback={null}>
                <PhoneRig active={active} zoomed={zoomed} />
                <Environment preset="city" environmentIntensity={0.9} />
            </Suspense>
        </Canvas>
    );
}

function CameraChoreography({ zoomed }: { zoomed: boolean }) {
    const target = useRef(new THREE.Vector3(0, 0, zoomed ? 4.45 : 4.85));

    useFrame((state, delta) => {
        if (!('fov' in state.camera)) return;
        const camera = state.camera as THREE.PerspectiveCamera;
        const ease = 1 - Math.exp(-delta * 4.8);
        target.current.set(0, zoomed ? 0.03 : 0, zoomed ? 4.45 : 4.85);
        camera.position.lerp(target.current, ease);
        camera.lookAt(0, zoomed ? 0.03 : 0, 0);
        camera.fov += ((zoomed ? 30 : 32) - camera.fov) * ease;
        camera.updateProjectionMatrix();
    });

    return null;
}

function PhoneRig({
    active,
    zoomed,
}: {
    active: boolean;
    zoomed: boolean;
}) {
    const group = useRef<THREE.Group>(null);
    const target = useRef({ rotY: 0, rotX: 0, rotZ: 0, scale: 1 });

    useFrame(() => {
        if (!group.current) return;
        const now = performance.now();

        if (zoomed) {
            target.current.rotY = 0;
            target.current.rotX = 0;
            target.current.rotZ = 0;
            target.current.scale = 1.02;
        } else {
            const sway = active ? 0.018 : 0.012;
            target.current.rotY = Math.sin(now * 0.00055) * sway;
            target.current.rotX = Math.sin(now * 0.0004) * sway * 0.42;
            target.current.rotZ = 0;
            target.current.scale = 1;
        }

        group.current.rotation.y += (target.current.rotY - group.current.rotation.y) * 0.1;
        group.current.rotation.x += (target.current.rotX - group.current.rotation.x) * 0.1;
        group.current.rotation.z += (target.current.rotZ - group.current.rotation.z) * 0.08;
        const nextScale = group.current.scale.x + (target.current.scale - group.current.scale.x) * 0.08;
        group.current.scale.setScalar(nextScale);
    });

    return (
        <group ref={group}>
            <PhoneShell />
        </group>
    );
}

function PhoneShell() {
    const { scene } = useGLTF(PHONE_MODEL_PATH);

    const phone = useMemo(() => {
        const clone = scene.clone(true);
        clone.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(clone);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        clone.position.sub(center);
        clone.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (!mesh.isMesh) return;

            if (isDisplayMesh(mesh)) {
                mesh.visible = true;
                mesh.castShadow = false;
                mesh.receiveShadow = false;
                mesh.material = createScreenBackingMaterial();
                return;
            }

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.material = Array.isArray(mesh.material)
                ? mesh.material.map((material) => polishPhoneMaterial(material))
                : polishPhoneMaterial(mesh.material);
        });

        const scale = PHONE_TARGET_HEIGHT / size.y;
        return {
            scene: clone,
            scale,
        };
    }, [scene]);

    return (
        <group>
            <group rotation={[0, Math.PI / 2, 0]}>
                <primitive object={phone.scene} scale={phone.scale} />
            </group>
        </group>
    );
}

function isDisplayMesh(mesh: THREE.Mesh) {
    const meshName = mesh.name.toLowerCase();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const materialNames = materials.map((material) => material?.name?.toLowerCase() ?? '').join(' ');
    return meshName.includes('screen') || materialNames.includes('screen') || materialNames.includes('display');
}

function createScreenBackingMaterial() {
    return new THREE.MeshPhysicalMaterial({
        color: '#020302',
        roughness: 0.42,
        metalness: 0,
        clearcoat: 0.35,
        clearcoatRoughness: 0.5,
        envMapIntensity: 0.2,
        depthWrite: true,
        depthTest: true,
        side: THREE.DoubleSide,
    });
}

function polishPhoneMaterial(material: THREE.Material) {
    const clone = material.clone();
    const standard = clone as THREE.MeshStandardMaterial;
    const name = clone.name.toLowerCase();

    if ('roughness' in standard) standard.roughness = Math.min(0.68, standard.roughness ?? 0.42);
    if ('metalness' in standard) standard.metalness = Math.max(0.12, standard.metalness ?? 0.22);
    if ('envMapIntensity' in standard) standard.envMapIntensity = 1.35;

    if ('color' in standard && standard.color) {
        if (name.includes('screen') || name.includes('black')) {
            standard.color.lerp(new THREE.Color('#030403'), 0.64);
        } else if (name.includes('metal') || name.includes('base')) {
            standard.color.lerp(new THREE.Color('#151814'), 0.38);
        } else if (name.includes('glass')) {
            standard.color.lerp(new THREE.Color('#050605'), 0.45);
        }
    }

    return clone;
}

function TapInPhoneApp() {
    const [time, setTime] = useState('9:41');
    const [activeView, setActiveView] = useState<PassportView>('today');

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
        };
        update();
        const timer = window.setInterval(update, 30_000);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, #050505 0%, #090a08 58%, #050505 100%)',
                color: '#f4f4f4',
                fontFamily: 'system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 24,
                backfaceVisibility: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: '17px 24px auto 28px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 10.5,
                    fontWeight: 650,
                    lineHeight: 1,
                    letterSpacing: -0.25,
                    color: '#f4f4f4',
                    zIndex: 5,
                    pointerEvents: 'none',
                    fontVariantNumeric: 'tabular-nums',
                }}
            >
                <span>{time}</span>
                <PhoneStatusCluster />
            </div>

            <div
                className="tapin-phone-scroll"
                style={{
                    position: 'absolute',
                    inset: '56px 0 0 0',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingBottom: 24,
                    scrollbarWidth: 'none',
                    pointerEvents: 'auto',
                }}
                onWheel={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
            >
                <PhoneHeader />
                <PassportIntro activeView={activeView} setActiveView={setActiveView} />
                {activeView === 'today' && <TodayPassport />}
                {activeView === 'taste' && <TastePassport />}
                {activeView === 'memory' && <MemoryPassport />}
            </div>
        </div>
    );
}

function PhoneStatusCluster() {
    return (
        <span
            aria-hidden="true"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4.2,
                color: '#f4f4f4',
                transform: 'translateY(-0.2px)',
            }}
        >
            <span
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1.2,
                    width: 12,
                    height: 9,
                }}
            >
                {[3.2, 4.8, 6.5, 8].map((height, index) => (
                    <span
                        key={height}
                        style={{
                            width: 2,
                            height,
                            borderRadius: 1,
                            background: index < 3 ? 'rgba(244,244,244,0.82)' : 'rgba(244,244,244,0.52)',
                        }}
                    />
                ))}
            </span>
            <span
                style={{
                    position: 'relative',
                    width: 11,
                    height: 8,
                    overflow: 'hidden',
                }}
            >
                <span
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 10,
                        borderTop: '1.5px solid rgba(244,244,244,0.84)',
                        borderRadius: '50% 50% 0 0',
                    }}
                />
                <span
                    style={{
                        position: 'absolute',
                        left: 2.4,
                        right: 2.4,
                        top: 3.2,
                        height: 6,
                        borderTop: '1.5px solid rgba(244,244,244,0.72)',
                        borderRadius: '50% 50% 0 0',
                    }}
                />
                <span
                    style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: 0.2,
                        width: 2.2,
                        height: 2.2,
                        borderRadius: 999,
                        background: 'rgba(244,244,244,0.86)',
                        transform: 'translateX(-50%)',
                    }}
                />
            </span>
            <span
                style={{
                    position: 'relative',
                    display: 'grid',
                    placeItems: 'center',
                    width: 18.5,
                    height: 9.6,
                    borderRadius: 5,
                    background: 'rgba(244,244,244,0.9)',
                    color: '#111',
                    fontSize: 5.8,
                    fontWeight: 800,
                    letterSpacing: -0.35,
                    boxShadow: '0 0 0 0.7px rgba(255,255,255,0.18), inset 0 -0.5px 0 rgba(0,0,0,0.16)',
                }}
            >
                80
                <span
                    style={{
                        position: 'absolute',
                        right: -1.9,
                        top: 2.9,
                        width: 1.6,
                        height: 3.8,
                        borderRadius: '0 1.5px 1.5px 0',
                        background: 'rgba(244,244,244,0.78)',
                    }}
                />
            </span>
        </span>
    );
}

function PhoneHeader() {
    return (
        <div style={{ padding: '14px 18px 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontSize: 20, letterSpacing: -0.5 }}>
                    TapIn<span style={{ color: '#ccff00' }}>·</span>
                </div>
                <div style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid rgba(204,255,0,0.45)', display: 'grid', placeItems: 'center', fontSize: 10, letterSpacing: 1, color: '#ccff00' }}>
                    E
                </div>
            </div>
            <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(204,255,0,0.72)', marginTop: 6 }}>
                Friday · May 14 · Tonight
            </div>
        </div>
    );
}

function PassportIntro({
    activeView,
    setActiveView,
}: {
    activeView: PassportView;
    setActiveView: (view: PassportView) => void;
}) {
    const views: Array<{ id: PassportView; label: string }> = [
        { id: 'today', label: 'Today' },
        { id: 'taste', label: 'Taste' },
        { id: 'memory', label: 'Memory' },
    ];

    return (
        <div style={{ margin: '6px 14px 0', padding: '11px 12px 12px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(135deg, rgba(204,255,0,0.055), rgba(255,255,255,0.018) 58%, rgba(0,0,0,0))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: 7.5, letterSpacing: 2.4, textTransform: 'uppercase', color: 'rgba(204,255,0,0.72)' }}>
                        Welcome to TapIn
                    </div>
                    <div style={{ marginTop: 3, maxWidth: 210, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 12, lineHeight: 1.25, color: 'rgba(255,255,255,0.86)' }}>
                        Your gastronomic passport is already arranging the night.
                    </div>
                </div>
                <div style={{ width: 7, height: 7, marginTop: 4, borderRadius: 999, background: '#ccff00', boxShadow: '0 0 18px rgba(204,255,0,0.65)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5, marginTop: 10 }}>
                {views.map((view) => {
                    const active = activeView === view.id;
                    return (
                        <button
                            key={view.id}
                            type="button"
                            onClick={() => setActiveView(view.id)}
                            style={{
                                minHeight: 26,
                                border: `1px solid ${active ? 'rgba(204,255,0,0.52)' : 'rgba(255,255,255,0.08)'}`,
                                borderRadius: 999,
                                background: active ? 'rgba(204,255,0,0.12)' : 'rgba(255,255,255,0.025)',
                                color: active ? '#ccff00' : 'rgba(255,255,255,0.52)',
                                fontSize: 7.5,
                                letterSpacing: 1.5,
                                textTransform: 'uppercase',
                                fontWeight: 700,
                            }}
                        >
                            {view.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function TodayPassport() {
    return (
        <>
            <ReservationCard />
            <PhoneSection title="Taste Genome" subtitle="128d vector · refreshed live">
                <TasteBars />
            </PhoneSection>
            <PhoneSection title="Flashbacks" subtitle="Your last visits remembered">
                <Flashbacks compact />
            </PhoneSection>
        </>
    );
}

function TastePassport() {
    return (
        <>
            <TasteHero />
            <PhoneSection title="Live Signals" subtitle="The profile updates as you dine">
                <TasteBars />
            </PhoneSection>
            <PhoneSection title="Preference Map" subtitle="What TapIn remembers without asking">
                <PreferenceChips />
            </PhoneSection>
        </>
    );
}

function MemoryPassport() {
    return (
        <>
            <PhoneSection title="Gratitude" subtitle="Messages from chefs you've met">
                <GratitudeMessage />
            </PhoneSection>
            <PhoneSection title="Wallet" subtitle="Upcoming · 4 reservations">
                <Wallet />
            </PhoneSection>
            <PhoneSection title="Flashbacks" subtitle="Your last visits remembered">
                <Flashbacks />
            </PhoneSection>
        </>
    );
}

function ReservationCard() {
    return (
        <div style={{ margin: '8px 14px 0', padding: 14, borderRadius: 14, border: '1px solid rgba(204,255,0,0.42)', background: 'linear-gradient(180deg, rgba(204,255,0,0.11), rgba(204,255,0,0.025))' }}>
            <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(204,255,0,0.9)' }}>Reservation confirmed</div>
            <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 30, letterSpacing: -0.7, lineHeight: 1, marginTop: 5 }}>8:30pm</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.86)', marginTop: 5 }}>Osteria Lumina</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>Table for 2 · Counter seat · Window</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                <Pill label="Modify" />
                <Pill label="Cancel" muted />
                <Pill label="Directions" />
            </div>
        </div>
    );
}

function Pill({ label, muted = false }: { label: string; muted?: boolean }) {
    return (
        <span style={{ fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', padding: '5px 9px', borderRadius: 999, border: `1px solid ${muted ? 'rgba(255,255,255,0.12)' : 'rgba(204,255,0,0.32)'}`, color: muted ? 'rgba(255,255,255,0.55)' : '#ccff00', background: 'rgba(255,255,255,0.02)' }}>
            {label}
        </span>
    );
}

function PhoneSection({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
    return (
        <div style={{ padding: '18px 18px 0' }}>
            <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 8, letterSpacing: 1, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{subtitle}</div>}
            <div style={{ marginTop: 8 }}>{children}</div>
        </div>
    );
}

function TasteBars() {
    const items = [
        ['Natural wine', 88],
        ['Counter seat', 72],
        ['Late dining', 64],
        ['Vegetable-first', 58],
        ['Italian', 94],
        ['Omakase', 68],
    ] as const;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {items.map(([label, value]) => (
                <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                        <span style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
                        <span style={{ color: 'rgba(204,255,0,0.85)', letterSpacing: 1 }}>{value}</span>
                    </div>
                    <div style={{ marginTop: 3, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${value}%`, background: 'linear-gradient(90deg, rgba(204,255,0,0.95), rgba(231,238,240,0.55))', borderRadius: 999 }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function TasteHero() {
    const rings = [
        ['Natural wine', 88],
        ['Quiet tables', 72],
        ['Late dining', 64],
    ] as const;

    return (
        <div style={{ margin: '10px 14px 0', padding: 16, borderRadius: 18, border: '1px solid rgba(204,255,0,0.24)', background: 'radial-gradient(circle at 50% 38%, rgba(204,255,0,0.12), rgba(204,255,0,0.035) 42%, rgba(0,0,0,0) 72%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div>
                    <div style={{ fontSize: 8, letterSpacing: 2.8, textTransform: 'uppercase', color: 'rgba(204,255,0,0.8)' }}>Taste Genome</div>
                    <div style={{ marginTop: 5, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 25, lineHeight: 0.95, color: '#fff' }}>
                        128d
                        <span style={{ display: 'block', color: '#ccff00' }}>live vector</span>
                    </div>
                </div>
                <div style={{ position: 'relative', width: 92, height: 92 }}>
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            style={{
                                position: 'absolute',
                                inset: 8 + i * 12,
                                borderRadius: '50%',
                                border: `1px solid rgba(204,255,0,${0.34 - i * 0.08})`,
                                boxShadow: i === 0 ? '0 0 24px rgba(204,255,0,0.14)' : undefined,
                            }}
                        />
                    ))}
                    <span style={{ position: 'absolute', left: 45, top: 8, width: 5, height: 5, borderRadius: 999, background: '#ccff00', boxShadow: '0 0 16px rgba(204,255,0,0.85)' }} />
                    <span style={{ position: 'absolute', right: 13, bottom: 24, width: 4, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.72)' }} />
                    <span style={{ position: 'absolute', left: 21, bottom: 14, width: 4, height: 4, borderRadius: 999, background: 'rgba(204,255,0,0.65)' }} />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 14 }}>
                {rings.map(([label, value]) => (
                    <div key={label} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', padding: '8px 7px', background: 'rgba(0,0,0,0.26)' }}>
                        <div style={{ color: '#ccff00', fontSize: 13, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>{value}</div>
                        <div style={{ marginTop: 2, fontSize: 7, letterSpacing: 1.1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PreferenceChips() {
    const chips = ['Chablis', 'Counter seat', 'Slow pace', 'No shellfish', 'Italian', 'Omakase'];
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {chips.map((chip, index) => (
                <span
                    key={chip}
                    style={{
                        padding: '7px 9px',
                        borderRadius: 999,
                        border: '1px solid rgba(204,255,0,0.18)',
                        background: index % 2 === 0 ? 'rgba(204,255,0,0.07)' : 'rgba(255,255,255,0.025)',
                        color: index % 2 === 0 ? 'rgba(204,255,0,0.9)' : 'rgba(255,255,255,0.72)',
                        fontSize: 8,
                        letterSpacing: 1.2,
                        textTransform: 'uppercase',
                    }}
                >
                    {chip}
                </span>
            ))}
        </div>
    );
}

function Flashbacks({ compact = false }: { compact?: boolean }) {
    const visits = [
        ['Visit 03', 'Osteria Lumina', 'You loved · Tomato carpaccio', '3 days ago'],
        ['Visit 02', 'Casa Marisol', 'You loved · Counter table', '12 days ago'],
        ['Visit 01', 'Sasso', 'You loved · Hand-cut pasta', '5 weeks ago'],
    ] as const;
    const visibleVisits = compact ? visits.slice(0, 2) : visits;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visibleVisits.map(([visit, venue, detail, time]) => (
                <div key={visit} style={{ borderLeft: '2px solid rgba(204,255,0,0.5)', paddingLeft: 9 }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(204,255,0,0.8)' }}>{visit} · {venue}</div>
                    <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 12, marginTop: 2 }}>{detail}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{time}</div>
                </div>
            ))}
        </div>
    );
}

function GratitudeMessage() {
    return (
        <div style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(204,255,0,0.14)', background: 'linear-gradient(180deg, rgba(204,255,0,0.055), rgba(0,0,0,0))' }}>
            <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(204,255,0,0.86)' }}>Chef Marco · Osteria Lumina</div>
            <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 12, lineHeight: 1.4, marginTop: 5, color: 'rgba(255,255,255,0.92)' }}>
                Welcome back. The tomatoes you loved are at their peak this week. We saved the counter spot.
            </div>
        </div>
    );
}

function Wallet() {
    const reservations = [
        ['Tonight', '8:30pm', 'Osteria Lumina'],
        ['Sat 16', '9:00pm', 'Casa Marisol'],
        ['Wed 21', '7:30pm', 'Sasso'],
        ['Fri 23', '10:00pm', 'Nakamura'],
    ] as const;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {reservations.map(([date, time, venue]) => (
                <div key={date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                        <div style={{ fontSize: 8, letterSpacing: 1.8, textTransform: 'uppercase', color: 'rgba(204,255,0,0.7)' }}>{date}</div>
                        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#fff' }}>{time}</div>
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', textAlign: 'right' }}>{venue}</div>
                </div>
            ))}
        </div>
    );
}

useGLTF.preload(PHONE_MODEL_PATH);
