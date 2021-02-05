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
//import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';


import FileInput from './FileInput.js';
import Warning from './Warning.js';

class Menu extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {};
        this.fileInput = React.createRef();
    }

    render = () => {
        return (
            <div id="menu-container">
                <div>
                    <div className='button-container'>
                        <IconButton disabled = {false} size="medium" 
                                    style={{fontSize: 14}} aria-label="add"
                                    onClick = {() => this.props.centerOnSelection()}>
                            <FilterCenterFocusIcon size="large" />
                            <span className='button-text'>CENTER ON SELECTION</span>
                        </IconButton>
                    </div>
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
                        <IconButton disabled = {!this.canReplaceByAtom()} size="medium" 
                                    style={{fontSize: 14}} aria-label="replace-by-one"
                                    onClick = {() => this.replaceSelectionByAtom()}>
                            <AdjustIcon size="large" />
                            <span className='button-text'>REPLACE TRIO BY ATOM</span>
                        </IconButton>
                    </div>
                    <div className='button-container'>
                        <IconButton disabled = {!this.singleAtomSelected()} 
                                    size="medium" style={{fontSize: 14}} aria-label="replace-by-three"
                                    onClick = {() => this.replaceSelectionByTrio()}>
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
                    {
                        this.props.warnings.length > 0 ? 
                        <div id="warning-container">
                            {
                                this.props.warnings.map((warning, index) => {
                                    return <Warning {...warning} key={index} centerOnLocation={(x, y) => this.props.centerOnLocation(x, y)} centerOnItem={(t, id) => this.props.centerOnItem(t, id)} />;
                                })
                            }
                        </div> : null
                    }
                    <div id="documentation-container">
                        <p>
                            Add any number of atoms or a single connection to the selection by clicking on them.
                        </p>
                        <p>
                            Drag the canvas to move around, hold Q and drag to move selected atoms.
                        </p>
                        <p>
                            For more information on how to use this editor, read the README on <a href="https://github.com/jorisBarkema/Graphene-Editor">Github</a>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    singleAtomSelected = () => {
        return (
            this.props.selection.type === 'atom' &&
            this.props.selection.ids.length === 1
        )
    }

    canReplaceByAtom = () => {
        return (
            this.props.selection.type === 'atom' &&
            this.props.selection.ids.length === 3
        )
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

    enterMoveAtomState = () => {
        this.props.enterMoveAtomState();
    }

    addConnectionBetweenSelectedAtoms = () => {
        this.props.addConnectionBetweenSelectedAtoms()
    }

    replaceSelectionByAtom = () => {
        this.props.replaceSelectionByAtom();
    }

    replaceSelectionByTrio = () => {
        this.props.replaceSelectionByTrio();
    }

    loadText = (t) => {
        this.props.loadText(t);
    }

    downloadFile = () => {
        this.props.downloadFile()
    }
}

export default Menu