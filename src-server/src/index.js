const { write, onMessage } = require('./communication.js')

onMessage((line) => {
  write(`read ${line}`)
})

setInterval(() => {
  write(`[${new Date().toLocaleTimeString()}] new message`)
}, 500)