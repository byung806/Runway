/**
 * @description Node-based force graph. Implements panning and node click events.
 * Includes slight physics effect when panning.
 * 
 * This file is not used (replaced to ForceGraphD3New.tsx) but is kept for reference.
 * 
 * @exports ForceGraphD3
 * 
 * @author Bryan Yung
 */

// check slack

// X any-component zoomer
// https://github.com/Glazzes/react-native-zoom-toolkit/

// View zoomers
// https://www.npmjs.com/package/@openspacelabs/react-native-zoomable-view

// X svg zoomer
// https://github.com/garblovians/react-native-svg-pan-zoom

// X Is there any way to implement d3 svg-like zoom behavior, but without DOM mutation. For example, using some d3 pure functions with just x and y values as input.
// https://stackoverflow.com/questions/46955024/d3-zoom-behavior-in-react-native

// gesture handler pan

// idea: convert everything to three and use three's camera controls and find force graph library that works with three
// https://codesandbox.io/s/react-three-fiber-react-spring-svg-parallax-55tzr

// inertia: on pan responder release

// TODO: make nodes clickable
// TODO: add inertia to the pan gesture handler
// TODO: fade in out of screen?
// TODO: add shadow/glow to nodes
// TODO: add "special" nodes for leaderboard and profile and credits and payment


import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, G, Line, Text } from 'react-native-svg';
import * as d3 from 'd3';
import { GestureEvent, PanGestureHandler, PanGestureHandlerEventPayload, State } from 'react-native-gesture-handler';
import { useRunwayTheme } from '@/providers';

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

interface Link {
    source: Node;
    target: Node;
}

export default function ForceGraphD3() {
    const theme = useRunwayTheme();

    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const forceRef = useRef<d3.Simulation<Node, Link>>();

    const { width, height } = Dimensions.get('window');
    const minScreenDim = useMemo(() => Math.min(width, height), [width, height]);

    // ------------------ Panning ------------------
    // useRefs to update without re-render & lag (transform is updated directly on svg)
    const transformRef = useRef({ x: 0, y: 0, scale: 1 });  // cumulative transform state (left is -x, up is -y)
    const panningTransformRef = useRef({ x: 0, y: 0, scale: 1 });  // relative transform state (only used when panning)
    const svgGroupRef = useRef<G<any>>(null);

    // ------------------ Initialization ------------------
    useEffect(() => {
        // initialize nodes
        const initNodes = d3.range(20).map((val): Node => ({
            radius: Math.floor(Math.random() * 4) + 16,
            id: val,
            degree: 0,
            x: Math.random() * width,
            y: Math.random() * height
        }));

        // node that follows touch (repels other nodes to create a cool effect when panning)
        initNodes[0].radius = 0;

        // initialize links
        const initLinks: Link[] = [];
        for (let i = 1; i < initNodes.length; i++) {
            const source = initNodes[i];
            const target = initNodes[Math.floor(Math.random() * (i - 1)) + 1];
            initLinks.push({ source, target });
            source.degree++;
            target.degree++;
        }

        // initialize force https://d3js.org/d3-force/
        const targetEdgeLength = minScreenDim / 6;
        const targetNodeSeparation = minScreenDim;
        const sim = d3.forceSimulation<Node>(initNodes)
            // repel when too close
            .force('repel', d3.forceManyBody<Node>()
                .strength((d, i) => {
                    if (i === 0) {
                        return -1200;
                    }
                    return -800;
                })
                .distanceMax(targetNodeSeparation))
            // attract when too far
            .force('attract', d3.forceManyBody<Node>()
                .strength((d, i) => 200)
                .distanceMin(targetNodeSeparation))
            // attract linked nodes more
            .force('link', d3.forceLink<Node, Link>(initLinks)
                .distance(targetEdgeLength)
                .strength(2))
            // center the graph
            .force('center', d3.forceCenter(width / 2, height / 2).strength(0.8))
            // prevent nodes from overlapping
            .force('collision', d3.forceCollide<Node>().radius(d => d.radius + 5))
            .on('tick', () => {
                setNodes([...initNodes]);
                setLinks(sim.force<d3.ForceLink<Node, Link>>('link')?.links() as Link[]);
            });

        forceRef.current = sim;

        setNodes(initNodes);
        setLinks(initLinks);

    }, [width, height]);

    /*
    * When panning, update the transform of the svg group
    */
    function onPanGestureEvent(e: GestureEvent<PanGestureHandlerEventPayload>) {
        const { translationX, translationY } = e.nativeEvent;
        panningTransformRef.current.x = translationX;
        panningTransformRef.current.y = translationY;
        if (svgGroupRef.current) {
            svgGroupRef.current.setNativeProps({
                transform: `translate(${transformRef.current.x + panningTransformRef.current.x}, ${transformRef.current.y + panningTransformRef.current.y}) scale(${panningTransformRef.current.scale})`,
            });
        }
    };

    /*
    * Handle when panning starts or ends
    */
    function onPanStateChange(e: GestureEvent<PanGestureHandlerEventPayload>) {
        // when drag starts, move invisible node to touch position (to create a cool effect)
        if (e.nativeEvent.state === State.BEGAN) {
            // subtract to get touch coords relative to the graph
            nodes[0].fx = e.nativeEvent.x - transformRef.current.x;
            nodes[0].fy = e.nativeEvent.y - transformRef.current.y;

            // when alpha is 0, the simulation stops so we need to make it redo the physics a little bit
            forceRef.current?.alpha(0.1).restart();
        }

        // when drag ends, set the previous transform to the current transform
        else if (e.nativeEvent.state === State.END) {
            // update the cumulative transform
            transformRef.current.x += panningTransformRef.current.x;
            transformRef.current.y += panningTransformRef.current.y;

            // TODO: add inertia, snap to node
            // find closest node to center of screen (node coordinates have to be shifted by the transform amount)
            const closestNode = nodes.reduce((prev, curr) => {
                const prevDist = Math.hypot(
                    (prev.x + transformRef.current.x) - (width / 2),
                    (prev.y + transformRef.current.y) - (height / 2));
                const currDist = Math.hypot(
                    (curr.x + transformRef.current.x) - (width / 2),
                    (curr.y + transformRef.current.y) - (height / 2)
                );
                return currDist < prevDist ? curr : prev;
            });

            console.log('closest node:', closestNode.id);

            // snap to closest node
            // transformRef.current.x += (width / 2) - (closestNode.x + transformRef.current.x);
            // transformRef.current.y += (height / 2) - (closestNode.y + transformRef.current.y);
            // svgGroupRef.current?.setNativeProps({
            //     transform: `translate(${transformRef.current.x}, ${transformRef.current.y}) scale(${transformRef.current.scale})`,
            // });

            // fix node so it doesn't move
            // closestNode.fx = closestNode.x;
            // closestNode.fy = closestNode.y;


            // add inertia
            const { velocityX, velocityY } = e.nativeEvent;
            console.log('velocity:', velocityX, velocityY);
        }
    }

    function nodePressed(node: Node) {
        console.log('node pressed:', node.id);
    }

    return (
        <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={onPanStateChange}>
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
                                stroke={theme.graphLinkColor}
                                strokeWidth={4}
                                opacity={0.15}
                            />
                        ))}
                        {nodes.slice(1).map((node) => (
                            <G key={`node-${node.id}`}>
                                <Circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={node.radius}
                                    fill={d3.schemeSet3[node.id % 12]}
                                    onPress={() => nodePressed(node)}
                                    opacity={1}
                                />
                                {/* debug text to show each node's id */}
                                {/* <Text
                                    x={node.x}
                                    y={node.y}
                                    fontSize={node.radius}
                                    fill="#000"
                                    textAnchor="middle"
                                    dy=".3em"
                                >
                                    {node.id}
                                </Text> */}
                            </G>
                        ))}
                        {/* reference for the center */}
                        {/* <Circle
                            cx={width / 2}
                            cy={height / 2}
                            r={30}
                            fill={d3.schemeSet3[0]}
                            opacity={0.8}
                        /> */}
                    </G>
                </Svg>
            </View>
        </PanGestureHandler>
    );
};
