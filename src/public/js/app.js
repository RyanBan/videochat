const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#msg");
const frontSocket = new WebSocket(`ws://${window.location.host}`);

function formatMessage(type, payload){
    const msg = { type, payload };
    return JSON.stringify(msg);
}

frontSocket.addEventListener("open",  () => {
    console.log("Connected to Server BOOM");
})

frontSocket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

frontSocket.addEventListener("close", ()=> {
    console.log("Disconnected fom server");
})

function handleMsgSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    frontSocket.send(formatMessage("new_message", input.value));
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    frontSocket.send(formatMessage("nickname", input.value));
}

nickForm.addEventListener("submit", handleNickSubmit)
messageForm.addEventListener("submit", handleMsgSubmit)