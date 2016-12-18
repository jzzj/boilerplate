async function logger(){
	
	await new Promise(r=>{
		setTimeout(function(){
			console.log('some log');
			r();
		}, 1000);
	});
	//return next();
}

export default logger;