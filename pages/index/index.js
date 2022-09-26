const Typewriter = require("typewriter-effect/dist/core");

const splash = `<span style="color: gray;">welcome to </span> orbit.`

new Typewriter('#splash', {
  strings: [splash],
  pauseFor: 999999,
  autoStart: true,
  cursor: "_",
  delay: 75,
});

