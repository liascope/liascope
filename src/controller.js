import * as model from "./model.js";
import View from "./view.js";
import { chart, draconic, horary, natalTransit, perfection, progression } from "./config.js";
import { findSign, mergeRetroList } from "./helpers.js";
import view from "./view.js";
// import "core-js";
// import "regenerator-runtime";

const controlUpdateState = async function () {
  try {
    View.showLoader();
    // Natal Date
    const viewData = View.getData("birth");
    if (!Array.isArray(viewData) || viewData.some((v) => /undefined/.test(String(v))) || viewData.some((v) => v === "")) {
      throw new Error("Invalid inputs, please check your entries.");
    }
    [
      model.state.username,
      model.state.birthdate,
      model.state.birthtime,
      model.state.birthplace,
      model.state.houseSystem,
      model.state.formatedDate,
      model.state.unknownTime[0],
    ] = viewData;
    // Transit Date
    const [date, time, zone, hs] = model.getCurrentDateTime();
    // API Call for Charts
    const [natalData, transitData] = await Promise.all([
      model.convertToJSTWithAPI(
        model.state.birthplace,
        model.state.formatedDate, // need a date as: dd.mm.yyyy hh.mm
        model.state.houseSystem,
        model.state.unknownTime[0]
      ),
      model.convertToJSTWithAPI(zone, `${date} ${time}`, hs, model.state.unknownTime[1]),
    ]);
    const progressionData = await model.calcProgressionDate();
    if (!natalData || !transitData || !progressionData) throw new Error("City not found.");
    else {
      // Save data for state
      model.state.natalData = natalData.positionData;
      model.state.transitData = transitData.positionData;
      model.state.progressionData = progressionData.positionData;
      model.state.draconicData = model.calcCuspsDraconic(model.state.natalData);
      model.perfectionChart();
      // Render charts
      controlCharts({ data: model.state.natalData, chartName: chart });
      controlCharts({ data: model.state.transitData, chartName: horary });
      controlCharts({
        data: model.state.natalData,
        transitData: model.state.transitData,
        chartName: natalTransit,
      });
      controlCharts({ data: model.state.draconicData, chartName: draconic });
      controlCharts({
        data: model.state.progressionData,
        chartName: progression,
      });
      controlCharts({ data: model.state.perfectionData, chartName: perfection });
      View.renderPerfectionInfo(
        model.perfectionChart(),
        model.state.perfectionHouse,
        model.state.perfectionData.cusps.map((c) => findSign(c))
      );
      View.toggleChartElements(model.state.unknownTime[0], "natal");
      View.renderAllCharts();

      // first info, static area, lists and tables
      View.renderFirstInfo(
        findSign(model.state.natalData.cusps[0]),
        findSign(...model.state.natalData.planets.Sun),
        findSign(...model.state.natalData.planets.Moon),
        model.state.unknownTime[0]
      );

      const staticTime = model.state.unknownTime[0] ? "unknown time" : `${model.state.birthtime} ${natalData.localTime}`;
      const staticTimeAct = model.state.unknownTime[1] ? "unknown time" : `${time} ${transitData.localTime}`;
      View.staticInfo(
        "natal",
        model.state.username,
        model.state.formatedDate.split(" ")[0],
        staticTime,
        model.state.unknownTime[0] ? "" : natalData.utcTime,
        `${model.state.birthplace}, ${natalData.countryName}`,
        model.state.houseSystem
      );
      View.staticInfo(
        "transit",
        null,
        date,
        staticTimeAct,
        model.state.unknownTime[1] ? "" : transitData.utcTime,
        `${zone}, ${transitData.countryName}`,
        hs
      );
      controlList(model.state.natalData, "1", model.state.unknownTime[0]);
      controlList(model.state.transitData, "3", model.state.unknownTime[1]);
      controlList(model.state.progressionData, "4");
      controlList(model.state.draconicData, "5");
      controlListTransitAndNatal(model.state.natalData, model.state.transitData, model.state.unknownTime);
      // Retrogrades
      model.state.natalRetro = natalData.retroData;
      model.state.transitRetro = transitData.retroData;
      const retroNatalandTransit = mergeRetroList(natalData.retroData, transitData.retroData);
      View.renderRetrogradeList(retroNatalandTransit, "2");
      View.renderRetrogradeList(natalData.retroData, "1");
      View.renderRetrogradeList(transitData.retroData, "3");
      View.renderRetrogradeList(model.state.progressionRetro, "4");
      View.renderRetrogradeList(natalData.retroData, "5");
    }
  } catch (error) {
    console.dir(error.message);
    console.log(error);
    View.renderErrorMsg(error.message);
    return;
  }
};

// Transit Data Edit
const editTransitData = async function () {
  try {
    View.showLoader();
    const [transitDate, transitTime, transitPlace, hs, unknownTime] = View.getData("act");
    model.state.unknownTime[1] = unknownTime;
    if (
      !Array.isArray(View.getData("act")) ||
      View.getData("act").some((v) => /undefined/.test(String(v))) ||
      View.getData("act").some((v) => v === "")
    ) {
      throw new Error("Invalid inputs, please check your entries.");
    } else {
      // New transit chart
      const transitData = await model.convertToJSTWithAPI(transitPlace, `${transitDate} ${transitTime}`, hs, unknownTime);
      if (!transitData) {
        throw new Error("City not found.");
      } else {
        model.state.transitData = transitData.positionData;
        model.state.actData = [transitDate, transitTime, transitPlace, hs];
        // render Charts
        controlCharts({ data: model.state.natalData, transitData: model.state.transitData, chartName: natalTransit });
        controlCharts({ data: model.state.transitData, chartName: horary });
        View.toggleChartElements(unknownTime, "transit");
        View.renderAllCharts();
        // Render new static area, lists, tables for transit
        const staticTime = unknownTime ? "unknown time" : `${transitTime} ${transitData.localTime}`;
        View.staticInfo(
          "transit",
          null,
          transitDate,
          staticTime,
          model.state.unknownTime[1] ? "" : transitData.utcTime,
          `${transitPlace}, ${transitData.countryName}`,
          hs
        );
        controlList(model.state.transitData, "3", unknownTime);
        controlListTransitAndNatal(model.state.natalData, model.state.transitData, [model.state.unknownTime[0], unknownTime]);
        // retrograde
        model.state.transitRetro = transitData.retroData;
        const retroNatalandTransit = mergeRetroList(model.state.natalRetro, transitData.retroData);
        View.renderRetrogradeList(transitData.retroData, "3");
        View.renderRetrogradeList(retroNatalandTransit, "2");
      }
    }
  } catch (error) {
    console.error(error.message);
    View.renderErrorMsg(error.message);
    throw error;
  }
};

// Charts
const controlCharts = function ({ data, transitData = "", chartName }) {
  const customAspect = model.calculateAspects(data);
  chartName === perfection
    ? chartName.radix(data)
    : chartName === natalTransit
    ? chartName.radix(data).transit(transitData).aspects()
    : chartName.radix(data).aspects(customAspect);
};

// Lists and tables
const controlList = function (data, parEl, uT = "") {
  const [planet, cusps, aspect] = model.generateListData(data);
  View.renderList(planet, cusps, aspect, parEl, uT);
  View.renderAspectTable(aspect, parEl);
};

// List and table for Transit and Natal
const controlListTransitAndNatal = function (nD, tD, uT) {
  View.renderTransitAndNatalTable(model.generateComparisonTable(nD, tD, uT));
  View.renderAspectListNatalAndTransit(model.calculateAspectsBetweenCharts(nD, tD).map((a) => `${a.point.name} ${a.aspect.name} ${a.toPoint.name}ᵗ`));
  View.renderAspectTableForNatalAndTransit(
    model.calculateAspectsBetweenCharts(nD, tD).map((a) => `${a.point.name} ${a.aspect.name} ${a.toPoint.name}ᵗ`)
  );
};

View.renderChart(controlUpdateState);
View.renderTransitEdits(editTransitData);
