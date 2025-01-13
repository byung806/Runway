import React, { useState, useEffect } from "react";
import { Pressable, Dimensions, GestureResponderEvent } from "react-native";
import Svg, { Line, Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
}
interface Edge {
    source: number;
    target: number;
}

function applyForces(nodes: Node[], edges: Edge[]) {
    const repulsion = 3000, attraction = 0.008, maxDistance = 200, maxAttraction = 0.01, maxRepulsion = 6;
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            let dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
            let distSq = dx * dx + dy * dy || 1;
            if (distSq < maxDistance * maxDistance) {
                let force = Math.min(repulsion / distSq, maxRepulsion);
                let fx = force * (dx / Math.sqrt(distSq));
                let fy = force * (dy / Math.sqrt(distSq));
                nodes[i].vx -= fx; nodes[i].vy -= fy;
                nodes[j].vx += fx; nodes[j].vy += fy;
            }
        }
    }
    for (let e of edges) {
        let s = nodes[e.source], t = nodes[e.target];
        if (!s || !t) continue;
        let dx = t.x - s.x, dy = t.y - s.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        let force = Math.min(attraction * dist, maxAttraction);
        let fx = force * (dx / dist);
        let fy = force * (dy / dist);
        s.vx += fx; s.vy += fy;
        t.vx -= fx; t.vy -= fy;
    }
    for (let node of nodes) {
        node.x += node.vx; node.y += node.vy;
        node.vx *= 0.9; node.vy *= 0.9;
    }
}

export function ForceGraph() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setNodes(prev => {
                const updated = [...prev];
                applyForces(updated, edges);
                return updated;
            });
        }, 50);
        return () => clearInterval(timer);
    }, [edges]);

    function addNodeAt(x: number, y: number) {
        setNodes(prev => [...prev, { x, y, vx: 0, vy: 0 }]);
        if (nodes.length > 0) {
            setEdges(prev => [
                ...prev,
                ...nodes.map((_, i) => ({ source: i, target: nodes.length }))
            ]);
        }
    }

    function handlePress(e: GestureResponderEvent) {
        const x = e.nativeEvent.pageX;
        const y = e.nativeEvent.pageY;
        addNodeAt(x, y);
    }

    return (
        <Pressable style={{ flex: 1 }} onPress={handlePress}>
            <Svg style={{ width: "100%", height: "100%" }}>
                {edges.map((e, i) => {
                    const s = nodes[e.source], t = nodes[e.target];
                    if (!s || !t) return null;
                    return (
                        <Line
                            key={i}
                            x1={s.x}
                            y1={s.y}
                            x2={t.x}
                            y2={t.y}
                            stroke="gray"
                            strokeWidth={2}
                        />
                    );
                })}
                {nodes.map((n, i) => (
                    <Circle
                        key={i}
                        cx={n.x}
                        cy={n.y}
                        r={10}
                        fill="blue"
                    />
                ))}
            </Svg>
        </Pressable>
    );
}
