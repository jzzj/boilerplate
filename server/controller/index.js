export default [{
  url: "/",
  method: "get",
  template: 'index',
  handler: async function(response){
    response.render({
      a:1
    });
    console.log(this.status);
  }
}];