import express, { Request, Response } from 'express';
import { getToken } from './auth/getToken';
import { getCollections } from './get/collections'
import { getComicCategories, getComicsBlock, getComicsEps, getComicsInfo, getComicsPics } from './get/comics';
import { getStorage } from './get/storage';

const PORT = 3000;

var app = express();
app.use(express.static('public'));
app.get("/*", main);



var listener = app.listen(PORT, function () {
    console.log('Your app is listening on port ' + JSON.stringify(listener.address()));
});

async function main(request: Request, response: Response): Promise<any> {
    response.setHeader('Access-Control-Allow-Origin', '*');

    var pathname = request.path;

    if (pathname == "/flushToken") {
        var token: Token = await getToken(true);
        response.send("flush token ok");
        return;
    }

    var token: Token = await getToken();
    //console.log(`get token: ${token.data.token}`);
    //return;

    switch (pathname) {
        case "/collections":
            var coll = await getCollections(token.data.token);
            response.send(coll);
            return;
        case "/comics/categories":
            var categories = await getComicCategories(token.data.token);
            response.send(categories);
            return;
        case "/comics/block":
            var page = request.query.page;
            var c = request.query.c;
            var sort = request.query.s;

            if (page && c && (sort == "ua" || sort == "dd" || sort == "da" || sort == "ld" || sort == "vd")) {
                var comicsList = await getComicsBlock(token.data.token, parseInt(page.toString()), encodeURI(c.toString()), sort);
                response.send(comicsList);
            } else {
                response.status(500).send(`no page:${page}/c:${c}/s:${sort}`);
            }
            return;
        case "/comics/info":
            var bookId = request.query.bookId;

            if (bookId) {
                var comics = await getComicsInfo(token.data.token, bookId.toString());
                response.send(comics);
            } else {
                response.status(500).send("null bookId");
            }
            return;
        case "/comics/eps":
            var bookId = request.query.bookId;
            var page = request.query.page;
            console.log(`bookId:${bookId},page:${page}`);

            if (bookId && page) {
                var eps = await getComicsEps(token.data.token, bookId.toString(), page.toString());
                response.send(eps);
            } else {
                response.status(500).send(`no bookId:${bookId} or page:${page}`);
            }
            return;
        case "/comics/pics":
            var bookId = request.query.bookId;
            var page = request.query.page;
            var epsId = request.query.epsId;
            console.log(`bookId:${bookId},epsId:${epsId},page:${page}`);

            if (bookId && page && epsId) {
                var pics = await getComicsPics(token.data.token, bookId.toString(), epsId.toString(), page.toString());
                response.send(pics);
            } else {
                response.status(500).send(`no bookId:${bookId},epsId:${epsId},page:${page}`);
            }
            return;
        case "/storage":
            var fileServer = request.query.fileServer;
            var path = request.query.path;

            if (path && fileServer) {
                var res = await getStorage(token.data.token, fileServer.toString(), path.toString());
                var headers = res.headers;
                headers.forEach((value, name) => {
                    response.setHeader(name, value);
                })
                response.send(await res.buffer());
            } else {
                response.status(500).send("no fileServer or path");
            }
            return;
    }


    //var coll = await getCollections(token.data.token);

    response.send(pathname);
    return;
}



