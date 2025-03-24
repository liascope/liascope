// prettier-ignore
import { symbols, aspectSymbols, maxRows, houseSystems, defaultTime, dignity, perfectionHouseDescriptions, perfectionSignDescriptions,} from "./config.js";
import 'core-js'
import 'regenerator-runtime'

class View {
  #natalList = document.querySelector(".natalDate");
  #transitList = document.querySelector(".transitDate");
  #staticArea = document.querySelector(".staticArea");
  #operations = document.querySelector(".operations");
  #tabs = document.querySelectorAll(".operations__tab");
  #tabsContent = document.querySelectorAll(".operations__content");
  #loader = document.querySelector(".loaderCont");
  #natalAndTransitTable = document.getElementById("table--2");
  #dataTable = document.querySelector(".dataTable");
  #errorArea = document.querySelector(".errorDiv");
  #container = document.querySelector(".container");
  #introText = document.querySelector(".introText");
  #getTransitChartBtn = document.querySelector(".containerT");
  #perfectionArea = document.querySelector(".perfectionArea");

  #processFormData(birthOrAct) {
    const timeInput = document.getElementById(`${birthOrAct}Time`).value;
    const unknownTime = document.getElementById(`${birthOrAct}TimeUnknown`).checked;
    const time = unknownTime ? defaultTime : timeInput;
    const [year, month, day] = document.getElementById(`${birthOrAct}Date`).value.trim().split("-");
    const place = document.getElementById(`${birthOrAct}Place`).value.trim();
    const date = `${year}-${month}-${day} ${time}`;
    const formated = `${day}.${month}.${year} ${time}`;
    const houseSystem = +document.querySelector(`.${birthOrAct}SystemSelector`).value;
    if (birthOrAct === "birth") {
      const username = document.getElementById("username").value.trim();
      return [username, date, time, place, houseSystem, formated, unknownTime];
    } else {
      return [formated, time, place, houseSystem, unknownTime];
    }
  }

  #createTransiEditContainer() {
    if (!this.#getTransitChartBtn.innerHTML.trim()) {
      const transitContainer = `
        <label for="actDate">Search Date:</label>
        <input type="date" id="actDate" required />
        <label for="actTime">Search Time:</label>
        <input type="time" id="actTime"/>
        <label>
          <input type="checkbox" id="actTimeUnknown" />
          Time Unknown
        </label>
        <label for="actPlace">Search Place:</label>
        <input type="text" id="actPlace" placeholder="City" required />
        <label> House System: </label>
        <select class="actSystemSelector">
          <option value="1">Placidus</option>
          <option value="2">Campanus</option>
          <option value="3">Regiomontanus</option>
          <option value="4">Koch</option>
          <option value="5">Topocentric</option>
          <option value="6">Axial Rotation</option>
          <option value="7">Morinus</option>
        </select>
        <button class="getNTransit">Show Natal & Transit Chart</button> 
      `;
      this.#getTransitChartBtn.insertAdjacentHTML("beforeend", transitContainer);
    }
    this.#getTransitChartBtn.classList.remove("hidden");
  }

  constructor() {
    this.renderEditContainer();
    this.handleInfoBox();
    this.tabbedComp();
  }

  symbols = symbols;
  aspectSymbols = aspectSymbols;
  maxRows = maxRows;
  houseSystems = houseSystems;
  defaultTime = defaultTime;

  getData(birthOrAct) {
    return this.#processFormData(birthOrAct);
  }
  renderRetrogradeList(planets, c) {
    const container = document.querySelector(`#paper--${c}`);
    const existingList = container.querySelector("#retroList");
    if (existingList) {
      existingList.remove();
    }
    const filteredPlanets = planets.filter((planet) => planet !== "Rahu" && planet !== "Ketu");
    if (filteredPlanets.length === 0) return;
    const list = document.createElement("ul");
    list.id = "retroList";
    list.innerText = "Retrograde Planets:";
    filteredPlanets.forEach((planet) => {
      const listItem = document.createElement("li");
      listItem.textContent = planet;
      list.appendChild(listItem);
    });
    container.appendChild(list);
  }
  renderEditContainer() {
    document.addEventListener("click", (e) => {
      const natalBtn = e.target.closest(".natalBtn");
      const transitBtn = e.target.closest(".transitBtn");
      if (natalBtn || transitBtn) {
        // hide operations reset background
        this.#operations.classList.add("hidden");
        this.#introText.classList.remove("hidden");
        this.#staticArea.classList.add("hidden");
        document.body.style.background =
          "radial-gradient(circle, rgba(227, 207, 150, 1) 12%, rgba(247, 241, 224, 1) 42%, rgba(255, 255, 255, 1) 100%)";
        if (natalBtn) {
          this.#container.classList.remove("hidden");
        }
        if (transitBtn) {
          this.#createTransiEditContainer();
        }
      }
    });
  }
  handleInfoBox() {
    document.addEventListener("click", (e) => {
      const infoBox = document.querySelector(".infoBox");
      if (e.target.closest(".infoBtn")) {
        infoBox.classList.toggle("hidden");
      }
      if (e.target.closest(".infoBox")) {
        infoBox.classList.toggle("hidden");
      }
    });
  }
  tabbedComp() {
    document.addEventListener("click", (e) => {
      const clicked = e.target.closest(".operations__tab");
      if (!clicked) return;
      this.#tabs.forEach((t) => t.classList.remove("operations__tab--active"));
      this.#tabsContent.forEach((c) => c.classList.remove("operations__content--active"));
      clicked.classList.add("operations__tab--active");
      const activeContent = document.querySelector(`.operations__content--${clicked.dataset.tab}`);
      activeContent.classList.add("operations__content--active");
    });
  }
  // loader
  showLoader() {
    this.#loader.classList.remove("hidden");
    setTimeout(() => {
      this.#loader.classList.add("hidden");
      [1, 2, 3, 4, 5, 6].forEach((p) => document.querySelector(`#paper--${p}`)?.scrollIntoView({ behavior: "smooth" }));
    }, 5000);
  }
  /////////////////////////////////////////////////////////helpers//////////////////////////////////////////
  aspectColors() {
    document.querySelectorAll("td").forEach((td) => {
      const aspectText = td.textContent.trim();
      aspectText === this.aspectSymbols.square || aspectText === this.aspectSymbols.opposition
        ? (td.style.color = "#ca400d")
        : aspectText === this.aspectSymbols.trine || aspectText === this.aspectSymbols.sextile
        ? (td.style.color = "#097561")
        : (td.style.color = "#1c1c1c");
    });
  }
  aspectToSymbol(arrAspect) {
    return arrAspect.map((aspect) => {
      const aspectName = aspect.split(" ")[1];
      return this.aspectSymbols[aspectName] ? aspect.replace(aspectName, this.aspectSymbols[aspectName]) : aspect;
    });
  }

  getSymbolFromAspect(aspect) {
    const aspectName = aspect.split(" ")[1];
    return this.aspectSymbols[aspectName] ? this.aspectSymbols[aspectName] : "";
  }
  //////////////////////////////////////////infos//////////////////////////////////////////////////////////////////
  renderErrorMsg(errMessage) {
    this.#errorArea.textContent = errMessage;
  }
  staticInfo(type, user = "", date, time, utc, place, hs) {
    const listElement = type === "natal" ? this.#natalList : this.#transitList;
    listElement.innerHTML = "";
    const selectedHouseSystem = this.houseSystems[hs];
    listElement.innerHTML = `<span style="font-family:  Arial, sans-serif; color:  #5f755e; font-weight: bold;">
      ${type === "natal" ? "Birth Chart of " + user : "Transit Date"}
    </span>
    <li><strong>Date:</strong> ${date}</li>
    <li><strong>Time:</strong> ${time} <span class="utc">${utc}</span></li>
    <li><strong>Place:</strong> ${place}</li>
    <li><strong>House System:</strong> ${selectedHouseSystem}</li> 
  `;
  }
  renderFirstInfo(as, sun, moon, uT) {
    const tableFirstInfo = document.querySelector(".tableStylingFI");
    if (!uT) {
      tableFirstInfo?.classList.remove("hidden");
      tableFirstInfo ? (tableFirstInfo.innerHTML = "") : "";

      const data = [
        ["☉ Sun", `${sun}`],
        ["⚶ Asc", `${as}`],
        ["☽ Moon", `${moon}`],
      ];
      const table = document.createElement("table");
      table.classList.add("tableStylingFI");
      table.append(
        ...data.map(([symbol, meaning]) => {
          const row = document.createElement("ul");
          row.innerHTML = `<li><span>${symbol}</span> <span>${meaning}</span></li>`;
          return row;
        })
      );
      document.querySelector("#paper--1").insertAdjacentElement("afterend", table);
    } else {
      tableFirstInfo?.classList.add("hidden");
    }
  }
  showDignityInfo = () => {
    const table = document.createElement("table");
    table.classList.add("tableStyling");
    dignity.forEach(([symbol, meaning]) => {
      const row = document.createElement("ul");
      row.innerHTML = `<li>${symbol} ${meaning}</li>`;
      table.appendChild(row);
    });
    [1, 2, 3, 4, 5].forEach((id) => {
      document.querySelector(`#paper--${id}`).insertAdjacentElement("afterend", table.cloneNode(true));
    });
  };

  /////////////////////////////////////////////Render Charts//////////////////////////////////////////////////////////////
  renderAllCharts() {
    this.showDignityInfo();
    this.#container.classList.add("hidden");
    this.#introText.classList.add("hidden");
    document.querySelector("body").style.background = " rgba(253, 252, 248, 1)";
    this.#staticArea.classList.remove("hidden");
    this.#operations.classList.remove("hidden");
    this.#getTransitChartBtn.classList.add("hidden");
    // check (P)
    this.#errorArea.textContent = "";
  }
  toggleChartElements(ifClicked, type) {
    const elements = {
      // prettier-ignore
      natal: ["g#paper--1-astrology-radix-axis", "g#paper--1-astrology-radix-cusps", "g#paper--2-astrology-radix-axis","g#paper--2-astrology-radix-cusps",],
      transit: ["g#paper--3-astrology-radix-axis", "g#paper--3-astrology-radix-cusps", "g#paper--2-astrology-transit-cusps"],
    };
    elements[type]?.forEach((selector) => {
      document.querySelector(selector).style.display = ifClicked ? "none" : "block";
    });
    if (type === "natal") {
      [4, 5, 6].forEach((c) => {
        document.querySelector(`.operations__content--${c}`).classList.toggle("hidden", ifClicked);
        document.querySelector(`.operations__tab--${c}`).classList.toggle("hidden", ifClicked);
      });
    }
  }
  // Natal
  renderChart(handler) {
    document.getElementById("getHoroscope").addEventListener("click", () => {
      handler();
    });
  }
  // Transit
  renderTransitEdits(handler) {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".getNTransit");
      if (!btn) return;
      handler();
    });
  }
  // Perfection
  renderPerfectionInfo(degree, houseNumber, zodiacArray) {
    this.#perfectionArea.style.transform = `rotate(${degree}deg)`;
    const container = document.querySelector(".operations__content--6");
    let descriptionDiv = container.querySelector(".perfectionDescription");
    if (!descriptionDiv) {
      descriptionDiv = document.createElement("div");
      descriptionDiv.classList.add("perfectionDescription");
      container.insertAdjacentElement("afterbegin", descriptionDiv);
    }
    const zodiacSign = zodiacArray[houseNumber - 1];
    const houseDescription = perfectionHouseDescriptions[houseNumber] || "Unknown house.";
    const signDescription = perfectionSignDescriptions[zodiacSign] || "Unknown sign.";
    descriptionDiv.innerHTML = "";
    descriptionDiv.innerHTML = `<strong>Perfection in the ${houseNumber}th house </strong> ${houseDescription} <strong>${zodiacSign}</strong> ${signDescription}`;
  }
  //////////////////////////////////////////////////Lists and Tables////////////////////////////////////////////////////////
  renderAspectTable(aspect, el) {
    const table = document.getElementById(`table--${el}`);
    let html = this.symbols
      .map((p) => p[1])
      .map((planet, i) => {
        let line = `<tr>`;
        line += `<td class="empty"></td>`.repeat(i);
        line += `<th>${this.symbols.find((s) => s[1] === planet)?.[0] || planet}</th> <ul class="aspList"> <li>${
          this.aspectSymbols.conjunction
        } : conjunction</li> <li> ${this.aspectSymbols.opposition} : opposition </li> <li> ${this.aspectSymbols.square} : square </li> <li> ${
          this.aspectSymbols.trine
        } : trine </li> <li> ${this.aspectSymbols.sextile} : sextile </li> <li> ${this.aspectSymbols.quincunx} : quincunx </li>  <li> ${
          this.aspectSymbols.semiSextile
        } : semisextile </li></ul>`;
        let planetAspect = aspect.filter((a) => a.includes(planet));
        line += this.symbols
          .map((p) => p[1])
          .slice(i + 1)
          .map((p, j) => {
            const aspect = planetAspect.find((a) => a.includes(p));
            const symbol = aspect ? this.getSymbolFromAspect(aspect) : "";
            return `<td>${symbol}</td>`;
          })
          .join("");
        line += `</tr>`;
        return line;
      })
      .join("");
    table.innerHTML = html;
    this.aspectColors();
  }
  renderList(arrPlanetSigns, arrCusps, arrAspects, parEl, uT = "") {
    const parentContainer = document.querySelector(`#paper--${parEl}`);
    const parentTable = document.querySelector(`#tableCont--${parEl}`);
    parentContainer.querySelector(".paperChild")?.remove();
    parentTable.querySelector(".planetList")?.remove();
    const aspectsWsymbols = this.aspectToSymbol(arrAspects);
    // prettier-ignore
    const list = ` <div class="paperChild"> 
                     <ul class="cuspsList"> ${!uT ? arrCusps.map((sign, i) =>
                        `<li>${i === 0 ? "House 1 ( AC )" : i === 3 ? "House 4 ( IC )" : i === 6 ? "House 7 ( DC )" : i === 9 ? "House 10 ( MC )" : `House ${i + 1}`}: ${sign}
                        </li>`).join("") : ""}
                      </ul>
                      <ul class="aspectList ${uT ? "adjustAspect" : ""}">${aspectsWsymbols.map((a) => `<li>${a}</li>`).join("")}
                     </ul>
                   </div>`;
    // prettier-ignore
    const listTable = ` <ul class="planetList ${uT ? "shiftUp" : ""}"> ${uT? arrPlanetSigns.map((p) => 
                       `<li>${p[0]}<span class="zodiacSymbol">${p[1]}</span></li>` // [0] = sign, [1] = symbol, [2]= house number
              ).join(""): arrPlanetSigns.map((p) => `<li><span>${p[0]}</span><span class="zodiacSymbol">${p[1]} </span> <span>${p[2]}.House</span></li>`).join("")}
                       </ul>`;
    parentContainer.insertAdjacentHTML("beforeend", list);
    parentTable.insertAdjacentHTML("beforeend", listTable);
  }
  renderAspectTableForNatalAndTransit(aspects) {
    let html = "<thead><tr><th></th>";
    this.symbols.map((p) => p[1]).forEach((planet) => (html += `<th>${this.symbols.find((s) => s[1] === planet)?.[0] || planet}ᵗ</th>`));
    html += "</tr></thead><tbody>";
    // prettier-ignore
    this.symbols.map((p) => p[1]).forEach((natalPlanet) => {
      html += `<tr><th>${this.symbols.find((s) => s[1] === natalPlanet)?.[0] || natalPlanet}</th>`;
        this.symbols.map((p) => p[1]).forEach((transitPlanet) => {
            const transitName = `${transitPlanet}ᵗ`;
            const aspect = aspects.find((a) => a.startsWith(natalPlanet) && a.endsWith(transitName));
            html += `<td>${aspect ? this.getSymbolFromAspect(aspect) : ""}</td>`;});
        html += "</tr>";});
    html += "</tbody>";
    this.#natalAndTransitTable.innerHTML = html;
    this.aspectColors();
  }
  renderTransitAndNatalTable(table) {
    // prettier-ignore
    this.#dataTable.innerHTML = `<table border="1">
      <thead> <tr> <th>Planets</th><th>Natal</th><th>NH</th><th>TH</th><th>Transit</th><th>TH</th><th>NH</th></tr>
      </thead> <tbody>${table.map((row) => `<tr><td>${row.Planet}</td><td>${row.Natal}</td><td>${row.NH}</td><td>${row.TH}</td><td>${row.Transit}</td><td>${row.TH2}</td><td>${row.NH2}</td>
      </tr>`).join("")}</tbody> </table> `;
  }
  renderAspectListNatalAndTransit(aspects) {
    const columnCount = Math.ceil(aspects.length / maxRows);
    document.querySelector(".aspectContainer")?.remove();
    const aspectsWsymbol = this.aspectToSymbol(aspects);
    const cont = document.createElement("div");
    cont.classList.add("aspectContainer");
    Object.assign(cont.style, {
      display: "flex",
      gap: "20px",
    });
    Array.from({ length: columnCount }, (_, i) => {
      const listContainer = document.createElement("ul");
      listContainer.style.listStyleType = "none";

      listContainer.innerHTML = aspectsWsymbol
        .slice(i * maxRows, (i + 1) * maxRows)
        .map((aspect) => `<li>${aspect}</li>`)
        .join("");
      cont.appendChild(listContainer);
    });
    this.#dataTable.insertAdjacentElement("afterend", cont);
  }
}
export default new View();
