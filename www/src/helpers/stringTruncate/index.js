const stringTruncate = (str, length) => {
    var dots = str.length > length ? '...' : '';
    return str.substring(0, length) + dots;
};

export default stringTruncate
