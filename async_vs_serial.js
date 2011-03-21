#!/usr/bin/env node
//
// serialize - chain functions together for synchronous processing
//
var sys = require('sys');



function slowfunc(msg, ms, done)
{
    var t0=new Date().getTime();
    console.log(">"+msg);

    setTimeout(function() { 
        var td=new Date().getTime()-t0;
        console.log("<"+msg+" took "+td+"ms");
        done(); 
    }, ms);
}


function do_aaa(params, next)
{
    slowfunc("aaa", 220, next);
}

function do_bbb(params, next)
{
    slowfunc("bbb",  50, next);
}

function do_ccc(params, next)
{
    slowfunc("ccc", 120, next);
}




var serial = false;
if (process.argv.length>2 && process.argv[2]=="serial")
    serial=true;

console.log("RUNNING "+(serial? "SERIAL" : "ASYNC"));

var info = {data:0};

if (!serial)
{
    // test async, parallel

    function empty() {};
    var info = {};

    do_aaa(info, empty);
    do_bbb(info, empty);
    do_ccc(info, empty);
}
else
{
    // test serialized

    var work_q = [ do_aaa, do_bbb, do_ccc ];


    function next()
    {
        //pop from front, execute, return
    
        var work = work_q.shift();
        if (work)
            work(info, next);    
    }

    next();         // start the queue

}
