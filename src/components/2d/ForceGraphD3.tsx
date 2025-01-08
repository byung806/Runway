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

// TODO: add inertia to the pan gesture handler
// TODO: make nodes clickable
// TODO: add shadow/glow to nodes


import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, Defs, G, Line } from 'react-native-svg';
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

interface Link {
    source: Node;
    target: Node;
}

const ForceGraphD3 = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const forceRef = useRef<d3.Simulation<Node, Link>>();

    const { width, height } = Dimensions.get('window');
    const minScreenDim = useMemo(() => Math.min(width, height), [width, height]);

    // ------------------ Panning ------------------
    // useRefs to update without re-render & lag (transform is updated directly on svg)
    const prevTransformRef = useRef({ x: 0, y: 0, scale: 1 });  // previous transform state
    const transformRef = useRef({ x: 0, y: 0, scale: 1 });  // current transform state
    const svgGroupRef = useRef<G<any>>(null);

    useEffect(() => {
        // initialize nodes
        const initNodes = d3.range(40).map((val): Node => ({
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
        const sim = d3.forceSimulation<Node>(initNodes)
            // repel when too close
            .force('repel', d3.forceManyBody<Node>()
                .strength((d, i) => {
                    if (i === 0) {
                        return -800;
                    }
                    return -400;
                })
                .distanceMax(minScreenDim))
            // attract when too far
            .force('attract', d3.forceManyBody<Node>()
                .strength((d, i) => 200)
                .distanceMin(minScreenDim))
            // attract linked nodes more
            .force('link', d3.forceLink<Node, Link>(initLinks)
                .distance(targetEdgeLength)
                .strength(2))
            // center the graph
            .force('center', d3.forceCenter(width / 2, height / 2).strength(0.6))
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

    function onGestureEvent(e: GestureEvent<PanGestureHandlerEventPayload>) {
        const { translationX, translationY } = e.nativeEvent;
        transformRef.current.x = translationX;
        transformRef.current.y = translationY;
        if (svgGroupRef.current) {
            svgGroupRef.current.setNativeProps({
                transform: `translate(${prevTransformRef.current.x + transformRef.current.x}, ${prevTransformRef.current.y + transformRef.current.y}) scale(${transformRef.current.scale})`,
            });
        }
    };

    function onHandlerStateChange(e: GestureEvent<PanGestureHandlerEventPayload>) {
        if (e.nativeEvent.state === State.BEGAN) {
            console.log(e.nativeEvent.x, e.nativeEvent.y);  // x and y are the coordinates of the touch ON THE SCREEN
            nodes[0].fx = e.nativeEvent.x - prevTransformRef.current.x;  // subtract to get relative coordinates to the svg
            nodes[0].fy = e.nativeEvent.y - prevTransformRef.current.y;
            forceRef.current?.alpha(0.3).restart();  // when alpha is 0, the simulation stops so we need to make it redo the physics a little bit
        }
        if (e.nativeEvent.state === State.END) {
            // set the previous transform (so next pan doesn't start from 0)
            prevTransformRef.current.x += transformRef.current.x;
            prevTransformRef.current.y += transformRef.current.y;
        }
    }

    function nodePressed(node: Node) {
        console.log('node pressed:', node);
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
                        {nodes.slice(1).map((node) => (
                            <Circle
                                key={`node-${node.id}`}
                                cx={node.x}
                                cy={node.y}
                                r={node.radius}
                                fill={d3.schemeSet3[node.id % 12]}
                                onPress={() => nodePressed(node)}
                                opacity={0.8}
                            />
                        ))}
                    </G>
                </Svg>
            </View>
        </PanGestureHandler>
    );
};

export default ForceGraphD3;
