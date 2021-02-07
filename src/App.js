import React from 'react';

import GrapheneCanvas from './GrapheneCanvas.js';
import Menu from './Menu.js';

class App extends React.Component {

    totalConnections = 0;
    totalAtoms = 0;
    
    constructor(props) {
        super(props);

        this.squareHeight = 2.8;
        this.squareWidth = 2.8;

        this.state = {
            selection: {},
            atoms: [],
            connections: [],
            squares: {rows: [], columns: []},
            visibleAtoms: [],
            visibleConnections: [],
            width: 5,
            height: 5,
            warnings: []
        };

        this.canvas = React.createRef();
    }

    render = () => {
        return (
            <div>
                <GrapheneCanvas
                    ref={ref => (this.canvas = ref)}
                    selection = {this.state.selection}
                    atoms = {this.state.visibleAtoms}
                    connections = {this.state.visibleConnections}
                    width = {this.state.width}
                    height = {this.state.height}
                    addAtomToSelection = {(id) => this.addAtomToSelection(id)}
                    addConnectionToSelection = {(id) => this.addConnectionToSelection(id)}
                    moveSelectedAtoms = {(dx, dy) => this.moveSelectedAtoms(dx, dy)}
                    checkConsistency = {() => this.checkConsistency()}
                    updateSquares = {() => this.updateSquares()}
                />
                <Menu 
                    selection = {this.state.selection}
                    atoms = {this.state.atoms}
                    connections = {this.state.connections}
                    warnings = {this.state.warnings}
                    centerOnSelection = {() => this.centerOnSelection()}
                    centerOnItem = {(t, id) => this.centerOnItem(t, id)}
                    centerOnLocation = {(x, y) => this.centerOnLocation(x, y)}
                    removeSelectedConnection = {() => this.removeSelectedConnection()}
                    addConnectionBetweenSelectedAtoms = {() => this.addConnectionBetweenSelectedAtoms()}
                    replaceSelectionByAtom = {() => this.replaceSelectionByAtom()}
                    replaceSelectionByTrio = {() => this.replaceSelectionByTrio()}
                    loadText = {(t) => this.loadText(t)}
                    downloadFile = {() => this.downloadFile()}
                />
            </div>
        );
    }

    loadText = (text) => {
        console.log("loading text");

        let lines = text.split('\n')

        let width = parseFloat(lines[0]);
        let height = parseFloat(lines[1]);

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
                    'z':  parseFloat(line[3]),
                    'square': this.coordToSquare(parseFloat(line[1]), parseFloat(line[2]), width, height)//{row: Math.round(parseFloat(line[2]) / this.squareHeight), column: Math.round(parseFloat(line[1]) / this.squareWidth)}
                })

                this.totalAtoms++;
            }

            // A connection from a to b has 3 properties: id a b
            else if (line.length === 3) {

                let a = parseInt(line[1]);
                let b = parseInt(line[2]);

                connections.push({
                    'id': parseInt(line[0]),
                    'a':  a,
                    'b':  b
                })

                this.totalConnections++;
            }
        }
        
        this.setState({
            atoms: atoms,
            connections: connections,
            width: width,
            height: height,
        }, () => {
            console.log("loaded text");
            this.checkConsistency();
            console.log("checked consistency");
            this.canvas.createCanvas();
            console.log("created canvas");

            this.updateSquares();
            
        });
    }

    downloadFile = () => {

        let text = '';

        text += this.state.width + '\n';
        text += this.state.height + '\n';

        text += '\n\n';

        for (let i = 0; i < this.state.atoms.length; i++) {
            let a = this.state.atoms[i];
            text += a.id + ' ' + a.x + ' ' + a.y + ' ' + a.z + '\n';
        }

        for (let i = 0; i < this.state.connections.length; i++) {
            let c = this.state.connections[i];
            text += c.id + ' ' + c.a + ' ' + c.b + '\n';
        }

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'graphene-sample');
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    checkConsistency = () => {
        console.log("Checking consistency of sample");

        let warnings = []
        //warnings = warnings.concat(this.checkAllThreeConnections());
        //warnings = warnings.concat(this.checkNoIntersections());

        // Necessity for consistency is checking some things twice,
        // e.g. when a onnection is removed, but also after replacing atom by trio,
        // which in turn removes connections.
        // So convert to set and back to array to remove duplicate warnings.
        warnings = [...new Set(warnings)];

        this.setState({
            warnings: warnings
        })
    }

    checkAllThreeConnections = () => {

        let warnings = [];

        let cs = this.state.connections;
        let counts = {};

        for(let i = 0; i < cs.length; i++) {
            let c = cs[i];

            if (c.a in counts) {
                counts[c.a]++;
            } else {
                counts[c.a] = 1;
            }
            
            if (c.b in counts) {
                counts[c.b]++;
            } else {
                counts[c.b] = 1;
            }
        }

        for (const [key, value] of Object.entries(counts)) {
            if (value < 3) {
                warnings.push({
                    id: key,
                    type: 'atom',
                    text: "Too few connections"
                })
            }

            if (value > 3) {
                warnings.push({
                    id: key,
                    type: 'atom',
                    text: "Too many connections"
                })
            }
        }

        return warnings;
    }

    checkNoIntersections = () => {
        let cs = this.state.connections;
        let atoms = this.state.atoms;

        let warnings = [];

        for(let i = 0; i < cs.length; i++) {
            for (let j = i + 1; j < cs.length; j++) {

                let first = cs[i];
                let second = cs[j];

                if (first.a === second.a || first.a === second.b || first.b === second.a | first.b === second.b) {
                    continue;
                }

                let a = atoms[this.atomIndexByID(first.a)];
                let b = atoms[this.atomIndexByID(first.b)];
                
                let bx = this.closestToNumber(a.x, [b.x, b.x - this.state.width, b.x + this.state.width]);
                let by = this.closestToNumber(a.y, [b.y, b.y - this.state.height, b.y + this.state.height]);

                let u = atoms[this.atomIndexByID(second.a)];
                let v = atoms[this.atomIndexByID(second.b)];

                let vx = this.closestToNumber(u.x, [v.x, v.x - this.state.width, v.x + this.state.width]);
                let vy = this.closestToNumber(u.y, [v.y, v.y - this.state.height, v.y + this.state.height]);

                let intersection = this.lines_intersect(a.x, a.y, bx, by, u.x, u.y, vx, vy);

                if (intersection) {
                    warnings.push({
                        location: intersection,
                        text: `Crossing lines between connections ${first.id} and ${second.id}`
                    })
                }
            }
        }

        return warnings;
    }

    updateSquares = () => {
        this.setState({
            squares: this.currentSquares()
        }, () => {

            let as = this.visibleAtoms();
            this.setState({
                visibleAtoms: as,
                visibleConnections: this.visibleConnections(as)
            })
        })
    }

    visibleAtoms = () => {
        
        let r = this.state.atoms.filter(atom => (this.state.squares.rows.includes(atom.square.row) && this.state.squares.columns.includes(atom.square.column)));
        let edge = [];

        for (let i = 0; i < this.state.connections.length; i++) {
            let c = this.state.connections[i];

            let a = this.state.atoms[this.atomIndexByID(c.a)];
            let b = this.state.atoms[this.atomIndexByID(c.b)];

            if (r.includes(a) && !r.includes(b) && !edge.includes(b)) {
                edge.push(b);
            }

            if (r.includes(b) && !r.includes(a) && !edge.includes(a)) {
                edge.push(a);
            }
        }

        console.log(r.length + " atoms in screen");
        console.log("showing " + r.concat(edge).length + " atoms");
        return r.concat(edge);
    }

    visibleConnections = (visibleAtoms) => {

        let atomIDs = visibleAtoms.map(a => a.id);

        let r = this.state.connections.filter(c => (atomIDs.includes(c.a) && atomIDs.includes(c.b)));

        return r;
    }

    coordToSquare = (x, y, width = this.state.width, height = this.state.height) => {

        //x = ((x % this.state.width) + this.state.width) % this.state.width;
        //y = ((y % this.state.height) + this.state.height) % this.state.height;

        while(x < -width / 2) {
            x += width;
        }

        while (x > width / 2) {
            x -= width;
        }

        while(y < -height / 2) {
            y += height;
        }

        while (y > height / 2) {
            y -= height;
        }

        //console.log(x, y);
        //console.log({row: Math.round(y / this.squareHeight), column: Math.round(x / this.squareWidth)});

        return {row: Math.round(y / this.squareHeight), column: Math.round(x / this.squareWidth)}
    }

    currentSquares = () => {

        if (this.canvas === null) return {rows: [0], columns: [0]}

        let stageX = -this.canvas.state.dragged.x;
        let stageY = -this.canvas.state.dragged.y;

        // Prevent modulo from doing fishy stuff by doing this
        // Feels a bit hacky though
        while(stageX < -this.state.width / 2) {
            stageX += this.state.width;
        }

        while (stageX > this.state.width / 2) {
            stageX -= this.state.width;
        }

        while(stageY < -this.state.height / 2) {
            stageY += this.state.height;
        }

        while (stageY > this.state.height / 2) {
            stageY -= this.state.height;
        }


        let rows = [];
        let columns = [];
        for(let i = -6; i <= 6; i++) {
            for(let j = -3; j <= 3; j++) {
                let s = this.coordToSquare(stageX + i * this.squareWidth, stageY + j * this.squareHeight);

                if (!rows.includes(s.row)) rows.push(s.row);
                if (!columns.includes(s.column)) columns.push(s.column);
            }
        }

        console.log("rows: " + rows);
        console.log("columns: " + columns);
        return {rows: rows, columns: columns}
    }

    currentSquaresOld = () => {

        //let scale = this.stage.scaleX();

        
        console.log("window");
        console.log(window.innerWidth);
        console.log(window.innerHeight);

        let stageTopLeft = this.canvas.getStagePositionFromScreen(this.canvas.menuWidth, 0);
        let stageBottomRight = this.canvas.getStagePositionFromScreen(window.innerWidth, window.innerHeight);

        console.log("stage");
        console.log(stageTopLeft);
        console.log(stageBottomRight);

        let topLeft = this.canvas.coordinateToScreenCoordinate(stageTopLeft.x, stageTopLeft.y);
        let bottomRight = this.canvas.coordinateToScreenCoordinate(stageBottomRight.x, stageBottomRight.y);

        console.log("coords")
        console.log(topLeft);
        console.log(bottomRight);

        let topLeftSquare = this.coordToSquare(topLeft.x, topLeft.y);
        let bottomRightSquare = this.coordToSquare(bottomRight.x, bottomRight.y);

        let squares = this.minimumCoveringSurface(topLeftSquare, bottomRightSquare);

        console.log(squares.rows, squares.columns);

        return squares;
    }

    // line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
    // Determine the intersection point of two line segments
    // Return FALSE if the lines don't intersect
    lines_intersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {

        // Check if none of the lines are of length 0
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            return false
        }
    
        let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    
        // Lines are parallel
        if (denominator === 0) {
            return false
        }
    
        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
    
        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false
        }
    
        // Return a object with the x and y coordinates of the intersection
        let x = x1 + ua * (x2 - x1)
        let y = y1 + ua * (y2 - y1)
    
        return {x, y}
    }
    
    addAtomToSelection = (id) => {
        let s = this.state.selection;

        if (s.type === 'atom') {
            if (s.ids.includes(id)) {
                let i = s.ids.indexOf(id);
                s.ids.splice(i, 1);
            } else {
                s.ids.push(id);
            }

            this.setState({
                selection: s.ids.length > 0 ? s : {}
            })
        } else {
            this.setState({
                selection: {
                    type: 'atom',
                    ids: [id]
                }
            })
        }
    }

    addConnectionToSelection = (id) => {
        let s = this.state.selection;

        if (s.type === 'connection' && s.id === id) {
            this.setState({
                selection: {}
            })
        } else {
            this.setState({
                selection: {
                    type: 'connection',
                    id: id
                }
            })
        }
    }

    moveSelectedAtoms = (dx, dy) => {
        let s = this.state.selection;

        if (s.type === 'connection') return;

        let atoms = this.state.atoms;

        for (let i = 0; i < s.ids.length; i++) {
            let a = atoms[this.atomIndexByID(s.ids[i])];

            a.x += dx;
            a.y += dy;
        }
    }

    centerOnSelection = () => {
        let s = this.state.selection;
        let id = 0;

        if (s.type === 'atom') id = s.ids[0];
        if (s.type === 'connection') id = s.id;

        this.centerOnItem(s.type, id);
    }

    centerOnItem = (type, id) => {
        
        this.canvas.centerOnItem(type, parseInt(id));
    }

    centerOnLocation = (x, y) => {
        this.canvas.centerOnLocation(x, y);
    }

    removeSelectedConnection = () => {
        let id = this.state.selection.id;

        console.log("removing connection " + id);

        this.removeConnectionByID(id);
    }

    removeConnectionByID = (id) => {
        let i = this.connectionIndexByID(id);

        let c = this.state.connections
        let atoms = this.state.atoms;

        c.splice(i, 1);

        this.setState({
            selection: {},
            connections: c,
            atoms: atoms
        }, () => {
            this.checkConsistency();
        })
    }

    removeAtomByID = (id) => {
        let i = this.atomIndexByID(id);

        let a = this.state.atoms
        a.splice(i, 1);

        this.setState({
            selection: {},
            atoms: a
        }, () => {
            this.checkConsistency();
        })
    }

    addConnectionBetweenSelectedAtoms = () => {

        let c = this.state.connections;
        let atoms = this.state.atoms;

        let a = this.state.selection.ids[0];
        let b = this.state.selection.ids[1];

        c.push({
            'id': this.totalConnections++,
            'a':  a,
            'b':  b
        })

        this.setState({
            connections: c,
            atoms: atoms
        }, () => {
            this.checkConsistency();
        })
    }

    addConnectionBetweenAtoms = (a, b) => {
        let c = this.state.connections;
        let atoms = this.state.atoms;

        c.push({
            'id': this.totalConnections++,
            'a':  a.id,
            'b':  b.id
        })

        this.setState({
            connections: c,
            atoms: atoms
        }, () => {
            this.checkConsistency();
        })
    }

    closestToNumber = (n, a) => {
        let best = a[0];
        let best_d = Math.abs(a[0] - n);

        for (let i = 0; i < a.length; i++) {
            if (Math.abs(a[i] - n) < best_d) {
                best = a[i];
                best_d = Math.abs(a[i] - n);
            }
        }

        return best;
    }

    distanceBetween = (a, b) => {
        return this.distanceTo(a, b.x, b.y);
    }

    distanceTo = (a, x, y) => {
        let bestX = this.closestToNumber(x, [a.x, a.x - this.state.width, a.x + this.state.width]);
        let bestY = this.closestToNumber(y, [a.y, a.y - this.state.height, a.y + this.state.height]);

        return Math.sqrt((x - bestX) * (x - bestX) + (y - bestY) * (y - bestY));
    }

    closestAtom = (x, y) => {
        let closest = this.state.atoms[0];
        let closest_d = 10e9;

        for (let i = 0; i < this.state.atoms.length; i++) {
            let d = this.distanceTo(this.state.atoms[i], x, y);

            if (d < closest_d) {
                closest_d = d;
                closest = this.state.atoms[i];
            }
        }

        return closest;
    }

    replaceSelectionByAtom = () => {
        let atoms = this.state.atoms;
        let connections = this.state.connections;

        let new_id = this.totalAtoms;

        let selectionIDs = this.state.selection.ids;

        let guide = {
            x: 0,
            y: 0,
            z: 0
        }

        let x = 0, y = 0, z = 0;

        // Always 3 atoms selected when this can be called
        for(let i = 0; i < selectionIDs.length; i++) {
            let index = this.atomIndexByID(selectionIDs[i]);

            let a = atoms[index];

            let bestX = this.closestToNumber(guide.x, [a.x, a.x - this.state.width, a.x + this.state.width]);
            let bestY = this.closestToNumber(guide.y, [a.y, a.y - this.state.height, a.y + this.state.height]);

            x += bestX / 3;
            y += bestY / 3;
            z += a.z / 3;

            //set guide to current approximate value
            guide = {
                x: x * (3 - i),
                y: y * (3 - i),
                z: z * (3 - i)
            }

            atoms.splice(index, 1);
        }

        atoms.push({
            'id': new_id,
            'x': x,
            'y': y,
            'z': z
        })

        let madeConnectionFrom = [];

        for(let t = 0; t < this.state.selection.ids.length; t++) {
            let s = this.state.selection.ids[t];

            for(let i = connections.length - 1; i >= 0; i--) {
                let c = connections[i];
    
                if (c.a === s) {
                    if (madeConnectionFrom.includes(c.b)) {
                        this.removeConnectionByID(c.id);
                    } else {

                        c.a = new_id;
                        madeConnectionFrom.push(c.b);
                    }
                }
                if (c.b === s) {
                    if (madeConnectionFrom.includes(c.a)) {
                        this.removeConnectionByID(c.id);
                    } else {

                        c.b = new_id;
                        madeConnectionFrom.push(c.a);
                    }
                }
            }
        }
                

        this.totalAtoms++;

        this.setState({
            selection: {},
            atoms: atoms,
            connections: connections
        }, () => {
            this.checkConsistency();
        })
    }

    replaceSelectionByTrio = () => {
        // Can only be one selected when this function is called
        let atoms = this.state.atoms;
        let connections = this.state.connections;

        let atom_id = this.state.selection.ids[0];

        let closest_distance = 10e9;

        for (let i = 0; i < connections.length; i++) {
            let c = connections[i];

            if (c.a === atom_id) {
                let d = this.distanceBetween(atoms[this.atomIndexByID(atom_id)], atoms[this.atomIndexByID(c.b)]);

                if (d < closest_distance) {
                    closest_distance = d;
                }
            }

            if (c.b === atom_id) {
                let d = this.distanceBetween(atoms[this.atomIndexByID(atom_id)], atoms[this.atomIndexByID(c.a)]);

                if (d < closest_distance) {
                    closest_distance = d;
                }
            }
        }

        let old_atom = atoms[this.atomIndexByID(atom_id)];

        this.removeAtomByID(atom_id);

        let x = old_atom.x, y = old_atom.y, z = old_atom.z;
        let id1 = this.totalAtoms++;
        let id2 = this.totalAtoms++;
        let id3 = this.totalAtoms++;

        // TODO: deze + en - moeten ook module width/height
        let first = {
            'id': id1,
            'x': x + closest_distance / 2,
            'y': y,
            'z': z
        };

        let second = {
            'id': id2,
            'x': x - closest_distance / 2,
            'y': y,
            'z': z
        };

        let third = {
            'id': id3,
            'x': x,
            'y': y - closest_distance / 2,
            'z': z
        };

        atoms.push(first);
        atoms.push(second);
        atoms.push(third);

        this.addConnectionBetweenAtoms(first, second);
        this.addConnectionBetweenAtoms(second, third);
        this.addConnectionBetweenAtoms(third, first);
        
        for (let i = 0; i < connections.length; i++) {
            let c = connections[i];

            let neighbor_id = null;

            if (c.a === atom_id) {
                neighbor_id = c.b;
            }

            if (c.b === atom_id) {
                neighbor_id = c.a;
            }

            if (neighbor_id !== null) {
                let neighbor = atoms[this.atomIndexByID(neighbor_id)];

                let closest = first;
                let closest_d = this.distanceBetween(neighbor, first);

                if (this.distanceBetween(neighbor, second) < closest_d) {
                    closest = second;
                    closest_d = this.distanceBetween(neighbor, second);
                }

                if (this.distanceBetween(neighbor, third) < closest_d) {
                    closest = third;
                }

                if (c.a === atom_id) {
                    c.a = closest.id;
                }
    
                if (c.b === atom_id) {
                    c.b = closest.id;
                }
            }
        }

        this.setState({
            selection: {},
            atoms: atoms,
            connections: connections
        }, () => {
            this.checkConsistency();
        })
    }

    connectionIndexByID = (id) => {

        for (let i = 0; i < this.state.connections.length; i++) {
            if (this.state.connections[i].id === id) {
                return i
            }
        }

        return null
    }

    atomIndexByID = (id, atoms = null) => {

        if (atoms === null) {
            atoms = this.state.atoms;
        }

        for (let i = 0; i < atoms.length; i++) {
            if (atoms[i].id === id) {
                return i
            }
        }

        return null
    }
}

export default App;
