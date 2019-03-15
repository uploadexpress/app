const extensionToImageIcon = (name) => {
    const splittedFileName = name.split('.')
    const extension = splittedFileName[splittedFileName.length - 1].toUpperCase()
    const extensions = {
        "JPG": require('../../img/jpg-file.svg'),
        "JPEG": require('../../img/jpg-file.svg'),
        "PDF": require('../../img/pdf-file.svg'),
        "ZIP": require('../../img/zip-file.svg'),
        "DOC": require('../../img/doc-file.svg'),
        "DOCX": require('../../img/doc-file.svg'),
        "PNG": require('../../img/png-file.svg'),
    }

    return (
        extensions[extension] !== undefined ? (
            extensions[extension]
        ) : (
                require('../../img/file-icon.svg')
            )
    )
}



export default extensionToImageIcon
