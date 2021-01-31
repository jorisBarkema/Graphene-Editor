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
                    <Button color="inherit" size="small">
                    VIEW
                    </Button>
                }>
                        {this.props.text} at {this.props.type} {this.props.id}
                </Alert>
            </div>
        )
    }
}

export default Warning;