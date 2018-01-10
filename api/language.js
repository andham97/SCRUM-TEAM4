var router = require('express').Router();
var path = require('path');
var fs = require('fs');

router.get('/', function(req, res){
    var lang = req.session.lang;
    var pth = req.query.path;
    if(!lang){
        req.session.lang = "nb_NO";
        req.session.save();
        lang = "nb_NO";
        console.log("error");
    }
    if(!pth){
        res.status(400).send("Bad request");
        return;
    }
    pth = pth.split('.')[0];
    var p = path.join(__dirname, '../langs/' + lang + pth + '.json');
    if(!fs.existsSync(p)){
        res.status(400).send("Bad Request");
        return;
    }
    var stat = fs.statSync(p);

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(p);
    readStream.pipe(res);
});

router.post('/', function(req, res){
    var lang = req.body.lang;
    if(!lang) {
        res.status(400).send("Bad request");
        return;
    }
    req.session.lang = lang;
    req.session.save();
    res.status(200).send("OK");
});

module.exports = router;