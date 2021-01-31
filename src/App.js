import React from 'react';

import GrapheneCanvas from './GrapheneCanvas.js';
import Menu from './Menu.js';

class App extends React.Component {

    totalConnections = 0;
    totalAtoms = 0;
    
    constructor(props) {
        super(props);

        this.state = {
            selection: {},
            atoms: [],
            connections: [],
            width: 5,
            height: 5,
            warning: []
        };

        this.canvas = React.createRef();
    }

    render = () => {
        return (
            <div>
                <GrapheneCanvas
                    ref={ref => (this.canvas = ref)}
                    selection = {this.state.selection}
                    atoms = {this.state.atoms}
                    connections = {this.state.connections}
                    width = {this.state.width}
                    height = {this.state.height}
                    addAtomToSelection = {(id) => this.addAtomToSelection(id)}
                    addConnectionToSelection = {(id) => this.addConnectionToSelection(id)}
                    moveSelectedAtoms = {(dx, dy) => this.moveSelectedAtoms(dx, dy)}
                />
                <Menu 
                    selection = {this.state.selection}
                    atoms = {this.state.atoms}
                    connections = {this.state.connections}
                    centerOnSelection = {() => this.centerOnSelection()}
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
                    'connections': 0
                })

                this.totalAtoms++;
            }

            // A connection from a to b has 3 properties: id a b
            // This also initializes the connection counter for the atoms for the consistency checks
            // So the connections need to be in the file AFTER the atoms
            else if (line.length === 3) {

                let a = parseInt(line[1]);
                let b = parseInt(line[2]);

                connections.push({
                    'id': parseInt(line[0]),
                    'a':  a,
                    'b':  b
                })

                atoms[this.atomIndexByID(a, atoms)].connections++;
                atoms[this.atomIndexByID(b, atoms)].connections++;

                this.totalConnections++;
            }
        }
        
        this.setState({
            atoms: atoms,
            connections: connections,
            width: width,
            height: height,
        }, () => {
            this.checkConsistency();
            this.canvas.createCanvas();
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

        this.checkAllThreeConnections();
    }

    checkAllThreeConnections = () => {
        for(let i = 0; i < this.state.atoms.length; i++) {
            if (this.state.atoms[i].connections < 3) {
                console.log("Atom " + this.state.atoms[i].id + " has fewer than three connections");
            } else {
                console.log("Atom " + this.state.atoms[i].id + " has " + this.state.atoms[i].connections + " connections");
            }
        }
    }

    addAtomToSelection = (id) => {
        let s = this.state.selection;

        //console.log('adding ' + id + ' to selection which is now:');
        //console.log(s);

        if (s.type === 'atom') {
            if (s.ids.includes(id)) {
                let i = s.ids.indexOf(id);
                s.ids.splice(i, 1);
            } else {
                s.ids.push(id);
            }

            this.setState({
                selection: s
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
        this.canvas.centerOnItem(type, id);
    }

    removeSelectedConnection = () => {
        //this.canvas.removeSelectedConnection();

        let id = this.state.selection.id;

        console.log("removing connection " + id);

        this.removeConnectionByID(id);
    }

    removeConnectionByID = (id) => {
        let i = this.connectionIndexByID(id);//this.state.connections.indexOf(id);

        let c = this.state.connections
        let atoms = this.state.atoms;

        let a = this.atomIndexByID(c[i].a);
        let b = this.atomIndexByID(c[i].b);

        if (a !== null) atoms[a].connections--;
        if (b !== null) atoms[b].connections--;

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
        let i = this.atomIndexByID(id);//this.state.connections.indexOf(id);

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

        atoms[this.atomIndexByID(a)].connections++;
        atoms[this.atomIndexByID(b)].connections++;

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

        atoms[this.atomIndexByID(a.id)].connections++;
        atoms[this.atomIndexByID(b.id)].connections++;

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
        /*
        let bestX = this.closestToNumber(b.x, [a.x, a.x - this.state.width, a.x + this.state.width]);
        let bestY = this.closestToNumber(b.y, [a.y, a.y - this.state.height, a.y + this.state.height]);

        return Math.sqrt((b.x - bestX) * (b.x - bestX) + (b.y - bestY) * (b.y - bestY));
        */
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
            'z': z,
            'connections': 0
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

                        //atoms[this.atomIndexByID(c.a)].connections--;
                        atoms[this.atomIndexByID(new_id)].connections++;

                        c.a = new_id;
                        madeConnectionFrom.push(c.b);
                    }
                }
                if (c.b === s) {
                    if (madeConnectionFrom.includes(c.a)) {
                        this.removeConnectionByID(c.id);
                    } else {

                        //atoms[this.atomIndexByID(c.b)].connections--;
                        atoms[this.atomIndexByID(new_id)].connections++;

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

        //console.log("closest distance: " + closest_distance);

        let old_atom = atoms[this.atomIndexByID(atom_id)];

        this.removeAtomByID(atom_id);

        //console.log(old_atom);

        //let new_id = this.totalAtoms;
        let x = old_atom.x, y = old_atom.y, z = old_atom.z;
        let id1 = this.totalAtoms++;
        let id2 = this.totalAtoms++;
        let id3 = this.totalAtoms++;

        // TODO: deze + en - moeten ook module width/height
        let first = {
            'id': id1,
            'x': x + closest_distance / 2,
            'y': y,
            'z': z,
            'connections': 0
        };

        let second = {
            'id': id2,
            'x': x - closest_distance / 2,
            'y': y,
            'z': z,
            'connections': 0
        };

        let third = {
            'id': id3,
            'x': x,
            'y': y - closest_distance / 2,
            'z': z,
            'connections': 0
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

                    //atoms[this.atomIndexByID(c.a)].connections--;
                    atoms[this.atomIndexByID(closest.id)].connections++;

                    c.a = closest.id;
                }
    
                if (c.b === atom_id) {

                    //atoms[this.atomIndexByID(c.b)].connections--;
                    atoms[this.atomIndexByID(closest.id)].connections++;

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
