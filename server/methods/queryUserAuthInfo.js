Meteor.methods({
	queryUserAuthInfo(username) {
		console.log("username=" + username)
		user = Meteor.users.findOne({"username":username})
		console.log("user="+JSON.stringify(user));
		console.log("user_id="+user._id);
		dd = HTTP.get("http://www.baidu.com");
		console.log("dddd="+dd);
		result = HTTP.get("http://mis.test.51zouchuqu.com/seekerUser/getAuthInfoByUserId",{
			headers:{
				"x-auth-token":"617e964b-e00a-44e7-912f-61fd7dbdb0b9"
			},
			params:{
				"userId":user._id
			}
		})
		console.log("result="+result )
		console.log("result="+JSON.stringify(result) )
		authInfo = {}
		if( result && result.statusCode == 200){
			content = JSON.parse(result.content)
			if( content.code == 200){
				authInfo = content.data;
			}
		}
		console.log("authInfo="+JSON.stringify(authInfo) )
		console.log("authInfo type="+(typeof authInfo));
		return authInfo
	}
});
