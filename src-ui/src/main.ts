import { invoke } from '@tauri-apps/api';
import {  Command } from '@tauri-apps/api/shell';
import { Event as TauriEvent, listen } from '@tauri-apps/api/event';
import { appWindow,WebviewWindow } from '@tauri-apps/api/window';
function addMessage(div:any, message:any) {
  // const p = document.createElement('p')
  let v = div.value;
  div.value = message
}

const backendDiv = document.getElementById('backend')
listen('message', (event) => {
  addMessage(backendDiv, event.payload)
})

const frontendDiv = document.getElementById('frontend')
// const { Command } = window.__TAURI__.shell
const command = Command.sidecar('binaries/appx')
command.on('close', (data:any) => {
  addMessage(
    frontendDiv,
    `command finished with code ${data.code} and signal ${data.signal}`
  )
})
command.on('error', (error:any) =>
  addMessage(frontendDiv, `command error: "${error}"`)
)
command.stdout.on('data', (line:any) =>
  addMessage(frontendDiv, `command stdout: "${line}"`)
)
command.stderr.on('data', (line:any) =>
  addMessage(frontendDiv, `command stderr: "${line}"`)
)
command.spawn()


const $ = document.querySelector.bind(document);

document.addEventListener("DOMContentLoaded", async function () {
  // get the elements
  const helloEl = $("div.hello") as HTMLElement;
  const counterButtonEl = $("counter-button") as HTMLElement;
  const counterResultEl = $("counter-result") as HTMLElement;
  const pingEl = $("backend-ping") as HTMLElement;

  // listen backend-ping event
  listen("backend-ping", function (evt: TauriEvent<any>) {
    pingEl.classList.add("on");
    setTimeout(function () {
      pingEl.classList.remove("on")
    }, 500);
  })

  // counter button click
  counterButtonEl.addEventListener("click", async function () {
    const result = await invoke("add_count", { num: 3 }) as string;
    console.log(result)
    counterResultEl.textContent = result;
  });

  // hello click
  helloEl.addEventListener("click", async function () {
    const result = await invoke("hello_world") as string;
    helloEl.textContent = result;
    // loading embedded asset:
    // const webview = new WebviewWindow('theUniqueLabel', {
    //   url: 'path/to/page.html'
    // });
    // alternatively, load a remote URL:
    const webview = new WebviewWindow('linked_learning', {
      url: 'https://www.linkedin.com/learning-login'
    });

    webview.once('tauri://created', function () {
    // webview window successfully created
    });
    webview.once('tauri://error', function (e) {
    // an error happened creating the webview window
    });

    // emit an event to the backend
    await webview.emit("some event", "data");
    // listen to an event from the backend
    const unlisten = await webview.listen("event name", e => {});
    unlisten();
    setTimeout(function () {
      helloEl.textContent = "Click again";
    }, 1000);
  });

});