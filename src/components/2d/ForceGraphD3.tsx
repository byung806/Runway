import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import {
    GestureEvent,
    PanGestureHandler,
    PanGestureHandlerEventPayload,
    PinchGestureHandler,
    PinchGestureHandlerEventPayload,
    State
} from 'react-native-gesture-handler';
import Svg, { Circle, G, Line } from 'react-native-svg';
import * as d3 from 'd3';

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

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const forceRef = useRef<d3.Simulation<Node, Edge>>();
    // const svgRef = useRef<Svg>(null);
    const { width, height } = Dimensions.get('window');

    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [prevTranslateX, setPrevTranslateX] = useState(0);
    const [prevTranslateY, setPrevTranslateY] = useState(0);

    const [scale, setScale] = useState(1);
    const [prevScale, setPrevScale] = useState(1);
    const [lastScaleOffset, setLastScaleOffset] = useState(0);


    // MINE
    useEffect(() => {
        if (selectedNode) {
            selectedNode.fx = width / 2;
            selectedNode.fy = height / 2;
        }
    }, [selectedNode]);

    useEffect(() => {
        // Initialize nodes
        const initNodes = d3.range(12).map((val): Node => ({
            radius: Math.floor(Math.random() * 8) + 7,
            id: val,
            degree: 0,
            x: Math.random() * width,
            y: Math.random() * height
        }));
        // Root node (today card)
        const root = initNodes[0];
        setSelectedNode(root);
        // root.radius = 0;
        // root.fx = width / 2;
        // root.fy = height / 2;

        // Initialize links
        const initLinks: Edge[] = [];
        for (let i = 1; i < initNodes.length; i++) {
            const source = initNodes[i];
            const target = initNodes[Math.floor(Math.random() * i)];
            initLinks.push({ source, target });
            source.degree++;
            target.degree++;
        }

        // Initialize force
        const sim = d3.forceSimulation<Node>(initNodes)
            .force('charge', d3.forceManyBody<Node>()
                .strength((d, i) => (i > 0 ? -30 : -30))
                .distanceMax((width + height) / 2))
            .force('link', d3.forceLink<Node, Edge>(initLinks)
                .distance(69)
                .strength(0.9))
            .force('x', d3.forceX(width / 2).strength(0.05))
            .force('y', d3.forceY(height / 2).strength(0.05))
            .on('tick', () => {
                setNodes([...initNodes]);
                setLinks(sim.force<d3.ForceLink<Node, Edge>>('link')?.links() as Edge[]);
            });

        forceRef.current = sim;

        setNodes(initNodes);
        setLinks(initLinks);
    }, [width, height]);

    function panGestureHandler(e: GestureEvent<PanGestureHandlerEventPayload>) {
        console.log('pan', e.nativeEvent.translationX, e.nativeEvent.translationY);
        console.log('prev', prevTranslateX, prevTranslateY);
        setTranslateX(prevTranslateX + e.nativeEvent.translationX / -scale);
        setTranslateY(prevTranslateY + e.nativeEvent.translationY / -scale);
    }

    function panStateHandler(e: GestureEvent<PanGestureHandlerEventPayload>) {
        if (e.nativeEvent.state === State.END) {
            setPrevTranslateX(translateX);
            setPrevTranslateY(translateY);
        }
    }

    function pinchGestureHandler(e: GestureEvent<PinchGestureHandlerEventPayload>) {
        if (e.nativeEvent.scale + lastScaleOffset >= 1 && e.nativeEvent.scale + lastScaleOffset <= 5) {
            setPrevScale(scale);
            setScale(e.nativeEvent.scale + lastScaleOffset);
            setTranslateX(
                (translateX - (
                    e.nativeEvent.focalX / scale -
                    e.nativeEvent.focalX / prevScale
                ))
            )
            setTranslateY(
                (translateY - (
                    e.nativeEvent.focalY / scale -
                    e.nativeEvent.focalY / prevScale
                ))
            )
        }
    }

    function pinchStateHandler(e: GestureEvent<PinchGestureHandlerEventPayload>) {
        if (e.nativeEvent.state === State.END) {
            setLastScaleOffset(-1 + scale);
            setPrevTranslateX(translateX);
            setPrevTranslateY(translateY);
        }
    }

    return (
        <PanGestureHandler
            onGestureEvent={panGestureHandler}
            onHandlerStateChange={panStateHandler}
        >
            <PinchGestureHandler
                onGestureEvent={pinchGestureHandler}
                onHandlerStateChange={pinchStateHandler}
            >
                <View>
                    <Svg width={width} height={height}>
                        <G transform={`scale(${scale}) translate(${-translateX}, ${-translateY})`}>
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
                            {nodes.map((node) => (
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
            </PinchGestureHandler>
        </PanGestureHandler>
    );
};

export default ForceGraphD3;



/*
    // PanResponder to move the root node
    // restart needed for some reason cus sim will stop after a while
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
*/