"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image as DreiImage } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/shopify/types";
import { imagesForColor } from "@/lib/shopify/images";

interface VortexSceneProps {
  products: Product[];
  onReady?: () => void;
  onError?: () => void;
}

interface ScrollState {
  target: number;
  current: number;
  velocity: number;
}

const PLANE_W = 1.08;
const PLANE_H = 1.44;
/** Wider gutters so ~5 columns read in the camera frustum instead of ~8–10. */
const COL_PITCH = PLANE_W * 1.48;
const ROW_PITCH = PLANE_H * 1.18;
/** Distance kept between the camera and the nearest wall of images. */
const WALL_DISTANCE = 6;

type GalleryShot = {
  src: string;
  alt: string;
  handle: string;
};

function imageKey(src: string) {
  return src.split("?")[0];
}

/** One tile per colourway so Agency Gray / Black / White are distinct shots. */
function shotsFromProducts(products: Product[]): GalleryShot[] {
  const shots: GalleryShot[] = [];
  const seen = new Set<string>();

  for (const product of products) {
    const colors =
      product.colors.length > 0 ? product.colors : (["Default"] as const);
    for (const color of colors) {
      const variantImage =
        product.variants.find((v) => v.color === color)?.image ?? null;
      const matched = imagesForColor(
        product.images,
        color,
        product.colors,
        variantImage
      );
      const img = matched[0] ?? product.images[0];
      if (!img?.src) continue;
      const key = imageKey(img.src);
      if (seen.has(key)) continue;
      seen.add(key);
      shots.push({
        src: img.src,
        alt: img.alt || `${product.title} ${color}`,
        handle: product.handle,
      });
    }
  }

  return shots;
}

function shuffleShots(shots: GalleryShot[]): GalleryShot[] {
  const a = [...shots];
  let seed = 19 * a.length + 7;
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function useWallLayout() {
  const { size } = useThree();
  const isNarrow = size.width < 768;
  const radius = isNarrow ? 4.6 : 5.8;
  /** Three rows ≈ 15 tiles in view (5 across × 3 down). */
  const rows = 3;
  const perRow = Math.max(8, Math.round((2 * Math.PI * radius) / COL_PITCH));
  return { radius, rows, perRow };
}

function CameraRig({ radius }: { radius: number }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.1, radius + WALL_DISTANCE);
    camera.lookAt(0, 0, 0);
  }, [camera, radius]);

  return null;
}

function CylinderWall({
  products,
  scroll,
}: {
  products: Product[];
  scroll: MutableRefObject<ScrollState>;
}) {
  const group = useRef<THREE.Group>(null);
  const router = useRouter();
  const { radius, rows, perRow } = useWallLayout();
  const shots = useMemo(
    () => shuffleShots(shotsFromProducts(products)),
    [products]
  );

  const planes = useMemo(() => {
    const items: {
      x: number;
      y: number;
      z: number;
      rotY: number;
      shot: GalleryShot;
      depth: number;
    }[] = [];

    if (!shots.length) return items;

    const n = shots.length;
    // Column-major index so the same column never repeats a shot vertically
    // (the old row*perRow stride was a multiple of catalog size → stripes).
    for (let row = 0; row < rows; row++) {
      for (let i = 0; i < perRow; i++) {
        const angle =
          ((i + (row % 2) * 0.5) / perRow) * Math.PI * 2 + row * 0.08;
        const shot = shots[(i * rows + row) % n];
        const jitter = Math.sin(row * 12.3 + i * 7.1) * 0.5 + 0.5;
        const r = radius + jitter * 0.22;

        items.push({
          x: Math.cos(angle) * r,
          y: (row - (rows - 1) / 2) * ROW_PITCH + (jitter - 0.5) * 0.06,
          z: Math.sin(angle) * r,
          rotY: Math.PI / 2 - angle,
          shot,
          depth: jitter,
        });
      }
    }
    return items;
  }, [shots, radius, rows, perRow]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const s = scroll.current;
    s.current = THREE.MathUtils.damp(s.current, s.target, 4.2, delta);
    s.velocity = THREE.MathUtils.damp(s.velocity, 0, 2.4, delta);
    group.current.rotation.y = s.current;
  });

  return (
    <>
      <CameraRig radius={radius} />
      <group ref={group}>
        {planes.map((p, i) => (
          <PlaneCard
            key={`${p.shot.src}-${i}`}
            x={p.x}
            y={p.y}
            z={p.z}
            rotY={p.rotY}
            shot={p.shot}
            onSelect={() => router.push(`/product/${p.shot.handle}`)}
          />
        ))}
      </group>
    </>
  );
}

function PlaneCard({
  x,
  y,
  z,
  rotY,
  shot,
  onSelect,
}: {
  x: number;
  y: number;
  z: number;
  rotY: number;
  shot: GalleryShot;
  onSelect: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ camera }) => {
    if (!ref.current) return;
    const world = new THREE.Vector3();
    ref.current.getWorldPosition(world);
    const dist = world.distanceTo(camera.position);
    const falloff = THREE.MathUtils.clamp(
      1 - (dist - WALL_DISTANCE) / 7.5,
      0.12,
      1
    );
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.transparent = true;
    mat.opacity = falloff * (hovered ? 1 : 0.9);

    const s = hovered ? 1.06 : 1;
    ref.current.scale.lerp(new THREE.Vector3(PLANE_W * s, PLANE_H * s, 1), 0.12);
  });

  return (
    <DreiImage
      ref={ref}
      url={shot.src}
      position={[x, y, z]}
      rotation={[0, rotY, 0]}
      scale={[PLANE_W, PLANE_H]}
      transparent
      toneMapped={false}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    />
  );
}

function ReadySignal({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(() => onReady?.(), 400);
    return () => window.clearTimeout(id);
  }, [onReady]);
  return null;
}

function InteractionBridge({
  scroll,
}: {
  scroll: MutableRefObject<ScrollState>;
}) {
  const dragging = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY + e.deltaX;
      scroll.current.target += delta * 0.0016;
      scroll.current.velocity = delta * 0.0004;
    };
    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      scroll.current.target += dx * 0.0045;
    };
    const onUp = () => {
      dragging.current = false;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [scroll]);

  useFrame((_, delta) => {
    if (Math.abs(scroll.current.velocity) < 0.0008) {
      scroll.current.target += delta * 0.05;
    }
  });

  return null;
}

export function VortexCanvas({ products, onReady, onError }: VortexSceneProps) {
  const scroll = useRef<ScrollState>({ target: 0, current: 0, velocity: 0 });

  return (
    <Canvas
      camera={{ position: [0, 0.1, 11.8], fov: 38, near: 0.1, far: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0 h-full w-full"
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", () => onError?.(), {
          once: true,
        });
      }}
    >
      <color attach="background" args={["#141110"]} />
      <fog attach="fog" args={["#141110", 9, 20]} />
      <ReadySignal onReady={onReady} />
      <Suspense fallback={null}>
        <CylinderWall products={products} scroll={scroll} />
        <InteractionBridge scroll={scroll} />
      </Suspense>
    </Canvas>
  );
}
