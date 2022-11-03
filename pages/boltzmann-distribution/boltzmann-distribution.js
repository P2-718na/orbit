import * as vega from "vega";
import embed from "vega-embed"


// TODO MAKE RESPONSIVE FOR MOBILES
//  ALSO CLEAN UP HTML MA PER ORA FA NIENTE

/////////////////////////////////////////////////////////////////
let fontSize = 15;
let initialEnergy = 1;
let width;
let height;
let cells = [];
let histogram;

const startButton = document.getElementById("start")
const nBins = 30;
/////////////////////////////////////////////////////////////////

const pad = (n, len) => String(n).padStart(len, ' ');

const findCellsWidth = (fontSize, charsInOneCell) => {
  const ratio = 2;
  const divWidth = window.innerWidth / 1.8

  return Math.floor(divWidth / (fontSize * charsInOneCell) * ratio);
}

const findCellsHeight = (fontSize) => {
  const ratio = .575;
  const divHeight = window.innerHeight;

  return Math.floor(divHeight / fontSize * ratio);
}

const swapFunctions = {
  adjacent: async () => {
    let donorIndex;
    let sideOffset;
    let acceptorIndex;

    do {
      donorIndex = Math.floor(Math.random() * cells.length);
      sideOffset = [+1, -1, +width, -width][Math.floor( Math.random() * 4)];

      acceptorIndex = donorIndex + sideOffset;
    } while(cells[donorIndex] == 0 || typeof cells[acceptorIndex] === "undefined");

    --cells[donorIndex];
    ++cells[acceptorIndex];

    return [donorIndex, acceptorIndex];
  },

  random: async () => {
    let donorIndex;
    const acceptorIndex = Math.floor( Math.random() * cells.length );

    do {
      donorIndex = Math.floor( Math.random() * cells.length );
    } while(cells[donorIndex] == 0);

    --cells[donorIndex];
    ++cells[acceptorIndex];

    return [donorIndex, acceptorIndex];
  }
}

const initCells = () => {
  cells = Array.from(new Array(width * height))
    .map(_ => initialEnergy);

  const html = cells
    .reduce((acc, _, i) => `${acc}<span id="cell-${i}"">${pad(initialEnergy, 3)}</span> ${i % width == (width - 1) ? "<br>" : ""}`, "")

  document.getElementById("cells").innerHTML = html
}

const displayCells = async () => {
  const highlights = []

  cells.forEach((energyLevel, id) => {
    const cell = document.getElementById(`cell-${id}`)
    const oldValue = cell.textContent

    cell.textContent = pad(energyLevel, 3);

    if (oldValue != energyLevel) {
      highlights.push(id);
    }
  })

  highlights.forEach(id => {
    const cellClassList = document.getElementById(`cell-${id}`).classList;

    cellClassList.remove("highlighted");
    setTimeout(() => cellClassList.add("highlighted"), .001);
  });
}

const displayHistogram = () => {
    // Count energies...
    const counts = Array.from(new Array(nBins)).map(_ => 0);
    cells.forEach(energyLevel => ++counts[energyLevel])

    // Build dataset...
    const data = Object.entries(counts)
      .map(([ level, quantity ]) => { return { 'Energy level': String(level), 'Number of cells': quantity } })

    // Build changeset...
    const changeset = vega.changeset()
      .remove(() => true)
      .insert(data)

    // And apply it
    histogram.view.change('Energies', changeset).run();
  }

const updateDimensions = () => {
  width = findCellsWidth(fontSize, 4);
  height = findCellsHeight(fontSize);

  initCells();
}

const updateFontSize = (value) => {
  fontSize = value;

  document.getElementById("cells").style.fontSize = `${fontSize}px`;
  updateDimensions();
}

const initInputHandlers = () => {
  const sizeDOMElement = document.getElementById("size");
  sizeDOMElement.oninput = () => {
    const value = sizeDOMElement.value;
    // This NEEDS to be called first, since it updates width and height as well..
    updateFontSize(value);

    sizeDOMElement.previousElementSibling.value = height * width;
  }
  sizeDOMElement.previousElementSibling.value = height * width;

  const energyDomElement = document.getElementById("energy");
  energyDomElement.oninput = () => {
    // Note that .value returns a string. This NEEDS to be a number!
    const value = +energyDomElement.value;
    initialEnergy = value;

    initCells();
  }

  startButton.onclick = startSimulation;

  window.onresize = init;
}

const startSimulation = () => {
  // Lock input
  Array.from(document.getElementsByClassName("control")).forEach(control => control.disabled = true);

  // Add a bit of delay to display, since we don't want to slow down the simulation...
  setInterval(displayCells, 100);
  setInterval(displayHistogram, 50);

  // And launch
  const swapFunction = swapFunctions[document.getElementById("function").value];
  setInterval(swapFunction, 0);
}

const initVega = async () => {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: {
      name: "Energies",
      values: [
        {"Energy level": String(initialEnergy), "Number of cells": 1E5}

      ]

    },
    width: "container",
    height: 400,
    background: null,
    actions: false,
    mark: {
      type: "bar",
      color: "#ffffff"
    },
    encoding: {
      x: {field: "Energy level", type: "ordinal", bin: {"maxbins": nBins}},
      y: {field: "Number of cells", type: "quantitative"},
    },
    config: {
      axis: {
        labelColor: "#fff",
        grid: false,
        titleColor: "#fff"
      }
    }

  };

  return embed("#vis", spec, { actions: false })
}


const init = async () => {
  updateFontSize(fontSize);
  initInputHandlers();

  histogram = await initVega();

  startButton.disabled = false;
}

init();
