import { headers, picacg } from "../config";
import { getSign } from "./getSign";
import fetch from "node-fetch";
import fs from "fs";

export async function getToken(force?: boolean): Promise<Token> {
    console.log("getting token");

    var _account = fs.readFileSync("account.json", { encoding: "utf-8" });
    var account: Account = JSON.parse(_account);
    console.log("get local account ok");
    if (account.token && !force)
        return account.token;
    console.log("startting fetch token");

    const request_url = picacg.Url + "auth/sign-in";
    console.log(request_url);

    headers.time = (new Date().getTime() / 1000).toFixed(0);
    console.log(headers.time);

    headers.signature = getSign("auth/sign-in", headers.time, headers.nonce, "POST");
    console.log(headers.signature);


    var token: Token = await fetch(request_url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ email: account.email, password: account.password }),
    }).then(async (res) => {
        var text = await res.text();
        return text;
    }).then((text) => {
        return JSON.parse(text);
    })
    account.token = token;
    console.log(token.message);

    fs.writeFileSync("account.json", JSON.stringify(account));
    console.log("get token finish");
    return token;

}