import * as vega from "vega";
import embed from "vega-embed"
import gaussianRandom from "../../src/utils/gaussian-random"

// TODO MAKE RESPONSIVE FOR MOBILES
//  ALSO CLEAN UP HTML MA PER ORA FA NIENTE

/////////////////////////////////////////////////////////////////
let fontSize = 15;
let width;
let height;
let cells = [];
let J;
let histogram;
let happinesses = []

const startButton = document.getElementById("start")
const nBins = 20;

const cell_display_interval = 1000;
const histogram_display_interval = 1000;
/////////////////////////////////////////////////////////////////

const pad = (n, len) => String(n).padStart(len, ' ');

const findCellsWidth = (fontSize, charsInOneCell) => {
  const ratio = 2;
  const divWidth = window.innerWidth / 2.2

  return Math.floor(divWidth / (fontSize * charsInOneCell) * ratio);
}

const findCellsHeight = (fontSize) => {
  const ratio = .575;
  const divHeight = window.innerHeight;

  return Math.floor(divHeight / fontSize * ratio);
}

const computeHappinesses = () => {
  const N = cells.length;

  happinesses = cells.map((spin_i, i, cells) => {
    return 1/Math.sqrt(N) * cells.reduce((acc, spin_j, j) => {
      if (i === j) {
        return acc;
      }

      return acc + J[j][i] * spin_i * spin_j;
    }, 0)
  })
}

const getUnhappySpinIndicesSorted = () => {
  const happySpins = happinesses.map((e, i) => [e, i]);
  const sortedSadSpins = happySpins
    .sort((a, b) => a[0] - b[0])
    .filter(([happiness]) => happiness < 0);

  return sortedSadSpins.map(([_, id]) => id)
}

const algorithms = {
  random: () => {
    computeHappinesses()
    const unhappySpinIndices = getUnhappySpinIndicesSorted()

    const flipIndex = unhappySpinIndices[Math.floor(Math.random() * unhappySpinIndices.length)];

    cells[flipIndex] *= -1;
    return flipIndex;
  },

  greedy: () => {
    computeHappinesses()
    const unhappySpinIndices = getUnhappySpinIndicesSorted()

    const flipIndex = unhappySpinIndices[0]

    cells[flipIndex] *= -1;
    return flipIndex;
  },

  reluctant: () => {
    computeHappinesses()
    const unhappySpinIndices = getUnhappySpinIndicesSorted()

    const flipIndex = unhappySpinIndices.pop()

    cells[flipIndex] *= -1;
    return flipIndex;
  }
}

const initCells = () => {
  J = Array.from(new Array(width * height))
    .map(_ => Array.from(new Array(width * height)).map(e => gaussianRandom(0, 1)));

  cells = Array.from(new Array(width * height))
    .map(_ => [-1, 1][Math.floor(Math.random()*2)]);

  const html = cells
    .reduce((acc, e, i) => `${acc}<span id="cell-${i}"">${pad(e, 3)}</span> ${i % width == (width - 1) ? "<br>" : ""}`, "")

  document.getElementById("cells").innerHTML = html
}

const displayCells = async () => {
  cells.forEach((spin, id) => {
    const cell = document.getElementById(`cell-${id}`)
    const oldValue = cell.textContent

    cell.textContent = pad(spin, 3);
    cell.style.color = spin > 0 ? "cyan" : "red"
  })
}

const displayHistogram = () => {
    const counts = Array.from(new Array(nBins)).map(_ => 0);
    for (let i = 1; i < nBins; i++) {
      counts[-i] = 0;
    }
    happinesses.forEach(happiness => ++counts[Math.floor(happiness*10)])

    // Build dataset...
    const data = Object.entries(counts)
      .map(([ level, quantity ]) => { return { 'Happiness level': String(level), 'Number of spins': quantity } })

    // Build changeset...
    const changeset = vega.changeset()
      .remove(() => true)
      .insert(data)

    // And apply it
    histogram.view.change('Happiness', changeset).run();
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

  startButton.onclick = startSimulation;

  window.onresize = init;
}

const startSimulation = () => {
  // Lock input
  Array.from(document.getElementsByClassName("control")).forEach(control => control.disabled = true);

  // Add a bit of delay to display, since we don't want to slow down the simulation...
  setInterval(displayCells, cell_display_interval);
  setInterval(displayHistogram, histogram_display_interval);

  // And launch
  const algorithm = algorithms[document.getElementById("function").value];
  setInterval(algorithm, 0);
}

const initVega = async () => {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: {
      name: "Happiness",
      values: [
        {"Happiness level": String("??"), "Number of cells": 1E5}

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
      x: { field: "Happiness level", type: "ordinal", bin: { "step": 1, "nice":false } },
      y: { field: "Number of spins", type: "quantitative" },
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

  computeHappinesses()
  displayHistogram()
  displayCells()

  startButton.disabled = false;
}

init();
