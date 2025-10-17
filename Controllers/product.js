
exports.read = async(req, res)=>{
    res.send('hello from read controller');
}
    
exports.list = async(req, res)=>{
    try {
        res.send('hello from list controller');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error. Try again.');
    }
}

exports.create = async(req, res)=>{
    try {
        res.send('hello from create controller');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error. Try again.');
    }
}

exports.update = async(req, res)=>{
    try {
        res.send('hello from update controller');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error. Try again.');
    }
}
exports.remove = async(req, res)=>{
    try {
        res.send('hello from remove controller');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error. Try again.');
    }
}