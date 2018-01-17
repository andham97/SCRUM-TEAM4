/**
 * Prepare server for test language
 */
before("Create session (log in)", function(done){
    request.post('/api/auth')
        .send({
            username: 'testnavn',
            password: 'test'
        })
        .expect(200)
        .end(function(err, res) {
            if (err)
                return done(err);
            Cookies = res.headers['set-cookie'].pop().split(';')[0];

            return done();
        });
});

after(function(){
    pool.end();
});

/**
 * Test for the language API
 */
describe('Language API', function(){
    /**
     * Check bad request handling
     */
    it('should return 400', function(done){
        request.get('/api/language')
            .expect(400)
            .end(done);
    });

    /**
     * Testing the GET request with correct parameters
     */
    it('should return username', function(done){
        var req = request.get('/api/language').query({
            path: '/test.html'
        });
        req.cookies = Cookies;
        req.expect(200)
            .expect({username: "Username"})
            .end(done);
    });

    /**
     * Testing if requesting non existing translation and change language request
     */
    it('should return 400', function(done){
        request.post('/api/language')
            .send({
                lang: 'en_US'
            })
            .end(function(err){
                if(err)
                    return done(err);
                request.get('/api/language')
                    .query({
                        path: '/test.html'
                    })
                    .expect(400)
                    .end(done);
            });
    });
});