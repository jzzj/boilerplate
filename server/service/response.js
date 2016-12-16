export default class Response{
	constructor(context){
		this.context = context;
	}

	sendJSON(data){
		this.context.type = "application/json";
		this.context.body = JSON.stringify(data);
	}

	render(){
		
	}
}