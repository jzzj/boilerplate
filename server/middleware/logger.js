var fs     = require('fs');
var util   = require('util');
var moment = require('moment');

export default async function (next){
  const start = +new Date();
  await next;

  const length = this.length ? this.length.toString() : '-';
  const date = moment().format('YYYY/MM/D HH:mm:ss ZZ');
  const realIp = this.header["x-forwarded-for"] || this.header["x-real-ip"] || this.ip;
  const now = +new Date();
  let requestBody = this.request.body || "";
  if(requestBody){
    requestBody = JSON.stringify(requestBody);
  }

  requestBody = requestBody.slice(0, 1024*2);
  const userInfo = "";
  console.info("---ACCESSLOG ["+ date +"] -", "[STATUS", this.status+"]", "[METHOD", this.request.method+"]",
        "[URL", this.request.href+"]", "[USER-AGENT", this.header["user-agent"]+"]",
        "[IP", (realIp)+"]",
        "[REQUEST BODY", requestBody, "]",
        "[RESPONSE-LENGTH", length+"]",
        "[RESPONSE-TIME", (now-start)+"ms]",
        "[USER-INFO", userInfo, "]---"
      );
};
