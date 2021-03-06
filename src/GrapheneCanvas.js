import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';

import Atom from './Atom.js';
import Connection from './Connection.js';

class GrapheneCanvas extends React.Component {

    constructor(props) {
        super(props);

        this.defaultScale = 0;
        this.menuWidth = 280;

        this.state = {
            dragging: false,
            selection: {},
            offsetx: 0,
            offsety: 0,
            centeringX: 0,
            centeringY: 0,
            totalWidth: window.innerWidth,
            totalHeight: window.innerHeight,
            currentScale: this.defaultScale,
            minScale: this.defaultScale,
            dragStart: {x: 0, y: 0},
            dragged: {x: 0, y: 0},
            moveMode: false
        }

        this.stage = React.createRef();
    }

    render = () => {

        return (
            <div id="canvas-container">
                <div id="coord-container">
                    <span>{-this.state.dragged.x.toFixed(2)}, {-this.state.dragged.y.toFixed(2)}</span>
                </div>
                <Stage 
                    width={this.state.totalWidth} 
                    height={this.state.totalHeight}
                    scaleX={this.defaultScale}
                    scaleY={this.defaultScale} 
                    
                    ref={ref => (this.stage = ref)}
                >
                    
                    <Layer
                        x = {this.state.centeringX}
                        y = {this.state.centeringY}
                    >
                        <Rect
                            width = {this.props.width}
                            height = {this.props.height}
                            stroke = 'black'
                            strokeWidth = {0.02}
                            fill= {'rgb(220, 220, 220)'}
                        />

                        {
                            this.props.connections.map((connection) => {
                                let data = this.getConnectionData(connection);
                                
                                return data.map((d) => {
                                    return <Connection
                                        key = {d.key}
                                        id= {d.id}
                                        scale = {this.getCurrentScale()}
                                        points = {d.points}
                                        selected = {this.props.selection.type === 'connection' && this.props.selection.id === d.id}
                                        addToSelection = {(c) => this.props.addConnectionToSelection(c)}
                                    />
                                })
                            })
                        }

                        {
                            this.props.atoms.map((a) => {

                                let coords = this.coordinateToScreenCoordinate(a.x, a.y);

                                return (<Atom 
                                    key = {a.id}
                                    id = {a.id}
                                    scale = {this.getCurrentScale()}
                                    x = {coords.x}
                                    y = {coords.y}
                                    selected = {this.props.selection.type === 'atom' && this.props.selection.ids.includes(a.id)}
                                    addToSelection = {(a) => this.props.addAtomToSelection(a)}
                                />)
                            })
                        }
                    </Layer>

                    <Layer listening={false}>
                    <Rect
                            width = {this.state.centeringX}
                            height = {10 * this.props.height}
                            fill = {"#fff"}
                    />
                    <Rect
                            x = {this.state.centeringX + this.props.width}
                            width = {this.state.centeringX}
                            height = {10 * this.props.height}
                            fill = {"#fff"}
                    />

                    <Rect
                            width = {10 * this.props.width}
                            height = {this.state.centeringY}
                            fill = {"#fff"}
                    />

                    <Rect
                            y = {this.state.centeringY + this.props.height}
                            width = {10 * this.props.width}
                            height = {this.state.centeringY}
                            fill = {"#fff"}
                    />
                    </Layer>
                </Stage>
            </div>
        )
    }

    componentDidMount = () => {

        let container = document.getElementById('canvas-container');

        container.addEventListener('click', this.handleClick);
        window.addEventListener('resize', this.onResize);
        container.addEventListener('wheel', this.zoomStage);

        
        container.addEventListener('mousedown', this.startDragging);
        window.addEventListener('mouseup', this.stopDragging);
        window.addEventListener('mousemove', this.dragMove);

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        
        this.createCanvas();
    }

    createCanvas = () => {
        let scaleX = (7 * window.innerWidth / 8) / this.props.width;
        let scaleY = (7 * window.innerHeight / 8) / this.props.height;

        this.defaultScale = Math.max(40, Math.min(scaleX, scaleY));

        this.setState({
            offsetx: this.props.width / 2,
            offsety: this.props.height / 2,
            currentScale: this.defaultScale,//Math.max(this.defaultScale, Math.min(scaleX, scaleY)),
            minScale: this.defaultScale,//Math.max(this.defaultScale, Math.min(scaleX, scaleY)),
            centeringX: 0,
            centeringY: 0
        }, () => {
            let screenBottomRight = this.getScreenPositionFromStage(this.props.width / 2, this.props.height / 2);
            
            this.setState({
                centeringX: ((window.innerWidth - screenBottomRight.x + this.menuWidth) / this.state.currentScale) / 2,
                centeringY: ((window.innerHeight - screenBottomRight.y) / this.state.currentScale) / 2
            }, () => {
                console.log("Created canvas");
            });
        });
    }

    startDragging = (e) => {

        this.setState({
            dragStart: this.getStagePositionFromScreen(e.pageX, e.pageY)
        }, () => {
            this.setState({dragging: true});
        })
    }

    dragMove = (e) => {
        if (!this.state.dragging) return;

        let s = this.state.dragStart;
        let p = this.getStagePositionFromScreen(e.pageX, e.pageY);

        if (this.state.moveMode) {
            this.setState({
                dragStart: p
            });

            this.props.moveSelectedAtoms(p.x - s.x, p.y - s.y);
        } else {

            let nx = this.state.dragged.x + p.x - s.x;
            let ny = this.state.dragged.y + p.y - s.y;

            while(nx < -this.props.width / 2) {
                nx += this.props.width;
            }
    
            while (nx > this.props.width / 2) {
                nx -= this.props.width;
            }
    
            while(ny < -this.props.height / 2) {
                ny += this.props.height;
            }
    
            while (ny > this.props.height / 2) {
                ny -= this.props.height;
            }

            this.setState({
                dragged: {
                    x: nx,
                    y: ny
                },
                dragStart: p
            })
        }
    }

    stopDragging = (e) => {
        //this.props.checkConsistency();
        this.props.updateSquares();
        
        this.setState({
            dragging: false
        }, () => {
            //console.log(this.state.dragging);
        })
    }

    centerOnItem = (type, id) => {
        if (type === 'atom') {
            let a = this.props.atoms[this.atomIndexByID(id)];

            this.centerOnLocation(a.x, a.y);
        }

        // It would be cleaner to do this to focus on the average of a and b,
        // but that would cause issues with the locations on the edge
        // because of the modulo in the locations on the canvas
        if (type === 'connection') {
            let c = this.props.connections[this.connectionIndexByID(id)];
            let a = this.props.atoms[this.atomIndexByID(c.a)];

            this.centerOnLocation(a.x, a.y);
        }
    }

    centerOnLocation = (x, y) => {
        this.setState({
            dragged: {
                x: -x,
                y: -y
            }
        }, () => this.props.updateSquares())
    }

    zoomStage = (e) => {
        if (this.state.mouseOverMenu || this.state.mouseOverTimeline) return;
        if (this.stage === null) return;
        
        let factor = 1;
        let scaling = 0.4;

        if (e.deltaY < 0) factor += scaling;
        if (e.deltaY > 0) factor -= scaling;

        let newscale = this.getCurrentScale() * factor;

        this.zoomStageTo((window.innerWidth - this.menuWidth) / 2 + this.menuWidth, window.innerHeight / 2, newscale);
    }

    zoomStageTo = (x, y, newscale) => {
        //if (newscale > this.state.maxscale) newscale = this.state.maxscale;

        if (newscale < this.state.minScale) {
            newscale = this.state.minScale;
        }

        if (this.stage === null) return;

        let oldscale = this.getCurrentScale();
        let pos = this.getCurrentPosition();

        let newPositions = [x - (x - pos.x) * newscale / oldscale, y - (y - pos.y) * newscale / oldscale];

        this.setState({
            currentScale: newscale
        });

        this.stage.to({
            scaleX: newscale,
            scaleY: newscale,
            x: newPositions[0],
            y: newPositions[1],
            duration: 0.1,
            onFinish: () => {
            }
        });
    }

    handleClick = (e) => {
        //let p = this.getStagePositionFromScreen(e.pageX, e.pageY);

        //console.log("screen position: " + e.pageX + ", " + e.pageY);
        //console.log("stage position: " + p.x + ", " + p.y);
    }

    handleKeyDown = (e) => {
        if (e.code === 'KeyQ') {
            if (!this.state.moveMode) {
                this.setState({
                    moveMode: true
                })
            }
        }
    }

    handleKeyUp = (e) => {
        if (e.code === 'KeyQ') {
            this.setState({
                moveMode: false
            })
        }
    }

    getStagePositionFromScreen = (x, y) => {

        let s = this.getCurrentScale();
        let pos = this.getCurrentPosition();

        let mx = (x - pos.x) / s;
        let my = (y - pos.y) / s;
        
        return {x: mx - this.state.offsetx - this.state.centeringX, y: my - this.state.offsety - this.state.centeringY};
        
    }

    getScreenPositionFromStage = (x, y) => {
        let s = this.getCurrentScale();
        let pos = this.getCurrentPosition();
        
        let mx = (x + this.state.offsetx + this.state.centeringX) * s;
        let my = (y + this.state.offsety + this.state.centeringY) * s;

        return {x: mx + pos.x, y: my + pos.y};
    }

    //distanceToPoint = (a, b) => Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));

    connectionIndexByID = (id) => {

        for (let i = 0; i < this.props.connections.length; i++) {
            if (this.props.connections[i].id === id) {
                return i
            }
        }

        return null
    }

    atomIndexByID = (id) => {

        for (let i = 0; i < this.props.atoms.length; i++) {
            if (this.props.atoms[i].id === id) {
                return i
            }
        }

        return null
    }

    getConnectionData = (c) => {

        let a = this.props.atoms[this.atomIndexByID(c.a)];
        let b = this.props.atoms[this.atomIndexByID(c.b)];

        /*
        * We want the line to the closest option for b
        * b, or b mirrored in x, or b mirrored in y
        * so to b
        * or b with b.x +/- width
        * or b with b.y +/- height
        */
        
        // Copy values of b into target such that changing target does not change b
        let s = {...a};
        let t = {...b};
    
        let different = false;

        let sa = this.coordinateToScreenCoordinate(a.x, a.y);
        let st = this.coordinateToScreenCoordinate(t.x, t.y);
        let ss = this.coordinateToScreenCoordinate(s.x, s.y);
        let sb = this.coordinateToScreenCoordinate(b.x, b.y);

        let dx = st.x - sa.x;
        let dy = st.y - sa.y;

        if (dx > this.props.width / 2) {
            st.x -= this.props.width
            ss.x += this.props.width
            different = true;
        } else if (dx < -this.props.width / 2) {
            st.x += this.props.width
            ss.x -= this.props.width
            different = true;
        }

        if (dy > this.props.height / 2) {
            st.y -= this.props.height
            ss.y += this.props.height
            different = true;
        } else if (dy < -this.props.height / 2) {
            st.y += this.props.height
            ss.y -= this.props.height
            different = true;
        }

        //x = {((a.x + this.state.offsetx + this.state.dragged.x) % this.props.width)}
        //y = {((a.y + this.state.offsety + this.state.dragged.y) % this.props.height)}

        let result = [
            {
                key: c.id,
                id: c.id,
                points: [sa.x, sa.y, st.x, st.y]
            }
        ];

        if (different) {
            result.push(
                {
                    key: c.id + 10e9,
                    id: c.id,
                    points: [ss.x, ss.y, sb.x, sb.y]
                }
            )
        }

        return result;
    }

    coordinateToScreenCoordinate = (x, y) => {
        let sx = ((x + this.state.offsetx + this.state.dragged.x) % this.props.width);
        let sy = ((y + this.state.offsety + this.state.dragged.y) % this.props.height);

        // Because otherwise negative modulo behaves weirdly
        sx = (sx + this.props.width) % this.props.width;
        sy = (sy + this.props.height) % this.props.height;

        return {x: sx, y: sy};
    }

    onResize = () => {
        
        this.createCanvas();
    }

    getCurrentScale = () => {
        let s = this.state.currentScale;

        try {
            s = this.stage.scaleX();
        } catch(error) {
            console.log("Could not get stage.scaleX()");
            console.log(error);
        }

        return s;
    }

    getCurrentPosition = () => {
        let pos = {x: 0, y: 0};

        try {
            pos = this.stage.absolutePosition();
        } catch(error) {
            console.log(error)
        }

        return pos;
    }
}

export default GrapheneCanvas