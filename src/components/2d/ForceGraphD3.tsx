// check slack

// any-component zoomer
// https://github.com/Glazzes/react-native-zoom-toolkit/

// View zoomers
// https://www.npmjs.com/package/@openspacelabs/react-native-zoomable-view

// svg zoomer
// https://github.com/garblovians/react-native-svg-pan-zoom

// Is there any way to implement d3 svg-like zoom behavior, but without DOM mutation. For example, using some d3 pure functions with just x and y values as input.
// https://stackoverflow.com/questions/46955024/d3-zoom-behavior-in-react-native


// inertia: on pan responder release


import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';
import * as d3 from 'd3';

import {
    fitContainer,
    ResumableZoom,
    useImageResolution,
} from 'react-native-zoom-toolkit';
import { Styles } from '@/styles';

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
    const { width, height } = Dimensions.get('window');
    const minScreenDim = useMemo(() => Math.min(width, height), [width, height]);

    const [zoomState, setZoomState] = useState({ k: 1, x: 0, y: 0 });

    // MINE
    // useEffect(() => {
    //     if (selectedNode) {
    //         selectedNode.fx = width / 2;
    //         selectedNode.fy = height / 2;
    //     }
    // }, [selectedNode]);

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
        // setSelectedNode(root);
        root.radius = 0;
        // root.fx = width / 2;
        // root.fy = height / 2;

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
                .strength((d, i) => (i > 0 ? -1000 : -2000))
                .distanceMax(minScreenDim * 3))
            .force('link', d3.forceLink<Node, Edge>(initLinks)
                .distance(minScreenDim / 4)
                .strength(1))
            .force('x', d3.forceX(width / 2).strength(0.05))
            .force('y', d3.forceY(height / 2).strength(0.05))
            .force('collision', d3.forceCollide<Node>().radius(d => d.radius + 5))
            .on('tick', () => {
                setNodes([...initNodes]);
                setLinks(sim.force<d3.ForceLink<Node, Edge>>('link')?.links() as Edge[]);
            });

        forceRef.current = sim;

        // zoom doesn't work because the way it's implemented uses addEventListener which doesn't work with Native
        // const zoom = d3.zoom()
        //     .scaleExtent([0.5, 5])
        //     .on('zoom', (e) => {
        //         setZoomState({
        //             k: e.transform.k,
        //             x: e.transform.x,
        //             y: e.transform.y
        //         });
        //     });
        // zoomRef.current = zoom;

        setNodes(initNodes);
        setLinks(initLinks);

    }, [width, height]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, { dx, dy }) => {
            // console.log('gestureState', dx, dy);
            setZoomState({
                k: zoomState.k,
                x: zoomState.x + dx,
                y: zoomState.y + dy
            })
        },
    });

    return (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
            {/* <ResumableZoom
                minScale={1}
                maxScale={5}
                scaleMode='clamp'
                pinchEnabled={false}
                tapsEnabled={false}
                // onPanStart={(e) => {
                //     console.log('onPanStart', e);
                //     nodes[0].fx = e.x;
                //     nodes[0].fy = e.y;
                //     forceRef.current?.alphaTarget(0.8).restart();
                // }}
            > */}
                <Svg style={{ flex: 1 }}>
                    <G
                        transform={`translate(${zoomState.x},${zoomState.y}) scale(${zoomState.k})`}
                    >
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
                        {nodes.slice(1).map((node) => (
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
            {/* </ResumableZoom> */}
        </View>
    );
};

export default ForceGraphD3;

