async function logger(next){
    await next;
	console.info((new Date()).toLocaleString(), "Request Info -", "[METHOD", this.request.method+"]",
        "[URL", this.request.href+"]", "[USER-AGENT", this.header["user-agent"]+"]", "[IP", this.ip+"]",
        "[REQUEST BODY", this.request.body, "]");
}

export default logger;