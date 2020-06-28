var calismaSayisi=0;
var express = require('express');

function calistir(){
	console.log(calismaSayisi,'language collector running.',(new Date()).toTimeString());
	
	if(calismaSayisi>=3){
		console.log('language collector bitti');
		return;
	}else{
		calismaSayisi++;
		setTimeout(()=>{
			calistir();
		},1000);
	}
}

calistir();