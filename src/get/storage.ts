import { headers } from "../config";
import { getSign } from "../auth/getSign";
import { Response } from "node-fetch";
import fetch from "node-fetch";

export async function getStorage(token: string, fileServer: string, path: string): Promise<Response> {

    console.log(`get path:${path}`);

    headers.time = (new Date().getTime() / 1000).toFixed(0);
    //headers.signature = getSign(`${path}`, headers.time, headers.nonce, "GET");
    headers.authorization = token;

    console.log(headers.time);
    console.log(headers.signature);
    console.log(headers.authorization);
    var res = await fetch(`${fileServer}/static/${path}`, {
        //headers
    })
    //console.log(res.headers);

    return res;
}