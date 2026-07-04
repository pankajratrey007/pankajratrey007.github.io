import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 STORE API KEY HERE (NOT IN FRONTEND)
const API_KEY = "sk-proj-BBkmVYhFz6XeJVpvZjhxhAtodlc6IT4T3HPvc9F6LNMsBPKOInua0noS
  ERKe_3lsjoyOBnqb4oT3BlbkFJO6Pr75hzzJuvBhhzQD10hUTJpj0KR0cIRzzekCXmr20UrjDg2Zz3r
  ul2z7mBJOu0P7TLcsy4sA";

app.post("/chat", async (req,res)=>{
  const userMsg = req.body.message;

  try{
    const response = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model:"gpt-4o-mini",
        messages:[
          {role:"system", content:"You are a smart, friendly AI like ChatGPT."},
          {role:"user", content:userMsg}
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  }catch(err){
    res.json({ reply:"Error AI not working" });
  }
});

app.listen(3000, ()=>console.log("Server running on port 3000"));
