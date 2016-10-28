var request = require('request');

var settings = {
    urls: {
        login: 'https://unite.nike.com/loginWithSetCookie',
        token: 'https://awr.svs.nike.com/accesstoken',
        activities: 'https://api.nike.com/sport/v3/me/activities/before_time/',
        activityReferer: 'https://www.nike.com/us/en_us/p/myactivity'
    },
    uxid: 'com.nike.commerce.nikedotcom.web',
    app: 'com.nike.nikeplus.web',
    appVersion: 202,
    experienceVersion: 169,
    backendEnvironment: 'default',
    clientId: 'HlHa2Cje3ctlaOqnxvgZXNaAs7T9nAuH',

    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) ' +
               'AppleWebKit/602.2.14 (KHTML, like Gecko) ' +
               'Version/10.0.1 Safari/602.2.14',
};

var requestPromise = function requestPromise(req) {
    return new Promise(function(yes, no) {
        request(req, function(err, response, body) {
            return err ? no(err) : yes(body);
        });
    });
};

var loginCookieJar = request.jar();
var loginData = null;
var loginToken = null;

requestPromise({
    method: 'POST',
    uri: settings.urls.login,
    qs: {
        'appVersion': settings.appVersion,
        'experienceVersion': settings.experienceVersion,
        'uxid': settings.uxid,
        'locale': 'en_US',
        'backendEnvironment': settings.backendEnvironment,
        'browser': 'Apple Computer, Inc.',
        'os': 'undefined',
        'mobile': 'false',
        'native': 'false',
        'lifetime': 'session'
    },
    headers: {
        'Content-Type': 'text/plain',
        'Referer': 'http://www.nike.com/us/en_us/',
        'Origin': 'http://www.nike.com',
        'User-Agent': settings.userAgent
    },
    jar: loginCookieJar,
    json: {
        'username': process.argv[2],
        'password': process.argv[3],
        'keepMeLoggedIn': true,
        'client_id': settings.clientId,
        'ux_id': settings.uxid,
        'grant_type': 'password'
    }
}).then(function loginResponse(body) {
    loginData = body;

    return requestPromise({
        method: 'GET',
        uri: settings.urls.token,
        qs: {
            app: settings.app,
            '_': (new Date()).getTime()
        },
        headers: {
            'Content-Type': 'text/html',
            'Referer': settings.urls.activityReferer,
            'Origin': 'https://www.nike.com',
            'User-Agent': settings.userAgent
        },
        jar: loginCookieJar
    });

}).then(function tokenResponse(body) {
    loginToken = body;

    return requestPromise({
        method: 'GET',
        uri: settings.urls.activities + (new Date()).getTime(),
        qs: {
            types: 'jogging,run',
            limit: '10000',
            metrics: 'ALL'
        },
        headers: {
            'Content-Type': 'application/json',
            'Referer': settings.urls.activityReferer,
            'Authorization': 'Bearer ' + loginToken,
            'Accept': 'application/json',
            'User-Agent': settings.userAgent,
            'Origin': 'https://www.nike.com'
        },
        jar: loginCookieJar
    });

}).then(function activityResponse(body) {
    console.log(JSON.stringify(JSON.parse(body), null, '    '));

}).catch(function(err) {
    console.error('Oops, something went wrong logging in:');
    console.error(err.stack);
});
