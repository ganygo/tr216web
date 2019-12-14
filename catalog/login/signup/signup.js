module.exports = function(req,res,callback){
	var data={
		form:{
			username:'',
			password:'',
			repassword:'',
			name:'',
			lastName:'',
			gender:'',
			authCode:''
		},
		title:'Uyelik',
		message:''
	}
	if(req.method=='POST'){
		signup(req,res,data,callback);
	}else{
		callback(null,data);
	}
	
}

function signup(req,res,data,cb){


	data.form=Object.assign(data.form,req.body);
	if(data.form.password.trim()==''){
		data.message='Parola bos olamaz!';
		return cb(null,data);
	}
	if(data.form.password!=data.form.repassword){
		data.message='Tekrar parola ayni degil!';
		return cb(null,data);
	}
	api.post('/signup',req,data.form,(err,resp)=>{
		if(!err){
			res.redirect('/login/verify?username=' + data.form.username);
		}else{
			data.message=err.message;
			cb(null,data);
		}
		
	});
}
