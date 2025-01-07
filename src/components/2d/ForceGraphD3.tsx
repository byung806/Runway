import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import * as d3 from 'd3';

interface Node {
    x: number;
    y: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
    radius: number;
    id: number;
    degree: number;
}

interface Link {
    source: Node;
    target: Node;
    tickCounter: number;
}

const ForceGraphD3 = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const forceRef = useRef<d3.Simulation<Node, Link>>();
    const { width, height } = Dimensions.get('window');

    useEffect(() => {
        // Initialize nodes
        const initNodes = d3.range(91).map((val): Node => ({
            radius: Math.floor(Math.random() * 8) + 7,
            id: val,
            degree: 0,
            x: Math.random() * width,
            y: Math.random() * height
        }));
        // Root node (today card)
        const root = initNodes[0];
        // root.radius = 0;
        // root.fx = width / 2;
        // root.fy = height / 2;

        // Initialize links
        const initLinks: Link[] = [];
        for (let i = 1; i < initNodes.length; i++) {
            const source = initNodes[i];
            const target = initNodes[Math.floor(Math.random() * i)];
            initLinks.push({ source, target, tickCounter: 0 });
            source.degree++;
            target.degree++;
        }

        // Initialize force
        const sim = d3.forceSimulation<Node>(initNodes)
            .force('charge', d3.forceManyBody<Node>()
                .strength((d, i) => (i > 0 ? -30 : -30))
                .distanceMax((width + height) / 2))
            .force('link', d3.forceLink<Node, Link>([]).distance(69).strength(0.9))
            .force('x', d3.forceX(width / 2).strength(0.05))
            .force('y', d3.forceY(height / 2).strength(0.05))
            .on('tick', () => {
                setNodes([...initNodes]);
                setLinks(sim.force<d3.ForceLink<Node, Link>>('link')?.links() as Link[]);
            });

        forceRef.current = sim;
        setNodes(initNodes);
    }, [width, height]);

    // PanResponder to move the root node
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (nodes.length) {
                nodes[0].fx = gestureState.moveX;
                nodes[0].fy = gestureState.moveY;
                forceRef.current?.alpha(0.8).restart();
            }
        },
        onPanResponderRelease: () => {
            forceRef.current?.alpha(0.8).restart();
        }
    });

    return (
        <View {...panResponder.panHandlers}>
            <Svg width={width} height={height}>
                {links.map((link, i) => (
                    <Line
                        key={`link-${i}`}
                        x1={link.source.x}
                        y1={link.source.y}
                        x2={link.target.x}
                        y2={link.target.y}
                        stroke="#111"
                        strokeWidth={10}
                    />
                ))}
                {nodes.map((node) => (
                    <Circle
                        key={`node-${node.id}`}
                        cx={node.x}
                        cy={node.y}
                        r={node.radius}
                        fill={d3.schemeSet3[node.id % 12]}
                    />
                ))}
            </Svg>
        </View>
    );
};

export default ForceGraphD3;