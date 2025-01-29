/**
 * @description Node-based force graph. Implements panning and node click events.
 * Includes slight physics effect when panning.
 * 
 * @exports ForceGraphD3New
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
// translateX.value = withDecay({ velocity: event.velocityX });
// translateY.value = withDecay({ velocity: event.velocityY });

// TODO: make nodes clickable
// TODO: add inertia to the pan gesture handler
// TODO: fade in out of screen?
// TODO: add shadow/glow to nodes
// TODO: add "special" nodes for leaderboard and profile and credits and payment
// IMPORTANT: WHEN REMOVING NODES MAKE SURE TO CANCELANIMATION ON THE SCALE i think i have to do this? or maybe it'll be garbage collected idk

import { useRunwayTheme } from '@/providers';
import * as d3 from 'd3';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle, G, Line, Text } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withDecay } from 'react-native-reanimated';
import { useSprings, animated as animatedSpring } from '@react-spring/native';

const AnimatedGForPanning = Animated.createAnimatedComponent(G);
const AnimatedGForNodes = animatedSpring(G);

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
}

export default function ForceGraphD3New() {
    const theme = useRunwayTheme();

    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const forceRef = useRef<d3.Simulation<Node, Link>>();

    const { width, height } = Dimensions.get('window');
    const minScreenDim = useMemo(() => Math.min(width, height), [width, height]);

    // ------------------ Panning ------------------
    const prevTranslateX = useSharedValue(0);
    const prevTranslateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    });

    // Set up react-spring for node scales. Assuming a maximum of 50 nodes for safety.
    const MAX_NODES = 50;
    const [springs, api] = useSprings(MAX_NODES, index => ({ scale: 1 }));

    // ------------------ Initialization ------------------
    useEffect(() => {
        // initialize nodes
        const initNodes = d3.range(20).map((val): Node => ({
            // radius: Math.floor(Math.random() * 4) + 30,
            radius: 30,
            id: val,
            degree: 0,
            x: Math.random() * width,
            y: Math.random() * height,
        }));

        console.log('nodes successfully initialized');

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
        const touchRepelStrength = -1200;
        const targetEdgeLength = minScreenDim / 6;
        const targetNodeSeparation = minScreenDim;
        const sim = d3.forceSimulation<Node>(initNodes)
            // repel when too close
            .force('repel', d3.forceManyBody<Node>()
                .strength((d, i) => (i === 0 ? touchRepelStrength : -3000))
                .distanceMax(targetNodeSeparation))
            // attract when too far
            .force('attract', d3.forceManyBody<Node>()
                .strength(() => 200)
                .distanceMin(targetNodeSeparation))
            // attract linked nodes more
            .force('link', d3.forceLink<Node, Link>(initLinks)
                .distance(targetEdgeLength)
                .strength(2))
            // center the graph
            // you can't use forceCenter bc it force changes positions so it causes a problem where when u press the invisible node the center of the graph changes and so it teleports
            .force('centerX', d3.forceX(width / 2))
            .force('centerY', d3.forceY(height / 2))
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
    const panGesture = Gesture.Pan()
        .onTouchesDown(() => {
            cancelAnimation(translateX);
            cancelAnimation(translateY);
            prevTranslateX.value = translateX.value;
            prevTranslateY.value = translateY.value;
        })
        .onStart(({ x, y }) => {
            if (nodes[0]) {
                nodes[0].fx = x - translateX.value;
                nodes[0].fy = y - translateY.value;
            }
            forceRef.current?.alpha(0.1).restart();
        })
        .onUpdate(({ translationX, translationY }) => {
            translateX.value = prevTranslateX.value + translationX;
            translateY.value = prevTranslateY.value + translationY;
        })
        .onEnd(({ velocityX, velocityY }) => {
            translateX.value = withDecay({ velocity: velocityX, deceleration: 0.999 });
            translateY.value = withDecay({ velocity: velocityY, deceleration: 0.999 });

            // TODO: snap to node?
            // find closest node to center of screen (node coordinates have to be shifted by the transform amount)
            // const closestNode = nodes.reduce((prev, curr) => {
            //     const prevDist = Math.hypot(
            //         (prev.x + translateX.value) - (width / 2),
            //         (prev.y + translateY.value) - (height / 2));
            //     const currDist = Math.hypot(
            //         (curr.x + translateX.value) - (width / 2),
            //         (curr.y + translateY.value) - (height / 2)
            //     );
            //     return currDist < prevDist ? curr : prev;
            // });

            // console.log('closest node:', closestNode.id);

            // snap to closest node
            // translateX.value += (width / 2) - (closestNode.x + translateX.value);
            // translateY.value += (height / 2) - (closestNode.y + translateY.value);

            // fix node so it doesn't move
            // closestNode.fx = closestNode.x;
            // closestNode.fy = closestNode.y;
        })
        .runOnJS(true);

    function nodePressedIn(node: Node) {
        const currentScale = springs[node.id]?.scale.get();
        api.start(i => (i === node.id ? { scale: currentScale > 1 ? 1 : 1.5 } : { scale: 1 }));
        
        console.log('node pressed in:', node.id);
    }

    function nodePressed(node: Node) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    function nodePressedOut(node: Node) {
        // api.start(i => (i === node.id ? { scale: 1 } : {}));
        console.log('node pressed out:', node.id);
    }

    return (
        <GestureDetector gesture={panGesture}>
            <View style={{ flex: 1 }}>
                <Svg style={{ flex: 1 }}>
                    <AnimatedGForPanning animatedProps={animatedStyle}>
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
                            <AnimatedGForNodes
                                key={`node-${node.id}`}
                                x={node.x}
                                y={node.y}
                                // @ts-expect-error
                                style={{
                                    // transform adds to the parent transform
                                    transform: [
                                        { scale: springs[node.id]?.scale ?? 1 }
                                    ]
                                }}
                            >
                                <Circle
                                    r={node.radius}
                                    fill={d3.schemeSet3[node.id % 12]}
                                    onPressIn={() => nodePressedIn(node)}
                                    onPress={() => nodePressed(node)}
                                    onPressOut={() => nodePressedOut(node)}
                                    opacity={1}
                                />
                                <Text
                                    fontSize={node.radius}
                                    fill="#000"
                                    textAnchor="middle"
                                    dy=".3em"
                                >
                                    {node.id}
                                </Text>
                            </AnimatedGForNodes>
                        ))}
                    </AnimatedGForPanning>
                </Svg>
            </View>
        </GestureDetector>
    );
}
