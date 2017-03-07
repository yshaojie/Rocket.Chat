Accounts.registerLoginHandler(function(loginRequest) {
    //there are multiple login handlers in meteor.
    //a login request go through all these handlers to find it's login hander
    //so in our login handler, we only consider login requests which has admin field
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
	if(!(loginRequest.myAccount)) {
		return undefined;
	}
	var result = HTTP.post("http://mis.test.51zouchuqu.com/login",{
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
	})
	//登录成功
	if(result.content){
		var content = JSON.parse(result.content);
		if(content.code == 1000){
			var data = content.data;
			//we create a admin user if not exists, and get the userId
			var userId = data.user.id;
			var user = Meteor.users.findOne({_id: userId});
			console.log("find userId="+userId+" user="+JSON.stringify(user));

			if(!user || !user._id) {//用户不存在
				var newUser = {
					_id:userId,
					active:true,
					roles:['user'],
					username: loginRequest.myAccount
				};

				//创建新用户
				RocketChat.models.Users.create(newUser);
				user = Meteor.users.findOne({_id: userId});
			} else {
				userId = user._id;
			}

			//查询房间，不存在则创建新房间
			var room =  RocketChat.models.Rooms.findOneByIdOrName( 'zouchuqu');
			console.log("room="+JSON.stringify(room));
			if(!room || !room._id){
				RocketChat.models.Rooms.createWithIdTypeAndName('zouchuqu','p','走出趣');
				room =  RocketChat.models.Rooms.findOneByIdOrName( 'zouchuqu');
			}
			//将当前用户加入到房间
			RocketChat.addUserToRoom(room._id,user);
			console.log("userId="+userId+" ,account="+loginRequest.myAccount," ,token="+data.token);
			//creating the token and adding to the user
			let stampedToken = Accounts._generateStampedLoginToken();
			stampedToken.token = data.token;
			//hashing is something added with Meteor 0.7.x,
			//you don't need to do hashing in previous versions
			let hashStampedToken = Accounts._hashStampedToken(stampedToken);
			Meteor.users.update(userId,
				{$push: {'services.resume.loginTokens': hashStampedToken}}
			);
			ServerSession.set("x-auth-token",stampedToken.token)
			//sending token along with the userId
			return {
				userId: userId,
				token: stampedToken.token
			}
		}

	}else {
		console.log("result.content="+result.content+"  result.content.code="+result.content.code)
	}

});
