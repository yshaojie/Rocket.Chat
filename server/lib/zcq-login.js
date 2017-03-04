Accounts.registerLoginHandler(function(loginRequest) {
    //there are multiple login handlers in meteor.
    //a login request go through all these handlers to find it's login hander
    //so in our login handler, we only consider login requests which has admin field
	console.log("token="+loginRequest.token)
    if(!loginRequest.token) {
        return undefined;
    }

    //we create a admin user if not exists, and get the userId
    var userId = null;
    var user = Meteor.users.findOne({username: loginRequest.token});
    if(!user) {
        userId = Meteor.users.insert({username: loginRequest.token});
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

Accounts.registerLoginHandler(function(loginRequest) {
	//there are multiple login handlers in meteor.
	//a login request go through all these handlers to find it's login hander
	//so in our login handler, we only consider login requests which has admin field
	console.log(loginRequest.myAccount)
	if(!(loginRequest.myAccount)) {
		return undefined;
	}
	console.log(loginRequest.myAccount+"ddddddddddddddddddd")
	HTTP.post("http://mis.test.51zouchuqu.com/login",{
		params:{
			openId:"",
			userType:"employee",
			loginMode:"smsVericode",
			username:loginRequest.myAccount,
			vericode:loginRequest.myPassword,
			password:loginRequest.myPassword,
		},
		headers:{
			"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
		}
	},function (error,result) {
		//登录成功
		if(result.content){
			var content = JSON.parse(result.content);
			if(content.code == 1000){
				var data = content.data;
				//we create a admin user if not exists, and get the userId
				var userId = data.user.id;
				var user = Meteor.users.findOne({_id: userId});
				if(!user) {
					userId = Meteor.users.insert({_id:userId,username: loginRequest.myAccount});
				} else {
					userId = user._id;
				}
				console.log("userId="+userId+" ,account="+loginRequest.myAccount," ,token="+data.token);
				//creating the token and adding to the user
				// var stampedToken = Accounts._generateStampedLoginToken();
				//hashing is something added with Meteor 0.7.x,
				//you don't need to do hashing in previous versions
				// var hashStampedToken = Accounts._hashStampedToken(stampedToken);
				// hashStampedToken.token = data.token;
				Meteor.users.update(userId,
					{$push: {'services.resume.loginTokens': data.token}}
				);
				console.log("stampedToken.token="+data.token)
				//sending token along with the userId
				return {
					userId: userId,
					token: data.token
				}
			}

		}else {
			console.log("result.content="+result.content+"  result.content.code="+result.content.code)
		}


	});

});
