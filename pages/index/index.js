import "./index.css";

const Typewriter = require("typewriter-effect/dist/core");

const splash = `<span style="color: gray;">welcome to </span> orbit.`

new Typewriter('#splash', {
  strings: [splash],
  pauseFor: 999999,
  autoStart: true,
  cursor: "_",
  delay: 75,
});

console.log(localStorage.getItem("firstTime"))
if (localStorage.getItem("firstTime") !== null) {
  const libraryAnimated = document.getElementById("library");
  libraryAnimated.className = ""
}

localStorage.setItem("firstTime", "false");