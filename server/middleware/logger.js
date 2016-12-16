export default async function logger(next){
	
	console.log(next, next.toString(), 333);
	await next();
	console.log(33322)
	//return next();
}