const http = require("http");
const axios= require('axios');
const fs = require("fs");
const Handlebars = require("handlebars");


const url_proveedores="https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const url_clientes = 'https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json';

const saveAndStore =(info,name)=>{return new Promise((resolve,reject)=>{
    var content=JSON.stringify(info);
    fs.writeFile(name+".json",content,"utf-8",(err)=>{
        if(err) reject(err);
        fs.readFile(name + ".json", "utf-8", (err, data) => {
            if (err) throw err;
            resolve(JSON.parse(data));
        });
    });
})};

const getInfo =(url,name)=>{return new Promise((resolve,reject)=>{axios.get(url).then((info)=>saveAndStore(info.data,name)).then(resolve).catch((err)=>{reject(err)});});};

const compileAndSend=(info,res,who)=>{
    console.log(who=="proveedores");
    var content ={who:who,info:info,proveedor:who=="proveedores"};
    fs.readFile('index.html','utf-8',(err,data)=>{
        let base = data;
        let template= Handlebars.compile(base);
        res.end(template(content));
    });
};


http.createServer((req,res)=>{
    var url =req.url;
    if(url=="/proveedores")
    {
        getInfo(url_proveedores,"proveedores").then((info)=>compileAndSend(info,res,"proveedores")).catch((err)=>{res.end(err)});
    }
    else if(url=="/clientes")
    {
        getInfo(url_clientes,"clientes").then((info)=>compileAndSend(info,res,"clientes")).catch((err)=>{res.end(err)});
    }
    else
    {
        res.end("<h1>Error 404</h1>")
    }
}).listen(8081);