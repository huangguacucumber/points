// 数组去重复
function unique(arr){            
    for(var i=0;i<arr.length;i++){
        for(var j=i+1;j<arr.length;j++){
            //第一个与第二个相同的话，删除第二个
            if(arr[i]==arr[j]){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}
function json(mod,file,main){
    const fs = require('fs');
    switch(mod){
        case "add":
            fs.readFile(file,function(err,data){
                if(err){
                    return console.error(err);
                }
                var person = data.toString();
                person = JSON.parse(person);
                person.data.push(main);
                person.total = person.data.length;
                var str = JSON.stringify(person);
                fs.writeFile(file,str,function(err){
                    if(err){
                        console.error(err);
                    }
                })
            })
            break;
    }
}
function conver(num,results,group){
    temp=[]
    for(var i=0;i<parseInt(results.length/num);i++){
        temp.push({zhou_id:i+1,points:[]})
        for(var g=0;g<group.length;g++){
           temp[i]["points"][g]=0
           for(var j=0;j<num;j++){
               temp[i]["points"][g]+=parseFloat(results[i*num+j]["points"][g])
           }
        }
    }
    return(temp)
}
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const fs=require("fs")
var server=app.listen(8888, function () {
    console.log("服务运行在 http://localhost:8888/")
})
app.get('/welcome',(req,res)=>{
    var person=""
    fs.readFile("./config.json",function(err,data){
        if(err){
            console.error(err);
        }
        person = data.toString();
        person = JSON.parse(person);
        if(person.group.length==0){
            res.send(`
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>欢迎</title>
                <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js"></script>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css">
                <script>
                    var text=""
                    function setting(){
                        document.getElementsByTagName("body")[0].innerHTML='<div class="setting"><div class="container"><h1>设置</h1><h3>您将在输入框内完成设置。</h3><h3>您需要注意以下几点：</h3><ol><li>将小组成员以<b>英文逗号(,)</b>分隔</li><li>将每个小组以<b>英文分号(;)</b>分割</li><li>每个小组的<b>第一位</b>成员为<b>组长</b></li><li>请在<b>一行</b>内完成它，请不要使用<b>换行</b></li><li>系统会在您设置完毕后请您确认，如果您在此环节看见<b>","</b>或<b>";"</b>，请返回重新核对设置。</li></ol><p>例如：<br/>&nbsp;&nbsp;&nbsp;&nbsp;张三组有张三及李四，张三是组长<br/>&nbsp;&nbsp;&nbsp;&nbsp;王五组有王五及赵六，王五是组长<br/>您应该输入这些内容：<br/>&nbsp;&nbsp;&nbsp;&nbsp;张三,李四;王五,赵六</p><h3>请您仔细阅读它，如果准备就绪，您可以即刻开始设置。</h3><div class="input-group input-group-lg"><input type="text" class="form-control" aria-describedby="sizing-addon1" id="group" style="width:70vw"></div><p><a class="btn btn-primary btn-lg" href="#startSetting" role="button" onclick="settingOK()" style="margin-top:10px">完成设置</a></p></div></div>'
                    }
                    function settingOK(){
                        var output="<ul>"
                        text=document.getElementById("group").value.split(";")
                        for(var i=0;i<text.length;i++){
                            text[i]=text[i].split(",")
                        }
                        for(var i=0;i<text.length;i++){
                            output+="<li>"+text[i][0]+"组<ul>"
                            for(var j=0;j<text[i].length;j++){
                                output+='<li>'+text[i][j]+'</li>'
                            }
                            output+="</ul></li>"
                        }
                        output+="</ul>"
                        document.getElementsByTagName("body")[0].innerHTML='<div class="check"><div class="container"><h1>校验</h1><h3>系统已处理完毕，请校验：</h3>'+output+'<p><a class="btn btn-primary btn-lg" href="#setting" role="button" onclick="setting()" style="margin-top:10px;float:left">返回</a></p><p><a class="btn btn-primary btn-lg " href="#check" role="button" onclick="check()" style="margin-top:10px;margin-left:10px;float:left">确认无误</a></p></div></div>'
                    }
                    function check(){
                        $.ajax({
                            type : "POST",
                            url : "http://localhost:8888/group",
                            data : {
                                group:JSON.stringify(text)
                            },
                            success : function() {
                                window.location.href="http://localhost:8888/"
                            }
                        })
                    }
                </script>
            </head>
            <body>
                <div class="welcome">
                    <div class="container">
                        <h1>欢迎使用！</h1>
                        <p>要想立刻使用小组分数统计器，您必须先设置您的小组成员信息。</p>
                        <p><a class="btn btn-primary btn-lg" href="#setting" role="button" onclick="setting()">立即设置</a></p>
                    </div>
                </div>
            </body>
            </html>
            `)
        }else{
            res.send(`<script>window.location.href="http://localhost:8888/"</script>`)
        }
    })
})
app.get('/', (req, res)=>{
    fs.readFile("./config.json",function(err,data){
        if(err){
            console.error(err);
        }
        var personConfig = data.toString();
        personConfig = JSON.parse(personConfig);
        if(personConfig.group.length==0){
            res.send(`<script>window.location.href="http://localhost:8888/welcome"</script>`)
        }else{
            /* 小组设置 */
            var group = personConfig.group
            fs.readFile("./points.json",function(err,data){
                if(err){
                    console.error(err);
                }
                personPoints = data.toString();
                personPoints = JSON.parse(personPoints);
                var convr=1
                var re = /^[0-9]+$/ ;

                if(req.query.conver&&re.test(req.query.conver)){
                    convr=req.query.conver
                }
                var results = conver(convr,personPoints.data,group)
                var total = personPoints.total
                // 总分计算
                var summation=[]
                for(var i=0;i<group.length;i++){
                    summation[i]=0
                    for(var j=0;j<results.length;j++){
                        summation[i]+=parseFloat(results[j]["points"][i])
                    }
                }
                // 将总分加入周分内
                results.push({zhou_id:"总分",points:[]})
                for(var i=0;i<group.length;i++){
                    results[results.length-1]["points"][i]=summation[i].toString()
                }
                // 数组转格式&去重&从大到小排序
                var data=[]
                for(var i=0;i<results.length;i++){
                    data.push([])
                    for(var j=0;j<group.length;j++){
                        data[i][j]=parseFloat(results[i]["points"][j])
                    }
                    data[i]=unique(data[i]).sort((a,b) => a-b).reverse()
                }
                var rank=[]
                var rankid=[]
                // 周次循环
                for(var week=0;week<results.length;week++){
                    rank.push([])
                    rankid.push([])
                    // 名次循环
                    for(var num=0;num<group.length;num++){
                        rank[week].push([])
                        rankid[week].push([])
                        // 小组循环
                        for(var x=0;x<group.length;x++){
                            // 如果小组分数等于名次分数，加入名单
                            if(data[week][num]==results[week]["points"][x]){
                                rank[week][num]+=`${group[x][0]}组 `
                                rankid[week][num]+=`${x} `
                            }
                        }
                    }
                }
                // 写表格
                var table="";
                var temp=[``,``];
                for(var i=0;i<results.length;i++){
                    for(var j=0;j<group.length;j++){
                        temp[0]+=`<td>${results[i]["points"][j]}</td>`
                        temp[1]+=`<td>${rank[i][j]}</td>`
                    }
                    table+=
                    `
                    <tr>
                        <td>${results[i].zhou_id}</td>
                        ${temp[0]}
                        ${temp[1]}
                    </tr>
                    `
                    temp=[``,``]
                }
                // 写按钮
                var button="";
                for(var i=0;i<results.length-1;i++){
                    button+=`<button type="button" style="margin-left:10px;margin-bottom:10px;" class="btn btn-outline-info" onclick="check(${i})">${(i+1)}</button>`;
                }
                button+=`<button type="button" class="btn btn-outline-info" onclick="check(${results.length-1})" style="margin-left:10px;margin-bottom:10px;">总分</button>`;
                temp=[``,``,``]
                for(var i=0;i<group.length;i++){
                    temp[0]+=`<td>${group[i][0]}组</td>`
                    temp[1]+=`<td>第${i+1}名</td>`
                    temp[2]+=`
                        <div class="input-group mb-3" style="width:70vw;">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon${i}">${group[i][0]}组</span>
                            </div>
                            <input type="text" name="${i}" id="${i}" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon${i}">
                        </div>
                        `
                }
                res.send(
                    `
                    <!DOCTYPE html>
                        <html lang="zh-CN">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>分数统计</title>
                                <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
                                <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js"></script>
                                <script src="https://cdn.jsdelivr.net/npm/tableexport.jquery.plugin@1.10.26/tableExport.min.js"></script>
                                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css">
                                <script>
                                    function convr(){
                                        var cvr=document.getElementById("Convr").value
                                        var re = /^[0-9]+$/ ;
                                        if(re.test(cvr)){
                                            window.location.href="http://localhost:8888/?conver="+cvr
                                        }
                                    }
                                    function check(id){
                                        var rank=${JSON.stringify(rankid)}
                                        var group=${JSON.stringify(group)}
                                        var win = []
                                        var text=""
                                        win[0]=rank[id][0].split(' ')
                                        win[1]=rank[id][1].split(' ')
                                        for(var i=0;i<win[0].length-1;i++){
                                            text+='\\r\\n    '+group[parseInt(win[0][i])][0]+'组：\\r\\n'
                                            for(var j=0;j<group[parseInt(win[0][i])].length;j++){
                                                text+='        '+group[parseInt(win[0][i])][j]+'\\r\\n'
                                            }
                                        }
                                        for(var i=0;i<win[1].length-1;i++){
                                            text+='\\r\\n    '+group[parseInt(win[1][i])][0]+'组：\\r\\n'
                                            for(var j=0;j<group[parseInt(win[1][i])].length;j++){
                                                text+='        '+group[parseInt(win[1][i])][j]+'\\r\\n'
                                            }
                                        }
                                        if(id==rank.length-1){
                                            document.getElementById("zis").innerHTML='前'+(id)+'次优胜小组是：'+text;
                                            document.getElementById("anyweek").innerHTML='前'+id+'次优胜小组是：'+text;
                                        }else{
                                            document.getElementById("zis").innerHTML='本次优胜小组是：'+text;
                                            document.getElementById("anyweek").innerHTML='第'+(id+1)+'次优胜小组是：'+text;
                                        }
                                    }
                                </script>
                            </head>
                            <body>
                                <table border="1" class="table table-striped table-bordered table-hover" id="tbl">
                                    <tr>
                                        <td>序次</td>
                                        ${temp[0]}
                                        ${temp[1]}
                                    </tr>
                                    ${table}
                                </table>
                                <div>
                                    <br />
                                    <h3 style="margin-left:10px;">下一周：第${total+1}周<h3>
                                    <div class="input-group mb-3" style="width:300px;margin-left:10px;">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">每</span>
                                        </div>
                                        <input type="text" class="form-control" id="Convr" aria-label="${convr}" placeholder="${convr}">
                                        <div class="input-group-append">
                                            <span class="input-group-text">周统计1次</span>
                                        </div>
                                        <button type="button" class="btn btn-info" style="margin-left:10px" onclick="convr()">确定</button>
                                    </div>
                                    <form action="/add" method="post" style="margin-left:10px;">
                                        ${temp[2]}
                                        <input type="submit" class="btn btn-primary" value="提交">
                                    </form>
                                </div>
                                <div>
                                <button type="button" class="btn btn-outline-primary" id="excel" style="margin-left:10px;margin-bottom:10px;">导出表格</button><br />
                                ${button}
                                </div>
                                <div class="input-group">
                                    <textarea class="form-control" style="margin-left:10px;float:left;" name="zis" id="zis" cols="20" rows="20"></textarea>
                                    <textarea class="form-control" style="margin-left:10px;margin-right:10px;float:left;" name="anyweek" id="anyweek" cols="20" rows="20"></textarea>
                                </div>
                                <script>
                                    $("#excel").click(function(){
                                        $("#tbl").tableExport({
                                            type:"excel",
                                            fileName:"表格导出_1624160554276"
                                        })
                                    })
                                </script>
                            </body>
                        </html>
                    `
                )
            })
        }
    })
})
app.post('/add',urlencodedParser,function (req, res) {
    fs.readFile("./config.json",function(err,data){
        personConfig = data.toString();
        personConfig = JSON.parse(personConfig);
        var group = personConfig.group
        fs.readFile("./points.json",function(err,data){
            personPoints = data.toString();
            personPoints = JSON.parse(personPoints);
            var parm={
                zhou_id:parseInt(personPoints.total)+1,
                points:[]
            }
            for(var i=0;i<group.length;i++){
                parm.points.push(req["body"][`${i}`])
            }
            json("add","./points.json",parm)
            console.log(`增加了一条数据：\n${JSON.stringify(parm)}`)
            res.send(`<script>window.location.href="http://localhost:8888/"</script>`)
        })
    })
})
app.post('/group',urlencodedParser,function (req, res) {
    const fs = require('fs');
    var parm={
        group: JSON.parse(req["body"]["group"])
    }
    var str=JSON.stringify(parm)
    fs.writeFile("./config.json",str,function(err){
        if(err){
            console.error(err);
        }
        console.log(`更改了小组配置：\n${req["body"]["group"]}`);
    })
    res.send(`<script>window.location.href="http://localhost:8888/"</script>`)
})