module.exports = (express, app) => {
    var router = express.Router();

    router.get('/', function (req, res, next) {
        res.render('index', {host: app.get('host')});
    });

    router.post('/upload', function(req, res, next){
        // File upload
    });


    // get the server working with the app

    app.use('/', router);

}