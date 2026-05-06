'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Line } from '@react-three/drei';
import * as THREE from 'three';

// ─── Real Africa outline coordinates (simplified but accurate) ─── //
// Normalized to roughly -3 to 3 range for Three.js display
const AFRICA_OUTLINE: [number, number][] = [
    // Northwest - Morocco/Western Sahara
    [-1.8, 2.8], [-1.5, 2.9], [-0.8, 2.9], [-0.3, 2.7],
    // North - Tunisia/Libya
    [0.2, 2.8], [0.7, 2.6], [1.2, 2.5], [1.5, 2.4],
    // Northeast - Egypt
    [1.8, 2.3], [2.0, 2.0], [2.2, 1.6], [2.4, 1.2],
    // Horn of Africa
    [2.2, 0.8], [2.5, 0.5], [2.8, 0.2], [2.6, -0.1],
    // East Africa coast
    [2.3, -0.4], [2.4, -0.8], [2.3, -1.2], [2.2, -1.6],
    // Southeast - Mozambique/Madagascar
    [2.0, -2.0], [1.8, -2.3], [1.6, -2.5],
    // South Africa
    [1.3, -2.7], [0.8, -2.9], [0.3, -2.8],
    // Cape of Good Hope
    [0.0, -3.0], [-0.3, -2.9], [-0.5, -2.7],
    // Southwest coast
    [-0.6, -2.3], [-0.5, -1.8], [-0.6, -1.3],
    // West Africa - Gulf of Guinea
    [-0.5, -0.8], [-0.7, -0.3], [-1.0, 0.0],
    // West Africa bulge
    [-1.5, 0.3], [-2.0, 0.5], [-2.3, 0.8],
    [-2.5, 1.0], [-2.4, 1.3], [-2.2, 1.5],
    // Senegal/Mauritania
    [-2.5, 1.8], [-2.3, 2.0], [-2.0, 2.3], [-1.8, 2.5],
    // Close the loop
    [-1.8, 2.8],
];

// ─── Key African cities ─── //
interface City {
    name: string;
    pos: [number, number, number];
    color: string;
}

const CITIES: City[] = [
    { name: 'Johannesburg', pos: [0.6, -2.2, 0], color: '#F5C518' },
    { name: 'Lagos', pos: [-1.2, 0.4, 0], color: '#E91E63' },
    { name: 'Nairobi', pos: [2.0, -0.2, 0], color: '#F5C518' },
    { name: 'Cairo', pos: [1.8, 2.0, 0], color: '#E91E63' },
    { name: 'Cape Town', pos: [0.0, -2.9, 0], color: '#F5C518' },
    { name: 'Accra', pos: [-1.0, 0.1, 0], color: '#10B981' },
];

// ─── Connection routes between cities ─── //
const CONNECTIONS: [number, number][] = [
    [0, 1], // JHB → Lagos
    [0, 2], // JHB → Nairobi
    [1, 3], // Lagos → Cairo
    [2, 3], // Nairobi → Cairo
    [0, 4], // JHB → Cape Town
    [1, 5], // Lagos → Accra
];

function ContinentPoints() {
    const pointsRef = useRef<THREE.Points>(null!);

    const positions = useMemo(() => {
        const pts: number[] = [];
        const count = 2500;

        // Create a polygon path from Africa outline for hit-testing
        const isInsidePolygon = (px: number, py: number): boolean => {
            let inside = false;
            for (let i = 0, j = AFRICA_OUTLINE.length - 1; i < AFRICA_OUTLINE.length; j = i++) {
                const xi = AFRICA_OUTLINE[i][0], yi = AFRICA_OUTLINE[i][1];
                const xj = AFRICA_OUTLINE[j][0], yj = AFRICA_OUTLINE[j][1];
                const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        };

        // Generate points inside the Africa polygon
        let generated = 0;
        while (generated < count) {
            const x = (Math.random() - 0.5) * 6;
            const y = (Math.random() - 0.5) * 7;

            if (isInsidePolygon(x, y)) {
                const z = (Math.random() - 0.5) * 0.3;
                pts.push(x, y, z);
                generated++;
            }
        }

        return new Float32Array(pts);
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.y = Math.sin(t * 0.08) * 0.03;
            pointsRef.current.rotation.x = Math.cos(t * 0.06) * 0.02;
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#F5C518"
                size={0.04}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.7}
            />
        </Points>
    );
}

function CityNodes() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.03;
            groupRef.current.rotation.x = Math.cos(t * 0.06) * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {CITIES.map((city) => (
                <CityNode key={city.name} city={city} />
            ))}
        </group>
    );
}

function CityNode({ city }: { city: City }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const ringRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Pulse the city nodes
        if (meshRef.current) {
            const scale = 1 + Math.sin(t * 2 + city.pos[0]) * 0.3;
            meshRef.current.scale.setScalar(scale);
        }
        // Expand the rings
        if (ringRef.current) {
            const ringScale = 1 + Math.sin(t * 1.5 + city.pos[1]) * 0.5;
            ringRef.current.scale.setScalar(ringScale);
            (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 - Math.sin(t * 1.5 + city.pos[1]) * 0.15;
        }
    });

    return (
        <group position={city.pos}>
            {/* Core dot */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color={city.color} transparent opacity={0.9} />
            </mesh>
            {/* Pulse ring */}
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.1, 0.15, 32]} />
                <meshBasicMaterial color={city.color} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

function ConnectionLines() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.03;
            groupRef.current.rotation.x = Math.cos(t * 0.06) * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {CONNECTIONS.map(([from, to], i) => {
                const start = CITIES[from].pos;
                const end = CITIES[to].pos;
                // Create a slight arc
                const mid: [number, number, number] = [
                    (start[0] + end[0]) / 2,
                    (start[1] + end[1]) / 2,
                    0.5 + Math.random() * 0.3,
                ];

                const curve = new THREE.QuadraticBezierCurve3(
                    new THREE.Vector3(...start),
                    new THREE.Vector3(...mid),
                    new THREE.Vector3(...end),
                );
                const curvePoints = curve.getPoints(30);

                return (
                    <Line
                        key={`${from}-${to}`}
                        points={curvePoints}
                        color={i % 2 === 0 ? '#F5C518' : '#E91E63'}
                        lineWidth={1}
                        opacity={0.15}
                        transparent
                    />
                );
            })}
        </group>
    );
}

function OutlineWire() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.03;
            groupRef.current.rotation.x = Math.cos(t * 0.06) * 0.02;
        }
    });

    const outlinePoints = AFRICA_OUTLINE.map(([x, y]) => new THREE.Vector3(x, y, 0));

    return (
        <group ref={groupRef}>
            <Line
                points={outlinePoints}
                color="#F5C518"
                lineWidth={1.5}
                opacity={0.12}
                transparent
            />
        </group>
    );
}

export default function AfricaNeuralMap() {
    return (
        <div className="w-full h-[600px] relative">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <color attach="background" args={['#0A0F1C']} />
                <ambientLight intensity={0.3} />
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                    <OutlineWire />
                    <ContinentPoints />
                    <ConnectionLines />
                    <CityNodes />
                </Float>
            </Canvas>
            {/* Bottom fade to blend into page */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal pointer-events-none" />
            {/* Top fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-charcoal/50 pointer-events-none" />
        </div>
    );
}
