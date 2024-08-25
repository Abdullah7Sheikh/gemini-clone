const typingform =document.querySelector(".typing");
const chatList =document.querySelector(".chat-list");
const suggestion =document.querySelectorAll(".suggest-list .sug")
const toggle =document.querySelector("#toggle");
const deletebtn =document.querySelector("#delete");

let usermessage = null

const API_KEY="";//api key
const apiurl =`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
const loadlocalstorage=()=>{
  const saveddata =localStorage.getItem("saveddata")
  const light=(localStorage.getItem("themecolor")==="light_mode")
  document.body.classList.toggle("light_mode",light)
  toggle.innerText=light ? "dark_mode":"light_mode";
  document.body.classList.toggle("hide-haeder",saveddata)
}
loadlocalstorage();
// ye create karraha hai new element message and usko return karraha hai

const createmessage =(content,...classes)=>{
    const div =document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML= content;
    return div;

    
}


// fetct karaha ye response ko Api ka based per user kia puchatha hai
const generateApiresponse =async (incomingmessage)=>{
    const Textelement = incomingmessage.querySelector(".text")
    // hum ya per post send karrahai hai user ka message ka 
  try{
      const response =await fetch(apiurl,{
          method:"POST",
          headers:{"Content-Type": "application/json"},
          body:JSON.stringify({
            contents:[{
                role:"user",
                parts:[{
                    text:usermessage
                }]
            }]
          })  
      });

const data = await response.json();
if (!response.ok) throw new Error(data.error.message)
const Apiresponse = data?.candidates[0].content.parts[0].text;
Textelement.innerText=Apiresponse
console.log(Apiresponse,Textelement);
  }catch(error){
    Textelement.innerText=error.message;
    Textelement.classList.add("error")
  }finally{
    incomingmessage.classList.remove("loading")
  }
}
// ye samaj lo ka bhai ye na loading animation dega jab thak api koi bhi response nahi karrahi ho
const showloading =() =>{
    const html =`
    <div class="message incoming loading">
    <div class="message-content">
    <img src="./images/gemini.svg" alt="Gemini IMGE" class="avatar">
    <p class="text">
       
    </p>
    <div class="load">
      <div class="load-indi"></div>  
      <div class="load-indi"></div>  
      <div class="load-indi"></div>  
    </div>
</div>
<span onclick="copymessage(this)" class="icon material-symbols-rounded">content_copy</span>
</div> 
`;
const incomingmessage = createmessage(html,"incoming","loading");

chatList.appendChild(incomingmessage);

generateApiresponse(incomingmessage);
}
const copymessage=(copyIcon)=>{
  const messageText =copyIcon.parentElement.querySelector(".text").innerText;
navigator.clipboard.writeText(messageText);
copyIcon.innerText ="done";
setTimeout(() => copyIcon.innerText ="content_copy",1000 )
}
// is ka kam hai ye ka srif ye handle out going chat ko srif dekraha hai
const  outgoingchat=()=>{
usermessage =typingform.querySelector(".typing-input").value.trim() ||usermessage;
if (!usermessage ) return;//agar ye exit karta hai tu koi message nahi huga
const html =`
<div class="message-content">
<img src="./images/user.jpg" alt="User images" class="avatar">
<p class="text">
   
</p>
</div>
`;
const outgoingmessage = createmessage(html,"outgoing");
outgoingmessage.querySelector(".text").innerText =usermessage;
chatList.appendChild(outgoingmessage);
typingform.reset(); //ye bhai sara clear kardega
setTimeout(showloading,500); // ye dekhai ga loading animation thora delay ka bad
}
toggle.addEventListener("click",()=>{
 const Lighting= document.body.classList.toggle("light_mode");
 localStorage.setItem("themecolor",Lighting ? "light_mode":"dark_mode")
 toggle.innerText=Lighting ? "dark_mode":"light_mode";
})
deletebtn.addEventListener("click",()=>{
  if (confrim("are your sure deleta all message")) {
    
  }
})
suggestion.forEach(suggest =>{
  suggest.addEventListener("click",()=>{
    usermessage =suggest.querySelector(".text").innerText;
    outgoingchat()
  })
})
typingform.addEventListener("submit",(e)=>{
    e.preventDefault();
    
   outgoingchat() 
})
