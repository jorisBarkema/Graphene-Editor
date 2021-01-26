import React from 'react';
import { Stage, Layer, Rect} from 'react-konva';

import Atom from './Atom.js';
import Connection from './Connection.js';

class GrapheneCanvas extends React.Component {

    constructor(props) {
        super(props);

        this.defaultScale = 50;

        this.state = {
            dragging: false,
            selection: {},
            //minScale: 1,
            offsetx: 0,
            offsety: 0,
            squares: {rows: [0], columns: [0]},
            centeringX: 0,
            centeringY: 0,
            totalWidth: window.innerWidth,
            totalHeight: window.innerHeight,
            currentScale: 50,
            minScale: 50,
            dragStart: {x: 0, y: 0},
            dragged: {x: 0, y: 0},
            createCanvas: () => this.createCanvas()
        }

        this.stage = React.createRef();
    }

    componentDidMount = () => {

        window.addEventListener('click', this.handleClick);
        window.addEventListener('resize', this.onResize);
        window.addEventListener('wheel', this.zoomStage);

        
        window.addEventListener('mousedown', this.startDragging);
        window.addEventListener('mouseup', this.stopDragging);
        window.addEventListener('mousemove', this.dragMove);
        
        //this.createCanvas();
        /*
        fetch('./samples/conf0')
        .then((r) => r.text())
        .then(text  => {
            //console.log(text);

            let lines = text.split('\n')

            let width = parseFloat(lines[0]);
            let height = parseFloat(lines[1]);
            
            let bottomRight = this.getStagePositionFromScreen(window.innerWidth, window.innerHeight);
            let right = bottomRight.x;
            let bottom = bottomRight.y;
            let scaleX = (2 * window.innerWidth / 3) / width;
            let scaleY = (2 * window.innerHeight / 3) / height;
            

            let atoms = [];
            let connections = [];

            for (let i = 4; i < lines.length; i++) {
                let line = lines[i].split(/\s+/);
                
                // An atom has 4 properties: id x y z
                if (line.length === 4) {
                    atoms.push({
                        'id': parseInt(line[0]),
                        'x':  parseFloat(line[1]),
                        'y':  parseFloat(line[2]),
                        'z':  parseFloat(line[3])
                    })
                }

                // A connection from a to b has 3 properties: id a b
                else if (line.length === 3) {
                    connections.push({
                        'id': parseInt(line[0]),
                        'a':  parseInt(line[1]),
                        'b':  parseInt(line[2])
                    })
                }
            }
            
            this.defaultScale = Math.min(scaleX, scaleY);

            this.setState({
                atoms: atoms,
                connections: connections,
                width: width,
                height: height,
                //minScale: Math.min(scaleX, scaleY),
                offsetx: width / 2,
                offsety: height / 2,
                centeringX: (right - width) / 2,
                centeringY: (bottom - height) / 2,
                currentScale: Math.min(scaleX, scaleY),
                minScale: Math.min(scaleX, scaleY),
            }, () => {
                this.setState({
                    squares: this.currentSquares()
                })
            });
        })
        */

    }

    createCanvas = () => {
        console.log("creating canvas");
        console.log(this.props.atoms);
        console.log(this.props.connections);
        console.log(this.props.width);
        console.log(this.props.height);

        let width = this.props.width;
        let height = this.props.height;

        let bottomRight = this.getStagePositionFromScreen(window.innerWidth, window.innerHeight);
        let right = bottomRight.x;
        let bottom = bottomRight.y;
        let scaleX = (2 * window.innerWidth / 3) / width;
        let scaleY = (2 * window.innerHeight / 3) / height;

        this.defaultScale = Math.min(scaleX, scaleY);

        this.setState({
            offsetx: width / 2,
            offsety: height / 2,
            centeringX: (right - width) / 2,
            centeringY: (bottom - height) / 2,
            currentScale: Math.min(scaleX, scaleY),
            minScale: Math.min(scaleX, scaleY),
        }, () => {
            this.setState({
                squares: this.currentSquares()
            })
        });
    }

    startDragging = (e) => {
        this.setState({
            dragStart: this.getStagePositionFromScreen(e.pageX, e.pageY)
        }, () => {
            this.setState({dragging: true});
        })

        //console.log("dragging set to true")
    }

    dragMove = (e) => {
        if (!this.state.dragging) return;

        let s = this.state.dragStart;
        let p = this.getStagePositionFromScreen(e.pageX, e.pageY);

        this.setState({
            dragged: {
                x: this.state.dragged.x + p.x - s.x,
                y: this.state.dragged.y + p.y - s.y
            },
            dragStart: p
        })

        //console.log(this.state.dragged);
    }

    stopDragging = (e) => {
        this.setState({
            dragging: false
        }, () => {
            //console.log(this.state.dragging);
        })

        //console.log("dragging set to false")
    }

    render = () => {

        return (
            <div id="canvas-container">
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
                            fill= {'rgb(220, 220, 220'}
                        />

                        {
                            this.props.connections.map((connection) => {
                                let data = this.getConnectionData(connection);

                                return data.map((d) => {
                                    return <Connection
                                        key = {d.key}
                                        id= {d.id}
                                        scale = {this.state.currentScale}
                                        points = {d.points}
                                        selected = {this.props.selection.type === 'connection' && this.props.selection.id === d.id}
                                        addToSelection = {(c) => this.addConnectionToSelection(c)}
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
                                    scale = {this.state.currentScale}
                                    x = {coords.x}
                                    y = {coords.y}
                                    selected = {this.props.selection.type === 'atom' && this.props.selection.ids.includes(a.id)}
                                    addToSelection = {(a) => this.addAtomToSelection(a)}
                                />)
                            })
                        }
                    </Layer>

                    <Layer>
                    <Rect
                            width = {this.state.centeringX}
                            height = {10 * this.props.height}
                            fill = {"#fff"}
                            //fillLinearGradientStartPoint = {{x: 0, y: 0}}
                            //fillLinearGradientEndPoint = {{x: this.state.centeringX, y: 0}}
                            //fillLinearGradientColorStops={[0, "#ffff", 0.97, "#ffff", 1, "#fff0"]}
                    />
                    <Rect
                            x = {this.state.centeringX + this.props.width}
                            width = {this.state.centeringX}
                            height = {10 * this.props.height}
                            fill = {"#fff"}
                            //fillLinearGradientStartPoint = {{x: 0, y: 0}}
                            //fillLinearGradientEndPoint = {{x: this.state.centeringX + this.props.width, y: 0}}
                            //fillLinearGradientColorStops={[0, "#fff0", 0.03, "#ffff", 1, "#ffff"]}
                    />

                    <Rect
                            width = {10 * this.props.width}
                            height = {this.state.centeringY}
                            fill = {"#fff"}
                            //fillLinearGradientStartPoint = {{x: 0, y: 0}}
                            //fillLinearGradientEndPoint = {{x: 0, y: this.state.centeringY}}
                            //fillLinearGradientColorStops={[0, "#ffff", 0.97, "#ffff", 1, "#fff0"]}
                    />

                    <Rect
                            y = {this.state.centeringY + this.props.height}
                            width = {10 * this.props.width}
                            height = {this.state.centeringY}
                            fill = {"#fff"}
                            //fillLinearGradientStartPoint = {{x: 0, y: 0}}
                            //fillLinearGradientEndPoint = {{x: this.state.centeringX + this.props.width, y: 0}}
                            //fillLinearGradientColorStops={[0, "#fff0", 0.03, "#ffff", 1, "#ffff"]}
                    />
                    </Layer>
                </Stage>
            </div>
        )
    }

    zoomStage = (e) => {
        if (this.state.mouseOverMenu || this.state.mouseOverTimeline) return;
        if (this.stage === null) return;
        
        let factor = 1;
        let scaling = 0.4;

        if (e.deltaY < 0) factor += scaling;
        if (e.deltaY > 0) factor -= scaling;

        let newscale = this.getCurrentScale() * factor;

        //this.zoomStageTo(e.pageX, e.pageY, newscale);
        this.zoomStageTo(window.innerWidth / 2, window.innerHeight / 2, newscale);
    }

    zoomStageTo = (x, y, newscale) => {
        //if (newscale > this.state.maxscale) newscale = this.state.maxscale;

        if (newscale < this.state.minScale) newscale = this.state.minScale;

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

    currentSquares = () => {

        //let scale = this.stage.scaleX();

        // Do it some distance out of bounds so they load before they are needed
        let topLeft = this.getStagePositionFromScreen(0, 0);
        let bottomRight = this.getStagePositionFromScreen(window.innerWidth, window.innerHeight);

        let rowStart = Math.floor(topLeft.x / this.props.height - 1);
        let rowEnd = Math.ceil(bottomRight.x / this.props.height + 1);

        let columnStart = Math.floor(topLeft.y / this.props.width - 1);
        let columnEnd = Math.ceil(bottomRight.y / this.props.width + 1);

        let rows = [];
        for (let i = rowStart; i <= rowEnd; i++) {
            rows.push(i);
        }

        let columns = [];
        for (let i = columnStart; i <= columnEnd; i++) {
            columns.push(i);
        }

        console.log({rows: rows, columns: columns});
        return {rows: rows, columns: columns}
    }

    handleClick = (e) => {
        //let p = this.getStagePositionFromScreen(e.pageX, e.pageY);

        //console.log("screen position: " + e.pageX + ", " + e.pageY);
        //console.log("stage position: " + p.x + ", " + p.y);
    }

    getStagePositionFromScreen = (x, y) => {

        let s = this.state.currentScale;
        let pos = this.getCurrentPosition();

        let mx = (x - pos.x) / s;
        let my = (y - pos.y) / s;
        
        return {x: mx - this.state.offsetx - this.state.centeringX, y: my - this.state.offsety - this.state.centeringY};
        
    }

    getScreenPositionFromStage = (x, y) => {
        let s = this.state.currentScale;
        let pos = this.getCurrentPosition();
        
        let mx = (x + this.state.offsetx) * s;
        let my = (y + this.state.offsety) * s;

        return {x: mx + pos.x, y: my + pos.y};
    }

    //distanceToPoint = (a, b) => Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));

    getConnectionData = (c) => {

        let a = this.props.atoms[c.a];
        let b = this.props.atoms[c.b];

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
        
        /*
        let bottomRight = this.getStagePositionFromScreen(window.innerWidth, window.innerHeight);
        let right = bottomRight.x;
        let bottom = bottomRight.y;
        let scaleX = (2 * window.innerWidth / 3) / this.props.width;
        let scaleY = (2 * window.innerHeight / 3) / this.props.height;


        this.setState({
            totalWidth: window.innerWidth,
            totalHeight: window.innerHeight,
            centeringX: (right - this.props.width) / 2,
            centeringY: (bottom - this.props.height) / 2,
            currentScale: Math.min(scaleX, scaleY),
            minScale: Math.min(scaleX, scaleY),
        })
        */
    }

    getCurrentScale = () => {
        let s = this.defaultScale;

        try {
            s = this.stage.scaleX();
        } catch(error) {
            console.log(error)
        }

        return s;
    }

    getCurrentPosition = () => {
        let pos = {x: 0, y: 0};

        try {
            pos = this.stage.absolutePosition();
        } catch(error) {
            //console.log(error)
        }

        return pos;
    }

    addAtomToSelection = (id) => {
        this.props.addAtomToSelection(id);
    }

    addConnectionToSelection = (id) => {
        this.props.addConnectionToSelection(id);
    }

    /*
    removeSelectedConnection = () => {
        let id = this.props.selection.id;

        console.log("removing connection " + id);
    }
    */
}

export default GrapheneCanvas