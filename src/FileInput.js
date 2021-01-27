import React from 'react';

class FileInput extends React.Component {
    constructor(props) {
        super(props)
        this.uploadFile = this.uploadFile.bind(this);

        this.uploader = React.createRef();
    }
    
    uploadFile(event) {
        let file = event.target.files[0];
        console.log(file);
        
        if (file) {
            //console.log(file);

            //console.log(file.text());
            file.text().then((t) => {
                console.log(t);
                this.props.loadText(t);
            })
            //let data = new FormData();
            //data.append('file', file);
            //console.log(data);
            //console.log(data.getAll());
            //console.log(data.get());
            //console.log(data.values());
            // axios.post('/files', data)...
        }
    }
    
    startUpload = () => {
        this.uploader.click()
    }

    render() {
        return <span id="file-upload-container">
            <input type="file"
            name="myFile"
            ref={(ref) => this.uploader = ref}
            onChange={this.uploadFile} />
        </span>
    }
}

export default FileInput;