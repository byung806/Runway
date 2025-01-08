// check slack

// X any-component zoomer
// https://github.com/Glazzes/react-native-zoom-toolkit/

// View zoomers
// https://www.npmjs.com/package/@openspacelabs/react-native-zoomable-view

// svg zoomer
// X https://github.com/garblovians/react-native-svg-pan-zoom

// X Is there any way to implement d3 svg-like zoom behavior, but without DOM mutation. For example, using some d3 pure functions with just x and y values as input.
// https://stackoverflow.com/questions/46955024/d3-zoom-behavior-in-react-native

// idea: convert everything to three and use three's camera controls and find force graph library that works with three
// https://codesandbox.io/s/react-three-fiber-react-spring-svg-parallax-55tzr

// inertia: on pan responder release


import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';
import * as d3 from 'd3';
import { GestureEvent, PanGestureHandler, PanGestureHandlerEventPayload, State } from 'react-native-gesture-handler';

interface Node {
    x: number;
    y: number;
    vx?: number;
    vy?: number;
    fx?: number | null;  // forced x
    fy?: number | null;  // forced y
    radius: number;
    id: number;
    degree: number;  // number of edges
}

interface Edge {
    source: Node;
    target: Node;
}

const ForceGraphD3 = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Edge[]>([]);
    const forceRef = useRef<d3.Simulation<Node, Edge>>();
    const { width, height } = Dimensions.get('window');
    const minScreenDim = useMemo(() => Math.min(width, height), [width, height]);

    const prevTransformRef = useRef({ x: 0, y: 0, scale: 1 });  // Previous transform state
    const transformRef = useRef({ x: 0, y: 0, scale: 1 });  // Transform state (ref used so that it doesn't trigger re-render)
    const svgGroupRef = useRef<G<any>>(null);  // Reference to the G element

    useEffect(() => {
        // Initialize nodes
        const initNodes = d3.range(80).map((val): Node => ({
            radius: Math.floor(Math.random() * 8) + 7,
            id: val,
            degree: 0,
            x: Math.random() * width,
            y: Math.random() * height
        }));
        // Root node (today card)
        const root = initNodes[0];
        root.radius = 100;

        // Initialize links
        const initLinks: Edge[] = [];
        for (let i = 1; i < initNodes.length; i++) {
            const source = initNodes[i];
            const target = initNodes[Math.floor(Math.random() * (i - 1)) + 1];
            initLinks.push({ source, target });
            source.degree++;
            target.degree++;
        }

        // Initialize force
        const sim = d3.forceSimulation<Node>(initNodes)
            .force('charge', d3.forceManyBody<Node>()
                .strength((d, i) => (i > 0 ? -400 : -8000))
                .distanceMax(minScreenDim * 3))
            .force('link', d3.forceLink<Node, Edge>(initLinks)
                .distance(minScreenDim / 6)
                .strength(2))
            .force('x', d3.forceX(width / 2).strength(0.05))
            .force('y', d3.forceY(height / 2).strength(0.05))
            .force('collision', d3.forceCollide<Node>().radius(d => d.radius + 5))
            .on('tick', () => {
                setNodes([...initNodes]);
                setLinks(sim.force<d3.ForceLink<Node, Edge>>('link')?.links() as Edge[]);
            });

        forceRef.current = sim;

        setNodes(initNodes);
        setLinks(initLinks);

    }, [width, height]);

    const onGestureEvent = (e: GestureEvent<PanGestureHandlerEventPayload>) => {
        const { translationX, translationY } = e.nativeEvent;
        transformRef.current.x = translationX;
        transformRef.current.y = translationY;
        if (svgGroupRef.current) {
            svgGroupRef.current.setNativeProps({
                transform: `translate(${prevTransformRef.current.x + transformRef.current.x}, ${prevTransformRef.current.y + transformRef.current.y}) scale(${transformRef.current.scale})`,
            });
        }
    };

    const onHandlerStateChange = (e: GestureEvent<PanGestureHandlerEventPayload>) => {
        if (e.nativeEvent.state === State.END) {
            prevTransformRef.current.x += transformRef.current.x;
            prevTransformRef.current.y += transformRef.current.y;
        }
    }

    return (
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
            <View style={{ flex: 1 }}>
                <Svg style={{ flex: 1 }}>
                    <G ref={svgGroupRef}>
                        {links.map((link, i) => (
                            <Line
                                key={`link-${i}`}
                                x1={link.source.x}
                                y1={link.source.y}
                                x2={link.target.x}
                                y2={link.target.y}
                                stroke="#8b45a4"
                                strokeWidth={2}
                            />
                        ))}
                        {nodes.slice(0).map((node) => (
                            <Circle
                                key={`node-${node.id}`}
                                cx={node.x}
                                cy={node.y}
                                r={node.radius}
                                fill={d3.schemeSet3[node.id % 12]}
                            />
                        ))}
                    </G>
                </Svg>
            </View>
        </PanGestureHandler>
    );
};

export default ForceGraphD3;
