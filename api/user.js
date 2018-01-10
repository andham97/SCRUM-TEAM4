var router = require('express').Router();

module.exports = router;

router.post('/regUser', function(req, res){
    console.log('POST-request established');
    pool.getConnection(function(err, connection) {
        if(err) {
            res.status(500);
            res.json({'Error' : 'connecting to database: ' } + err);
            return;
        }
        console.log('Connected to database');

        var user = req.body;


        console.log("test email");
        var emailRegex = new RegExp('/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/');
        //if(!emailRegex.test(user[user.email])) throw err;

        console.log("email ok");

        connection.query('SELECT username FROM person WHERE username = ?', [user.username], function (err, result) {
            if (err) throw err;
            if (result) console.log('username exists'); //return error
            console.log("username");

            connection.query('SELECT email FROM person WHERE email = ?', [user.email], function (err, result) {
                if (err) throw err;
                if (result) console.log('email already in use'); //return error

                user.shopping_list_id = 0;

                var values = [
                    user.email,
                    user.username,
                    user.password,
                    user.forename,
                    user.middlename,
                    user.lastname,
                    user.phone,
                    new Date(user.birth_date).toISOString().slice(0, 19).replace('T', ' '),
                    user.gender,
                    user.profile_pic,
                    user.shopping_list_id
                ];

                connection.query('INSERT INTO person ' +
                    '(email, username, password_hash, forename, middlename,' +
                    'lastname, phone, birth_date,' +
                    'gender, profile_pic, shopping_list_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)', values, function(err, result) {
                    if (err) throw err;
                    if (result) console.log(result);
                    connection.release();

                    //svar på post request
                    res.json({message: "true"});
                });
            });
        });
    });
});


// ---------------------


