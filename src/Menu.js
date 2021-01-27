import React from 'react';
import IconButton from '@material-ui/core/IconButton';
//import Button from '@material-ui/core/Button';

//import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import AdjustIcon from '@material-ui/icons/Adjust';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
//import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';

import FileInput from './FileInput.js';

class Menu extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {};
        this.fileInput = React.createRef();
    }

    render = () => {
        return (
            <div id="menu-container">
                <div className="vertical-center">
                    <div className='button-container'>
                        <IconButton disabled = {!this.canAddConnection()} size="medium" 
                                    style={{fontSize: 14}} aria-label="add"
                                    onClick = {() => this.addConnectionBetweenSelectedAtoms()}>
                            <AddCircleIcon size="large" />
                            <span className='button-text'>ADD CONNECTION</span>
                        </IconButton>
                    </div>
                    <div className='button-container'>
                        <IconButton disabled = {!this.canRemoveConnection()} size="medium" 
                                    style={{fontSize: 14}} aria-label="remove"
                                    onClick = {() => this.removeSelectedConnection()}>
                            <RemoveCircleIcon size="large" />
                            <span className='button-text'>REMOVE CONNECTION</span>
                        </IconButton>
                    </div>
                    <div className='button-container'>
                        <IconButton size="medium" style={{fontSize: 14}} aria-label="replace-by-one">
                            <AdjustIcon size="large" />
                            <span className='button-text'>REPLACE TRIO BY ATOM</span>
                        </IconButton>
                    </div>
                    <div className='button-container'>
                        <IconButton size="medium" style={{fontSize: 14}} aria-label="replace-by-three">
                            <GroupWorkIcon size="large" />
                            <span className='button-text'>REPLACE ATOM BY TRIO</span>
                        </IconButton>
                    </div>
                    <div className='button-container'>
                        <IconButton size="medium" onClick={()=>{this.fileInput.startUpload()}}
                            style={{fontSize: 14}} aria-label="upload">
                            <PublishIcon size="large" />
                            <span className='button-text'>IMPORT FILE</span>
                            <FileInput ref={(ref) => this.fileInput = ref} loadText = {(t) => this.loadText(t)} />
                        </IconButton>
                    </div>
                    <div className='button-container'>
                        <IconButton size="medium" onClick={()=>{this.downloadFile()}} style={{fontSize: 14}} aria-label="download">
                            <GetAppIcon size="large" />
                            <span className='button-text'>EXPORT FILE</span>
                        </IconButton>
                    </div>
                </div>
            </div>
        )
    }

    canReplaceByTrio = () => {

    }

    canReplaceByAtom = () => {

    }

    connectionIndexByAtoms = (x, y) => {

        for (let i = 0; i < this.props.connections.length; i++) {
                if ((this.props.connections[i].a === x && this.props.connections[i].b === y) ||
                    (this.props.connections[i].b === x && this.props.connections[i].a === y)) {
                        return i
                }
        }

        return null
    }

    canAddConnection = () => {
        return (
            this.props.selection.type === 'atom' &&
            this.props.selection.ids.length === 2 && 
            this.connectionIndexByAtoms(this.props.selection.ids[0], this.props.selection.ids[1]) === null
        )
    }

    canRemoveConnection = () => {
        return this.props.selection.type === 'connection';
    }

    removeSelectedConnection = () => {
        //console.log("removing connection called at menu");
        this.props.removeSelectedConnection();
    }

    addConnectionBetweenSelectedAtoms = () => {
        this.props.addConnectionBetweenSelectedAtoms()
    }

    loadText = (t) => {
        this.props.loadText(t);
    }

    downloadFile = () => {
        this.props.downloadFile()
    }
}

export default Menu