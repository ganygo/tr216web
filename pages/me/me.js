module.exports = function(req,res,callback){
	var data={
		genderList:staticvalues.genderList,
		form:{
			username:'',
			name:'',
			lastName:'',
			gender:'',
			email:'',
			oldPassword:'',
			newPassword:'',
			rePassword:''
		}
	}

	
	myprofile(req,res,data,callback);
	
}

function myprofile(req,res,data,callback){
	if(req.method=='POST'){
		
		api.put('/me',req,req.body,(err,resp)=>{
			if(!err){
				res.redirect('/?sid=' + req.query.sid);
				return;
				data.form=Object.assign(data.form,resp.data);
			}else{
				data.form=Object.assign(data.form,req.body);
				data['message']=err.message;
			}
			callback(null,data);
		});
	}else{
		api.get('/me',req,{},(err,resp)=>{
			if(!err){
				data.form=Object.assign(data.form,resp.data);
			}else{
				data['message']=err.message;
			}
			callback(null,data);
		});
	}

}

