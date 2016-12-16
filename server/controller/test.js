export default {
	url: "/test",
	method: "get",
	middleware: [],
	handler: async function(response){
		this.body = "test content";
	}
};