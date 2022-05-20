import { headers, picacg } from "../config";
import { getSign } from "./getSign";
import fetch from "node-fetch";
import fs from "fs";

export async function getToken(): Promise<Token> {
    console.log("getting token");
    // var tokenT: Token | undefined;
    try {
        var data = fs.readFileSync("token.json", { encoding: "utf-8" })

        var tokenT = JSON.parse(data);
        console.log("get local ok");
        if (tokenT)
            return tokenT;
    } catch (error) {
        //throw error
    }

    const request_url = picacg.Url + "auth/sign-in";
    console.log(request_url);

    headers.time = (new Date().getTime() / 1000).toFixed(0);
    console.log(headers.time);

    headers.signature = getSign("auth/sign-in", headers.time, headers.nonce, "POST") // hmacSHA256(key, picacg.secretKey).toString();
    console.log(headers.signature);

    const body = {
        "email": "feilongproject",
        "password": "1478914789"
    }

    var token: Token = await fetch(request_url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
    }).then(async (res) => {
        var text = await res.text();
        //await PICACG.put("Token", text)
        return text;
    }).then((text) => {
        return JSON.parse(text);
    })
    console.log(token.data.token);

    fs.writeFile("token.json", JSON.stringify(token), (err) => {
        if (err)
            throw err;
    })
    console.log("get token finish");
    return token;

}