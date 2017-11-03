export default [{
  url: "/",
  method: "get",
  template: 'index',
  handler: async function(response){
    console.log(123);
    response.render({
      a:1
    })
  }
}];