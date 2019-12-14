global.pages = {};


module.exports = function(app){

	app.all("/*", function(req, res, next) {

		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Credentials', 'true');
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization,   Content-Type, Content-Length, X-Requested-With , x-access-token, token");
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
		return next();
	});

	app.all('/passport', function(req, res) {
 		var data={
 			databases:[],
 			sid:(req.query.sid || '')
 		}
 		res.render('_common/passport', data);
		
	});

 	initApi(app);
 	initPageRoutes(app,'/','main',menu);
 	menu.forEach((e)=>{
 		console.log(e.text,e.path);
 		if(e.nodes==undefined) e.nodes=[];
 		initPageRoutes(app,e.path,'main',e.nodes,e);
 		e.nodes.forEach((e2)=>{
 			e2.path=e.path+e2.path;
 			console.log('e2:',e2.text,e2.path);
 			if(e2.nodes==undefined) e2.nodes=[];
 			initPageRoutes(app,e2.path,'main',e2.nodes,e2);
 			e2.nodes.forEach((e3)=>{
 				e3.path=e2.path+e3.path;
	 			console.log('e3:',e3.text,e3.path);
	 			if(e3.nodes==undefined) e3.nodes=[];
	 			initPageRoutes(app, e3.path,'main',e3.nodes,e3);
	 		});
 		});
 	});
 	// initPageRoutes(app,'/fil','fil',[]);
 	// initPageRoutes(app,'/market','market',[]);
 	// initPageRoutes(app,'/portal','portal',[]);
 	// initPageRoutes(app,'/realestate','realestate',require('./menu-realestate.json'));
 	// initPageRoutes(app,'/vehicle','vehicle',[]);
 	// initPageRoutes(app,'/hr','hr',[]);
 	initPageRoutes(app,'/me','me',[]);
 	initPageRoutes(app,'/underconstruction','underconstruction',[]);
 	// initPageRoutes(app,'/services','services',[]);
 	initPageRoutes(app,'/login','login',[]);
	
}


function initPageRoutes(app,route,moduleName,currentMenu,parentMenu){
	var moduleFolder = path.join(__dirname, '../catalog',moduleName);
	
	if(!fs.existsSync(moduleFolder)) {
		return;
	}
	pages[moduleName]=loadPages(moduleName,moduleFolder);

	console.log(moduleName,':',pages[moduleName]);
	
	app.all(route, userInfo, function(req, res) {
		
		pages[moduleName]['index'].code(req, res, (err,data)=>{
			if(!data) data={};
			data['moduleName']=moduleName;
			data=setGeneralParams(req,data);
			data['menu']=currentMenu;
			data['parentMenu']=parentMenu;
			if(!err){
				res.render(pages[moduleName]['index'].view['index'], data);
			}else{
				errorPage(req,res,err);
			}
		});
		
	});

	// app.all(route + '/:page', userInfo, function(req, res) {
		
	// 	if (pages[moduleName][req.params.page] == undefined) {
	// 		errorPage(req,res,{code:404,message:'Sayfa bulunamadi!'});
	// 	} else {
	// 		pages[moduleName][req.params.page].code(req, res, (err,data)=>{
	// 			if(!data) data={};
	// 			data['moduleName']=moduleName;
	// 			data=setGeneralParams(req,data);
	// 			data['menu']=currentMenu;
	// 			data['parentMenu']=parentMenu;
	// 			if(!err){
	// 				res.render(pages[moduleName][req.params.page].view['index'], data);
	// 			}else{
	// 				errorPage(req,res,err);
	// 			}
	// 		});
	// 	}
	// });

	// app.all(route + '/:page/:func', userInfo,  function(req, res) {
	// 	console.log('moduleName:page/:func ',moduleName);
	// 	console.log('route:page/:func ',route);
	// 	if (pages[moduleName][req.params.page] == undefined) {
	// 		errorPage(req,res,{code:404,message:'Sayfa bulunamadi!'});
	// 	} else {
	// 		pages[moduleName][req.params.page].code(req, res, (err,data,view)=>{
	// 			if(!data) data={};
	// 			data['moduleName']=moduleName;
	// 			data=setGeneralParams(req,data);
	// 			data['menu']=currentMenu;
	// 			data['parentMenu']=parentMenu;

	// 			if(pages[moduleName][req.params.page].view[req.params.func]){
	// 				res.render(pages[moduleName][req.params.page].view[req.params.func], data);
	// 			}else{
	// 				res.render(pages[moduleName][req.params.page].view['index'], data);
	// 			}
	// 		});
	// 	}
	// });
	
	// app.all(route + '/:page/:func/:id', userInfo, function(req, res) {
	// 	if (pages[moduleName][req.params.page] == undefined) {
	// 		errorPage(req,res,{code:404,message:'Sayfa bulunamadi!'});
	// 	} else {
	// 		pages[moduleName][req.params.page].code(req, res, (err,data,view)=>{
	// 			if(!data) data={};
	// 			data=setGeneralParams(req,data);
	// 			data['menu']=currentMenu;
	// 			data['parentMenu']=parentMenu;

	// 			if(pages[moduleName][req.params.page].view[req.params.func]){
	// 				res.render(pages[moduleName][req.params.page].view[req.params.func], data);
	// 			}else{
	// 				res.render(pages[moduleName][req.params.page].view['index'], data);
	// 			}
	// 		});
	// 	}
	// });
	

	
}

function errorPage(req,res,err){
	console.log(err);
	res.render(path.join('error', 'error'), {err:err});
}

function initApi(app){
	app.all('/api/:func', function(req, res) {
		localApi(req,res,false);
	});
	app.all('/api/:func/:param1', function(req, res) {
		localApi(req,res,false);
	});

	app.all('/api/:func/:param1/:param2', function(req, res) {
		localApi(req,res,false);
	});

	app.all('/api/:func/:param1/:param2/:param3', function(req, res) {
		localApi(req,res,false);
	});

	app.all('/dbapi/:func', function(req, res) {
		localApi(req,res,true);
	});
	app.all('/dbapi/:func/:param1', function(req, res) {
		localApi(req,res,true);
	});

	app.all('/dbapi/:func/:param1/:param2', function(req, res) {
		localApi(req,res,true);
	});

	app.all('/dbapi/:func/:param1/:param2/:param3', function(req, res) {
		localApi(req,res,true);
	});
}

function setGeneralParams(req,data){
	var referer=req.headers.referer ;
	var current = req.protocol + '://' + req.get('host') + req.originalUrl + '?';
	var filter = '';
	var filterObj = {};

	for(let k in req.query){
		current +=encodeURIComponent(k) + '=' + encodeURIComponent(req.query[k]) + '&';
		if(k!='page' && k!='db' && k!='sid'){
			filter +=encodeURIComponent(k) + '=' +  encodeURIComponent(req.query[k]) + '&';
			if(k!='pageSize'){
				filterObj[k]=req.query[k];
			}else{
				data['pageSize']=req.query[k];
			}
		}
	}
	
	if(current.substr(-1)=='&'){
		current=current.substr(0,current.length-1);
	}
	if(filter.substr(-1)=='&'){
		filter=filter.substr(0,filter.length-1);
	}
	
	data['currentUrl']=current;
	if(referer!=current){
		data['setGeneralParams']=referer;
	}
	data['filterString']=filter;
	data['filterObjects']=filterObj;
	data['isSysUser']=req.params.isSysUser || false;
	data['isMember']=req.params.isMember || true;
	data['isSysUser']=req.params.isSysUser || false;
	data['role']=req.params.role || 'user';
	data['username']=req.params.username || '';
	data['name']=req.params.name || '';
	data['lastName']=req.params.lastName || '';
	data['gender']=req.params.gender || '';
	data['sid']=req.query.sid || '';
	data['func']=req.params.func;
	data['db']=req.query.db || '';
	data['apiUrl']=config.api.url;
	if(req.params.id && req.params.func && req.params.page){
		data['urlPath']='/' + req.params.page + '/' + req.params.func + '/' + req.params.id;
	}else if(req.params.func && req.params.page){
		data['urlPath']='/' + req.params.page + '/' + req.params.func;
	}else if(req.params.page){
		data['urlPath']='/' + req.params.page
	}
		
	data['page']=1;
	if(req.query.pageSize!=undefined) data['pageSize']=req.query.pageSize;
	
	if(req.query.page!=undefined) data['page']=req.query.page;
	if(data.pageSize==undefined) data['pageSize']=config.pagination.pageSize;
	if(data.pageCount==undefined) data['pageCount']=1;
	if(data.recordCount==undefined) data['recordCount']=0;

	// data['icon']=getMenuIcon(req,'/' + (req.params.page || ''));
	// data['pageTitle']=getMenuText(req,'/' + (req.params.page || ''));
	data['pagePath']='/' + req.params.page;
				
	data['title']=data['pageTitle'];
	data['funcTitle']='';

	return data;
}



function loadPages(moduleName,pathName) {
	var modulePages={};

	var files=fs.readdirSync(pathName);
	var pageDir, l = files.length;
	for (var i = 0; i < l; i++) {
		pageDir = path.join(pathName, files[i]);
		if(fs.statSync(pageDir).isDirectory()){
			if(files[i][0]!='_'){
				var pageFiles=fs.readdirSync(pageDir);
				if(pageFiles.findIndex((x)=>{return x==files[i]+'.js'})>-1){
					var requireFileName=path.join(pageDir, files[i] + '.js');
					if(modulePages[files[i]]==undefined) modulePages[files[i]]={};

					modulePages[files[i]]['code']=require(requireFileName);
					if(pageFiles.findIndex((x)=>{return x==files[i]+'.ejs'})>-1){
						if(modulePages[files[i]]['view']==undefined) modulePages[files[i]]['view']={};
						
						modulePages[files[i]]['view']['index']=path.join(moduleName, files[i], files[i]);
						var funcP= loadFunctionPages(pageDir,files[i]);
						for(var k in funcP){
							modulePages[files[i]]['view'][k]=funcP[k];
						}
					}
				}
			}
		}else{
			
			if(files[i]==(moduleName + '.js')){
				var requireFileName=path.join(pathName, files[i]);
				if(modulePages['index']==undefined) modulePages['index']={};
				console.log('files[i]:',files[i]);
				console.log('requireFileName:',requireFileName);

				modulePages['index']['code']=require(requireFileName);
				if(files.findIndex((x)=>{return x==moduleName +'.ejs'})>-1){
					if(modulePages['index']['view']==undefined) modulePages['index']['view']={};
					modulePages['index']['view']['index']=path.join(moduleName, moduleName + '.ejs');
				}
			}
		}
	}

	return modulePages;
	
}

function loadFunctionPages(pathName,pageName){
	var funcPageFiles=fs.readdirSync(pathName);
	var funcPages={};
	for(var i=0;i<funcPageFiles.length;i++){
		var s='';
		if(funcPageFiles[i].substr(0,pageName.length)==pageName && funcPageFiles[i].length>(pageName+'.ejs').length){
			s=funcPageFiles[i].substr(pageName.length,funcPageFiles[i].length-(pageName+'').length);
			if(s.substr(s.length-4)=='.ejs'){
				if(s[0]=='-' && s.length>1){
					s=s.substr(1,s.length-5);
					funcPages[s]=path.join(pageName,funcPageFiles[i]);
				}
			}
		}
	}

	
	
	return funcPages;
}


function localApi(req,res,dbApi){
	var dburl='';
	if(dbApi){
		if(req.query.db) dburl='/' + req.query.db + '';
	}
	
	var enpoint='';
	if(req.params.func){
		enpoint = '/' + req.params.func;
		if(req.params.param1){
			enpoint =enpoint + '/' + req.params.param1;
			if(req.params.param2){
				enpoint =enpoint + '/' + req.params.param2;
				if(req.params.param3){
					enpoint =enpoint + '/' + req.params.param3;
					
				}
			}
		}
	}
	switch(req.method){
		
		case 'POST':
			api.post(dburl + enpoint,req,req.body,(err,resp)=>{
				res.status(200).json(resp);
			});
		break;

		case 'PUT':
			api.put(dburl + enpoint,reqd,req.body,(err,resp)=>{
				res.status(200).json(resp);
			});
		break;

		case 'DELETE':
			api.delete(dburl + enpoint,req,(err,resp)=>{
				res.status(200).json(resp);
			});
		break;

		default: //default GET
			api.get(dburl + enpoint,req,req.query,(err,resp)=>{
				console.log(resp);
				res.status(200).json(resp);
			});
		break;
	}
}

var userInfo = function (req, res, next) {
	req.params.isSysUser=false;
	req.params.isMember=true;
	req.params.role='user';
	req.params.username='';
	req.params.name='';
	req.params.lastName='';
	req.params.gender='';
	if(req.query.sid){
		db.sessions.findOne({_id:req.query.sid},(err,doc)=>{
			if(!err){
				if(doc!=null){
					req.params.username=doc.username;
					req.params.name=doc.name;
					req.params.lastName=doc.lastName;
					req.params.gender=doc.gender;
					req.params.role=doc.role;
					req.params.isSysUser=doc.isSysUser;
					req.params.isMember=doc.isMember;
					return next();
				}else{
					errorPage(req,res,{code:'503',message:'Yetkisiz giris'});
					//res.redirect('/error?code=403&message=Authentication Failed&sid=' + req.query.sid);
				}
			}else{
				//res.redirect('/error?code=403&message=Authentication Failed&sid=' + req.query.sid);
				errorPage(req,res,{code:err.name,message:err.message});
			}
		});
	}else{
		return next();
	}
}