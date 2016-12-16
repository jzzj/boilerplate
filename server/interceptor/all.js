export default {
	test: url=>true, // => intercept all requests
	handler: function(){
		this.set('Cache-Control', 'no-cache');
	}
}