import test from "node:test";import assert from "node:assert/strict";import {app} from "../src/app.js";
test("health endpoint responds",async()=>{const server=app.listen(0);try{const a=server.address();const r=await fetch(`http://127.0.0.1:${a.port}/api/health`);assert.equal(r.status,200);assert.equal((await r.json()).status,"ok");}finally{server.close();}});
