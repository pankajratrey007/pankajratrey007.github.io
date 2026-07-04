import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const API_KEY = "sk-proj-BBkmVYhFz6XeJVpvZjhxhAtodlc6IT4T3HPvc9F6LNMsB
  PKOInua0noSERKe_3lsjoyOBnqb4oT3BlbkFJO6Pr75hzzJuvBhhzQD10hUTJpj0KR0c
  IRzzekCXmr20UrjDg2Zz3rul2z7mBJOu0P7TLcsy4sA";

// 🧠 store memory
let history = [
  {role:"system",content:"You are a smart, friendly AI like ChatGPT."}
];

app.get("/", (req,res)=>{
res.send(`
<!DOCTYPE html>
<html>
<head>
<title>AI Chat</title>

<style>
body{
  margin:0;
  font-family:sans-serif;
  background:linear-gradient(135deg,#0f172a,#1e293b);
  color:white;
}

h2{
  text-align:center;
  padding:10px;
}

#chat{
  height:75vh;
  overflow:auto;
  padding:15px;
}

.msg{
  margin:10px 0;
  padding:10px;
  border-radius:10px;
  max-width:70%;
}

.user{
  background:#22c55e;
  margin-left:auto;
}

.bot{
  background:#334155;
}

#box{
  display:flex;
  padding:10px;
  background:#020617;
}

input{
  flex:1;
  padding:10px;
  border:none;
}

button{
  padding:10px;
  background:#22c55e;
  border:none;
  color:white;
  cursor:pointer;
}
</style>

</head>
<body>

<h2>🤖 AI Chat (Developed by Pankaj Ratrey)</h2>

<div id="chat"></div>

<div id="box">
<input id="msg" placeholder="Ask anything..."/>
<button onclick="send()">Send</button>
</div>

<script>

async function send(){
  let msg=document.getElementById("msg").value.trim();
  if(!msg) return;

  let chat=document.getElementById("chat");

  chat.innerHTML+=\`<div class="msg user">👤 \${msg}</div>\`;
  chat.innerHTML+=\`<div class="msg bot" id="load">🤖 Typing...</div>\`;

  chat.scrollTop=chat.scrollHeight;

  let res=await fetch("/chat",{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({message:msg})
  });

  let data=await res.json();
  document.getElementById("load").remove();

  typeText(data.reply);
  document.getElementById("msg").value="";
}

function typeText(text){
  let i=0;
  let chat=document.getElementById("chat");

  let div=document.createElement("div");
  div.className="msg bot";
  chat.appendChild(div);

  let inter=setInterval(()=>{
    div.innerHTML="🤖 "+text.slice(0,i);
    i++;
    chat.scrollTop=chat.scrollHeight;

    if(i>text.length) clearInterval(inter);
  },15);
}

</script>

</body>
</html>
`);
});

app.post("/chat", async (req,res)=>{
  try{
    history.push({role:"user",content:req.body.message});

    const response = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+API_KEY
      },
      body: JSON.stringify({
        model:"gpt-4o-mini",
        messages:history
      })
    });

    const data = await response.json();

    let reply = data?.choices?.[0]?.message?.content || "⚠️ No response";

    history.push({role:"assistant",content:reply});

    res.json({reply});

  }catch(e){
    res.json({reply:"⚠️ AI error / check API"});
  }
});

app.listen(3000,()=>console.log("🔥 http://localhost:3000"));
