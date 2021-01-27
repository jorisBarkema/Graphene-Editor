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
            width: 5,//11.868215,
            height: 5//9.332725
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
                />
                <Menu 
                    selection = {this.state.selection}
                    atoms = {this.state.atoms}
                    connections = {this.state.connections}
                    removeSelectedConnection = {() => this.removeSelectedConnection()}
                    addConnectionBetweenSelectedAtoms = {() => this.addConnectionBetweenSelectedAtoms()}
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
                    'z':  parseFloat(line[3])
                })

                this.totalAtoms++;
            }

            // A connection from a to b has 3 properties: id a b
            else if (line.length === 3) {
                connections.push({
                    'id': parseInt(line[0]),
                    'a':  parseInt(line[1]),
                    'b':  parseInt(line[2])
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

    removeSelectedConnection = () => {
        //this.canvas.removeSelectedConnection();

        let id = this.state.selection.id;

        console.log("removing connection " + id);

        let i = this.connectionIndexByID(id);//this.state.connections.indexOf(id);

        let c = this.state.connections
        c.splice(i, 1);

        this.setState({
            selection: {},
            connections: c
        })
    }

    addConnectionBetweenSelectedAtoms = () => {

        let c = this.state.connections;

        c.push({
            'id': this.totalConnections++,
            'a':  this.state.selection.ids[0],
            'b':  this.state.selection.ids[1]
        })

        this.setState({
            connections: c
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

    atomIndexByID = (id) => {

        for (let i = 0; i < this.state.atoms.length; i++) {
            if (this.state.atoms[i].id === id) {
                return i
            }
        }

        return null
    }
}

export default App;
