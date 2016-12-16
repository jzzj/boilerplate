export default [{
	url: "/",
	method: "get",
	middleware: [],
	handler: async function(){
		console.log(333);
		this.body = "welcome to home";
	}
}, {
	url: "/long",
	handler: async function(response){
		await new Promise(resolve=>{
			setTimeout(resolve, 2000);
		});
		response.sendJSON('this message gonna take your long time to get see it.');
	}
}];