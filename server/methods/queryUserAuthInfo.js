Meteor.methods({
	queryUserAuthInfo(username) {
		console.log("username=" + username)
		user = Meteor.users.findOne({"username":username})
		result = HTTP.get("http://mis.test.51zouchuqu.com/seekerUser/getAuthInfoByUserId",{
			headers:{
				"x-auth-token":ServerSession.get("x-auth-token")
			},
			params:{
				"userId":user._id
			}
		})
		authInfo = {}
		if( result && result.statusCode == 200){
			content = JSON.parse(result.content)
			if( content.code == 200){
				authInfo = content.data;
			}
		}
		return authInfo
	}
});
