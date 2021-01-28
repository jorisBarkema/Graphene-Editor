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
            file.text().then((t) => {
                console.log(t);
                this.props.loadText(t);
                
                let input = document.getElementsByName("fileInput")[0];

                input.value = '';
            })
        }
    }
    
    startUpload = () => {
        this.uploader.click()
    }

    render() {
        return <span id="file-upload-container">
            <input type="file"
            name="fileInput"
            ref={(ref) => this.uploader = ref}
            onChange={this.uploadFile} />
        </span>
    }
}

export default FileInput;