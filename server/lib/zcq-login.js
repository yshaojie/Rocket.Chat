Accounts.registerLoginHandler(function(loginRequest) {
    //there are multiple login handlers in meteor.
    //a login request go through all these handlers to find it's login hander
    //so in our login handler, we only consider login requests which has admin field
	console.log(loginRequest.password+" ddddddddddddd")
    if(!loginRequest.token) {
        return undefined;
    }

    //our authentication logic :)
    if(loginRequest.token != 'admin-password') {
        return null;
    }

    //we create a admin user if not exists, and get the userId
    var userId = null;
    var user = Meteor.users.findOne({username: 'admin'});
    if(!user) {
        userId = Meteor.users.insert({username: 'admin'});
    } else {
        userId = user._id;
    }

    //creating the token and adding to the user
    var stampedToken = Accounts._generateStampedLoginToken();
	stampedToken.token = loginRequest.token;
    //hashing is something added with Meteor 0.7.x,
    //you don't need to do hashing in previous versions
    var hashStampedToken = Accounts._hashStampedToken(stampedToken);

    Meteor.users.update(userId,
        {$push: {'services.resume.loginTokens': hashStampedToken}}
    );
	console.log("stampedToken.token="+stampedToken.token)
    //sending token along with the userId
    return {
        userId: userId,
        token: stampedToken.token
    }
});
