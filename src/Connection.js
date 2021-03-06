import React from 'react';

import { Line } from 'react-konva';

class Connection extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hovered: false,
            //scale: props.scale
        }
    }

    render = () => {
        return ([<Line
            key = {1}
            points = {this.props.points}
            stroke = {this.state.hovered ? this.getColor() : ''}
            strokeWidth = {12 / this.props.scale}
            onMouseEnter = {() => this.setState({hovered: true})}
            onMouseLeave = {() => this.setState({hovered: false})}
            onMouseDown = {() => this.handleClick()}
            perfectDrawEnabled={false}
        />,
        <Line
            key = {2}
            points = {this.props.points}
            stroke = {this.getColor()}
            strokeWidth = {(this.state.hovered ? 5 : 4) / this.props.scale}
            onMouseEnter = {() => this.setState({hovered: true})}
            onMouseLeave = {() => this.setState({hovered: false})}
            onMouseDown = {() => this.handleClick()}
            perfectDrawEnabled={false}
        />])
    }
    
    getColor = () => {
        return this.props.selected ? 'red' : 'black';
    }

    updateScale = (s) => {
        //this.setState({
        //    scale: s
        //})
    }

    handleClick = () => {
        console.log("Selected connection " + this.props.id);
        this.props.addToSelection(this.props.id);
    }
}

export default Connection