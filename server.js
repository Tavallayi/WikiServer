const { mwn } = require('mwn');
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')

var baseurl = "http://45.15.200.79"

const app = express()
const port = process.env.PORT || 4000
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors({
    origin: '*'
}));

app.use(express.json())

const importPageFromWikipedia = async function(pageTitle, username, password){
    var content = await readFromWikipedia(pageTitle);
    await savePage(username, password, pageTitle, content);
}
const savePage = async function (username, password, pageTitle, content) {
    const bot = await mwn.init({
        apiUrl: 'http://45.15.200.79/wikis/marine/api.php',

        // Can be skipped if the bot doesn't need to sign in
        username: username,
        password: password,
    });
    await bot.save(pageTitle, content, 'Edit summary');
}

const readFromWikipedia = async function (pageTitle) {
    const bot = new mwn({
        apiUrl: 'https://fa.wikipedia.org/w/api.php',

    });
    var page = await bot.read(pageTitle);
    return page.revisions[0].content;
}


app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/savePage', async(req, res) => {
    console.log(req.body.pageTitle, req.body.username, req.body.password);
    var body = `<html><body>Page "${req.body.pageTitle} was created.<a href="/">Home</a></body></html>`
    try{
     await importPageFromWikipedia(req.body.pageTitle, req.body.username, req.body.password);
    }catch(e){
        var body = `<html><body>Createing page "${req.body.pageTitle} has error.<br/>${e}<a href="/">Home</a></body></html>`

    }
    res.send(body);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})