const extensionToImageIcon = (name) => {
    const splittedFileName = name.split('.')
    const extension = splittedFileName[splittedFileName.length - 1]
    const extensions = {
        "jpg": require('../../img/jpg-file.svg'),
        "jpeg": require('../../img/jpg-file.svg'),
        "pdf": require('../../img/pdf-file.svg'),
        "zip": require('../../img/zip-file.svg'),
        "doc": require('../../img/doc-file.svg'),
        "docx": require('../../img/doc-file.svg'),
        "png": require('../../img/png-file.svg'),
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
