module.exports = function(req,res,callback){
	var data={
		form:{
			username:'',
			password:'',
			repassword:'',
			authCode:''
		},
		title:'Uyelik',
		message:''
	}
	if(req.method=='POST'){
		login(req,res,data,callback);
	}else{
		callback(null,data);
	}
	
}


function login(req,res,data, cb){
	if(req.method=='POST' || req.method=='PUT'){
		data.form.username=req.body.username || '';
		data.form.password=req.body.password || '';
		
		api.post('/login',req,data.form,(err,resp)=>{
			if(!err){
				var userAgent=req.headers['user-agent'] || '';
				var IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

				var doc=new db.sessions({token:resp.data.token,
					username:resp.data.username,
					name:resp.data.name,
					lastName:resp.data.lastName,
					gender:resp.data.gender,
					isSysUser:resp.data.isSysUser,
					isMember: resp.data.isMember, 
					ip:IP,
					userAgent:userAgent
				});
				doc.save((err,sessionDoc)=>{
					if(!err){
						console.log('res.redirect(/passport?sid=' + sessionDoc._id);
						res.redirect('/passport?sid=' + sessionDoc._id);
					}else{
						data['message']=err.message;
						cb(null,data);
					}
				});
				
			}else{
				data['message']=err.message;
				cb(null,data);
			}
			
		});
	}else{
		cb(null,data);
	}
}
