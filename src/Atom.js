import React from 'react';

import { Circle } from 'react-konva';

class Atom extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hovered: false,
            scale: props.scale
        }
    }

    render = () => {

        //console.log(this.props.s)
        //console.log(15 / this.props.s)

        return ([<Circle
            x = {this.props.x}
            y = {this.props.y}
            radius = {15 / this.props.scale}
            fill = {this.state.hovered ? this.getColor() : ''}
            onMouseEnter = {() => this.setState({hovered: true})}
            onMouseLeave = {() => this.setState({hovered: false})}
            onClick = {() => this.handleClick()}
            perfectDrawEnabled={false}
        />,
        <Circle
            x = {this.props.x}
            y = {this.props.y}
            radius = {8 / this.props.scale}
            fill = {this.getColor()}
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
        this.setState({
            scale: s
        })
    }

    handleClick = () => {
        console.log("Selected atom " + this.props.id);
        this.props.addToSelection(this.props.id);
    }
}

export default Atom