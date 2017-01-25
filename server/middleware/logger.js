async function logger(next){
    await next;
	console.info("Request Info -", "[METHOD", this.request.method+"]",
        "[URL", this.request.href+"]", "[USER-AGENT", this.header["user-agent"]+"]", "[IP", (this.header["x-forwarded-for"] || this.header["x-real-ip"] || this.ip)+"]",
        "[REQUEST BODY", this.request.body, "]");
}

export default logger;