Meteor.loginAsToken = function(token, callback) {
    //create a login request with admin: true, so our loginHandler can handle this request
    var loginRequest = {token: token};
    //{ user: { email: <email> }, token: <token> }
    //send the login request
    Accounts.callLoginMethod({
        methodArguments: [loginRequest],
        userCallback: callback
    });
};

Meteor.loginAsPassword = function(myAccount,myPassword, callback) {
	//create a login request with admin: true, so our loginHandler can handle this request
	var loginRequest = {myAccount: myAccount,myPassword:myPassword};
	//{ user: { email: <email> }, token: <token> }
	//send the login request
	Accounts.callLoginMethod({
		methodArguments: [loginRequest],
		userCallback: callback
	});
};
