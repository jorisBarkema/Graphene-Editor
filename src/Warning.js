import React from 'react';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';

class Warning extends React.Component {

    //constructor (props) {
    //    super(props);
    //}

    render = () => {

        /*
        return (
            <div className='warning'>
                <p>Warning: inconsistency at {this.props.type} {this.props.id}. <br />
                {this.props.text}</p>
            </div>
        )
        */

        return (
            <div className="warning">
                <Alert severity="warning" action={
                    <Button color="inherit" size="small" onClick={() => this.props.hasOwnProperty('location') ? this.props.centerOnLocation(this.props.location.x, this.props.location.y) : this.props.centerOnItem(this.props.type, this.props.id)}>
                    VIEW
                    </Button>
                }>
                        {this.props.text} at {this.props.hasOwnProperty('location') ? (this.props.location.x.toFixed(2) + ', ' + this.props.location.y.toFixed(2)) : (this.props.type + ' ' + this.props.id)}
                </Alert>
            </div>
        )
    }

    onClick = () => {
        console.log("test");
    }
}

export default Warning;