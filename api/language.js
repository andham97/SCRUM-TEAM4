var router = require('express').Router();
var path = require('path');
var fs = require('fs');

/**
 * Read correct json file in langs and return it based on language and requested URL
 */
router.get('/', function(req, res){
    var lang = req.session.lang;
    var pth = req.query.path || req.header('referer').split(":8000")[1];
    if(!lang){
        req.session.lang = "nb_NO";
        req.session.save();
        lang = "nb_NO";
    }
    if(!pth){
        res.status(400).send("Bad request");
        return;
    }
    pth = pth.split('.')[0];
    var p = path.join(__dirname, '../langs/' + lang + pth + '.json');
    if(!fs.existsSync(p)){
        res.status(400).send("Non existing translation");
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
    console.log("Lang is set");
    req.session.lang = lang;
    req.session.save();
    res.status(200).send("OK");
});

module.exports = router;