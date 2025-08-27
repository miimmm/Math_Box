let _chart = {};
// #region 샘플 변수

// 250829 tension line chart
// const sampleTensionLineLabels = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월"];
// const sampleTensionLineData0 = [22.29, 47.26, 41.12, 12.6, 49.06, 61.48, 22.29, 47.26];
// const sampleTensionLineData1 = [32.29, 67.26, 51.12, 42.6, 69.06, 91.48, 32.29, 67.26];
// const sampleTensionLineData2 = [18.83, 41.7, 32.29, 26.91, 41.7, 54.71, 18.83, 41.7];
// const sampleTensionLineData3 = [41.7, 48.88, 64.57, 82.51, 87.0, 78.92, 41.7, 48.88];
const sampleTensionLineLabels = ["3월", "4월", "5월", "6월"];
const sampleTensionLineData = [22.29, 47.26, 41.12, 12.6];
const sampleTensionLineData1 = [32.29, 67.26, 51.12, 42.6];
const sampleTensionLineData2 = [18.83, 41.7, 32.29, 26.91];
const sampleTensionLineData3 = [41.7, 48.88, 64.57, 82.51];
// 범례 정보
const sampleTensionLineLegends = [
  { label: "자녀의 누적 진단", color: "#45BCFF" },
  { label: "과목 평균 누적 진단", color: "#FF8989" },
  { label: "자녀의 누적 학습량", color: "#38EAE0" },
  { label: "과목 평균 누적 학습량", color: "#FFA959" },
];

// radar chart
const radarSampleLabel = ["국어", "과학", "사회", "수학", "영어"];
const radarSampleData = [
  {
    data: [100, 60, 100, 80, 60],
  },
  {
    data: [90, 40, 90, 60, 60],
  },
];

// line chart
const sampleLineLabels = ["1월", "2월", "3월", "4월", "5월"];
const sampleLineData = [
	{ data: [60, 85, 55, 100, 100] },
	{ data: [0, 40, 80, 40, 60] },
];
const sampleLineLegends = [
  { label: "김민지", color: "#45BCFF" },
  { label: "과목 평균", color: "#A6A6A6" },
];
// const sampleLineDataEmpty = [{ data: [null, 0] }, { data: [null] }];
// #endregion 샘플 변수

// #region 차트생성
document.addEventListener("DOMContentLoaded", function () {
  loadElTensionLineChart();
  loadElRadarChart();
  loadElLineChart();
});

$(window).on("load", function () {
  for (const key in _chart) {
    if (_chart[key]) {
      _chart[key].update();
    }
  }
});

$(window).on("resize", function () {
  for (const key in _chart) {
    if (_chart[key]) {
      if (!key.startsWith("TENSION_LINE")) {
        _chart[key].resize();
      }
      _chart[key].update();
    }
  }
});
// #endregion 차트생성

//#region  div data 값 받아오기
function setChartAttrX(target) {
  const e = target;
  let optionsX = {};
  if (e.dataset.chartHeight) {
    e.style.height = e.dataset.chartHeight + "px";
  }

  if (e.dataset.chartX) {
    e.style.height = Number(e.dataset.chartHeight) + Number(e.dataset.xHeight) + Number(e.dataset.xSpace) + "px";

    optionsX.padding = Number(e.dataset.xPadding);
    optionsX.height = e.dataset.xHeight == "tension" ? e.dataset.xHeight : Number(e.dataset.xHeight);
    optionsX.width = Number(e.dataset.xWidth);
    optionsX.space = Number(e.dataset.xSpace);
    optionsX.label = e.dataset.xLabel;
    optionsX.radius = Number(e.dataset.xRadius);
    optionsX.color = e.dataset.xColor;
  } else {
    optionsX = false;
  }

  if (e.dataset.chartHalfline) {
    optionsX.halfline = true;
  }
  return optionsX;
}
function setChartAttrY(target) {
  const e = target;

  let optionsY = {};

  if (e.dataset.chartY) {
    optionsY.width = Number(e.dataset.yWidth);
    optionsY.height = Number(e.dataset.yHeight);
    optionsY.space = Number(e.dataset.ySpace);
    optionsY.color = e.dataset.yColor;
  } else {
    optionsY = false;
  }

  // console.log(e, e.dataset.yWidth, optionsY);
  return optionsY;
}
function setChartAttrStyle(target) {
  const e = target;

  let optionsS = {};

  if (e.dataset.chartStyle) {
    optionsS.background = e.dataset.styleBackground;
    optionsS.border = e.dataset.styleBorder;
    optionsS.point = e.dataset.stylePoint;
    optionsS.pointborder = e.dataset.stylePointborder;

    optionsS.tick = Number(e.dataset.styleTick);
    optionsS.max = Number(e.dataset.styleMax);
    optionsS.cutout = Number(e.dataset.styleCutout);
  } else {
    optionsS = false;
  }

  return optionsS;
}
//#endregion div data 값 받아오기

//#region 차트 플러그인
// [PLUGIN] HTML LEGEND
const getOrCreateLegendList = (chart, cls) => {
  const legendContainer = chart.canvas.parentElement;
  let listContainer = legendContainer.getElementsByClassName("legend");

  if (listContainer.length === 0) {
    const newListContainer = document.createElement("div");
    newListContainer.classList.add("legend");
    legendContainer.appendChild(newListContainer);
    return [newListContainer];
  }

  return listContainer;
};

const pluginChartLegend = {
  id: "htmlLegend",
  afterDatasetsDraw(chart, args, options) {
    const _legendBox = getOrCreateLegendList(chart, options.containerClassName);

    // Remove old legend items
    while (_legendBox[0].firstChild) {
      _legendBox[0].firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach((item) => {
      const _legend = document.createElement("p");
      _legend.classList = "row";

      // Color box
      const _legendChip = document.createElement("span");
      _legendChip.style.background = item.fillStyle;
      _legendChip.style.borderColor = item.strokeStyle;
      _legendChip.classList = "chip";

      // Text
      const _legendTextBox = document.createElement("span");
      _legendTextBox.classList = "text";

      // Number
      const _legendNumberBox = document.createElement("span");
      _legendNumberBox.classList = "number";

      const _legendText = document.createTextNode(item.text);
      _legendTextBox.appendChild(_legendText);

      _legend.appendChild(_legendChip);
      _legend.appendChild(_legendTextBox);
      if (options.containerClassName == ".doughnut-chart") {
        const _lastTxt = options.text ? options.text : "";
        const _arr = chart.config.data.datasets[0].data;

        if (options.hasPercent) {
          let _sum = 0;

          _arr.forEach((item) => {
            _sum += item;
          });

          const _percent = Math.round((_arr[item.index] / _sum) * 100);

          const _numberText = document.createTextNode(_arr[item.index] + _lastTxt + " / " + _percent + "%");
          _legendNumberBox.appendChild(_numberText);
          _legend.appendChild(_legendNumberBox);
        } else {
          const _numberText = document.createTextNode(_arr[item.index] + _lastTxt);
          _legendNumberBox.appendChild(_numberText);
          _legend.appendChild(_legendNumberBox);
        }
      }
      _legendBox[0].appendChild(_legend);
    });
  },
};

// [PLUGIN] 세로선 플러그인
const pluginCursorLine = {
  id: "cursorLine",
  beforeDraw(chart) {
    const {
      ctx,
      scales: { x, y },
    } = chart;
    if (chart.customLine?.x) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(chart.customLine.x, 0);
      ctx.lineTo(chart.customLine.x, y.bottom);
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  },
};

// [PLUGIN] RADAR CHART
const pluginRadarChart = {
  id: "radarChart",
  beforeInit(chart, arg, _opt) {
    const {
      ctx,
      canvas,
      config,
      scales: { x, y },
    } = chart;
    const _parent = chart.canvas.parentElement;
  },
};

//#endregion 차트 플러그인

// #region 공통 유틸 함수
// 공통: x축 버튼 생성
function createCustomXButtons(chartWrapper, chart, labels) {
  let btnContainer = chartWrapper.querySelector(".custom-x-btns");

  if (!btnContainer) {
    btnContainer = document.createElement("div");
    btnContainer.className = "custom-x-btns";
    chartWrapper.appendChild(btnContainer);
  }

  btnContainer.innerHTML = "";

  labels.forEach((label, idx) => {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.dataset.index = idx;

    btn.addEventListener("click", () => {
      handleChartPointClick(chartWrapper, chart, idx);
    });

    btnContainer.appendChild(btn);
  });
}

// 공통: 차트 포인트 클릭 처리 (세로선 표시)
function handleChartPointClick(chartWrapper, chart, index) {
  // 버튼 활성화 상태 변경
  const btnContainer = chartWrapper.querySelector(".custom-x-btns");
  if (btnContainer) {
    const buttons = btnContainer.querySelectorAll("button");
    buttons.forEach((b, i) => {
      b.classList.toggle("active", i === index);
    });
  }

  // 세로선 표시
  const meta = chart.getDatasetMeta(0);
  const xPos = meta.data[index]?.x;
  if (xPos != null) {
    chart.customLine = { x: xPos };
    chart.update();
  }
}

// 공통: 차트 클릭 이벤트 등록
function registerChartClickEvent(canvas, chartWrapper, chart, onPointClick) {
  canvas.addEventListener("click", function (event) {
    const points = chart.getElementsAtEventForMode(event, "nearest", { intersect: false }, true);

    if (points.length > 0) {
      const firstPoint = points[0];
      const index = firstPoint.index;
      onPointClick(chartWrapper, chart, index);
    }
  });
}

// 공통: 초기 포인트 선택 설정
function setInitialPointSelection(chartWrapper, chart, onPointClick) {
  setTimeout(() => {
    onPointClick(chartWrapper, chart, 0);
  }, 100);
}

// 공통: 범례 정보 생성 (tension line chart와 line chart용)
function createLegendInfo(chartWrapper, legends, datasets, selectedIndex, chartKey, sectionSelector) {
  const section = chartWrapper.closest(sectionSelector);
  if (!section) return;

  let legendContainer = section.querySelector(".chart-legend-info");
  if (!legendContainer) {
    legendContainer = document.createElement("div");
    legendContainer.className = "chart-legend-info";
    section.appendChild(legendContainer);
  }
  legendContainer.innerHTML = "";

  const chartInstance = _chart[chartKey];

  legends.forEach((legend, idx) => {
    if (datasets[idx]) {
      const meta = chartInstance.getDatasetMeta(idx);
      const isVisible = meta && meta.visible !== false;

      if (isVisible) {
        const legendItem = document.createElement("div");
        legendItem.className = "legend-item";

        const colorChip = document.createElement("span");
        colorChip.className = "legend-color";
        colorChip.style.backgroundColor = legend.color;

        const labelSpan = document.createElement("span");
        labelSpan.className = "legend-label";
        labelSpan.textContent = legend.label;

        const valueSpan = document.createElement("span");
        valueSpan.className = "legend-value";
        const value = datasets[idx].data[selectedIndex] || 0;
        valueSpan.textContent = value.toFixed(1);

        legendItem.appendChild(colorChip);
        legendItem.appendChild(labelSpan);
        legendItem.appendChild(valueSpan);

        legendContainer.appendChild(legendItem);
      }
    }
  });
}

// 공통: 차트 캔버스 크기 설정
function setupChartCanvasSize(canvas, labels, chartHeight = 190) {
  const buttonWidth = 52;
  const buttonGap = 10;
  
  const totalButtonsWidth = buttonWidth * labels.length + buttonGap * (labels.length - 1);
  
  // 차트 너비는 버튼 영역과 동일하게 설정
  const canvasWidth = Math.max(totalButtonsWidth, 57);
  
  canvas.height = chartHeight;
  canvas.width = canvasWidth;
  
  // 각 포인트가 각 버튼의 중앙에 오도록 설정
  return buttonWidth / 2; // firstPointOffset 반환
}
// #endregion 공통 유틸 함수

// #region 개별 차트별 유틸 함수
// tension line chart 전용: 포인트 클릭 처리
function handleTensionChartPointClick(chartWrapper, chart, index) {
  handleChartPointClick(chartWrapper, chart, index);
  // tension chart 전용 범례 업데이트
  createLegendInfo(chartWrapper, sampleTensionLineLegends, chart.config.data.datasets, index, "TENSION_LINE0", ".tension-section");
}

// line chart 전용: 포인트 클릭 처리
function handleLineChartPointClick(chartWrapper, chart, index) {
  handleChartPointClick(chartWrapper, chart, index);
  // line chart 전용 범례 업데이트
  createLegendInfo(chartWrapper, sampleLineLegends, chart.config.data.datasets, index, "LINE_CHART0", ".line-section");
}

// radar chart 범례 생성
function createRadarLegendInfo(radarChartEl, labels, datasets) {
  let radarSection = radarChartEl.closest(".radar-section");
  if (!radarSection) return;

  let legendContainer = radarSection.querySelector(".chart-legend-info");

  if (!legendContainer) {
    legendContainer = document.createElement("div");
    legendContainer.className = "chart-legend-info";
    radarSection.appendChild(legendContainer);
  }

  legendContainer.innerHTML = "";

  // 각 과목별 범례 생성
  labels.forEach((label, idx) => {
    const legendItem = document.createElement("div");
    legendItem.className = "legend-item";

    const labelDiv = document.createElement("div");
    labelDiv.className = "legend-label";
    labelDiv.textContent = label;

    const valueDiv = document.createElement("div");
    valueDiv.className = "legend-value";

    // 첫 번째 데이터셋(학생 점수)
    const studentScore = datasets[0] && datasets[0].data[idx] ? datasets[0].data[idx] : 0;
    valueDiv.textContent = studentScore + "점";

    // 두 번째 데이터셋(과목 평균)
    if (datasets[1] && datasets[1].data[idx] != null) {
      const avgScore = datasets[1].data[idx];
      const avgDiv = document.createElement("div");
      avgDiv.textContent = " / 과목 평균 " + avgScore + "점";
      valueDiv.appendChild(avgDiv);
    }

    legendItem.appendChild(labelDiv);
    legendItem.appendChild(valueDiv);
    legendContainer.appendChild(legendItem);
  });
}
// #endregion 개별 차트별 유틸 함수

//#region tension line chart
/**
 * <div class="tension-section">
 *   <div class="tension-line-chart" data-chart-height="250">
 *     <div class="chart-wrapper">
 *       <canvas class="chart"></canvas>
 *       <div class="custom-x-btns"></div>
 *     </div>
 *   </div>
 *   <div class="chart-legend-info"></div>
 * </div>
 */
function setTensionLineChart(
  $tensionChart,
  $chartWrapper,
  $target,
  $idx,
  label,
  linedata0,
  linedata1,
  linedata2,
  linedata3
) {
  const canvas = $target[0];
  const chartHeight = $tensionChart.dataset.chartHeight ? Number($tensionChart.dataset.chartHeight) : 190;
  
  // 공통 함수로 캔버스 크기 설정
  const firstPointOffset = setupChartCanvasSize(canvas, label, chartHeight);

  const datasets = {
    labels: label,
    datasets: [
      {
        data: linedata0,
        borderColor: "#45BCFF",
        backgroundColor: "rgba(0, 133, 255, 0.1)",
        pointBorderColor: "#45BCFF",
        pointHoverBorderColor: "#45BCFF",
        pointBackgroundColor: "#FFFFFF",
        pointHoverBackgroundColor: "#FFFFFF",
        fill: true,
      },
      {
        data: linedata1,
        borderColor: "#FF8989",
        backgroundColor: "rgba(0, 133, 255, 0)",
        pointBorderColor: "#FF8989",
        pointHoverBorderColor: "#FF8989",
        pointBackgroundColor: "#FFFDFD",
        pointHoverBackgroundColor: "#FFFDFD",
        fill: false,
      },
      {
        data: linedata2,
        borderColor: "#38EAE0",
        backgroundColor: "rgba(56, 234, 224, 0.1)",
        pointBorderColor: "#38EAE0",
        pointHoverBorderColor: "#38EAE0",
        pointBackgroundColor: "#D3FFF8",
        pointHoverBackgroundColor: "#D3FFF8",
        fill: true,
        hidden: true,
      },
      {
        data: linedata3,
        borderColor: "#FFA959",
        backgroundColor: "rgba(166, 166, 166, 0)",
        pointBorderColor: "#FFA959",
        pointHoverBorderColor: "#FFA959",
        pointBackgroundColor: "#FFFDFD",
        pointHoverBackgroundColor: "#FFFDFD",
        hidden: true,
      },
    ],
  };

  // OPTIONS
  const config = {
    type: "line",
    data: datasets,
    options: {
      responsive: false,
      maintainAspectRatio: false,
      devicePixelRatio: 1,
      animation: {
        duration: 0,
      },
      layout: {
        padding: {
          left: firstPointOffset,
          right: firstPointOffset,
          top: 20,
          bottom: 0,
        },
        autoPadding: false,
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      elements: {
        line: {
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
        },
        point: {
          pointStyle: "circle",
          pointRadius: 3,
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 2,
        },
      },
      scales: {
        x: {
          type: "category",
          grid: {
            display: false,
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          border: {
            display: false,
          },
          ticks: {
            display: false,
            padding: 0,
          },
          afterFit: function (scale) {
            scale.height = 0;
          },
        },
        y: {
          grid: {
            display: false,
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          border: {
            display: false,
          },
          beginAtZero: true,
          max: 100,
          ticks: {
            display: false,
            padding: 0,
          },
          afterFit: function (scale) {
            scale.width = 0;
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
    plugins: [pluginCursorLine],
  };

  const chartInstance = new Chart($target[0].getContext("2d"), config);
  _chart["TENSION_LINE" + $idx] = chartInstance;

  // 공통 함수들 사용
  createCustomXButtons($chartWrapper, chartInstance, label);
  registerChartClickEvent(canvas, $chartWrapper, chartInstance, handleTensionChartPointClick);
  setInitialPointSelection($chartWrapper, chartInstance, handleTensionChartPointClick);
}

function loadElTensionLineChart() {
  let elTensionLineCharts = document.querySelectorAll(".tension-line-chart");
  if (elTensionLineCharts.length > 0) {
    elTensionLineCharts.forEach((tensionChart, idx) => {
      const chartWrapper = tensionChart.querySelector(".chart-wrapper");

      if (chartWrapper) {
        const canvasElements = chartWrapper.getElementsByClassName("chart");

        if (canvasElements.length > 0) {
          setTensionLineChart(
            tensionChart,
            chartWrapper,
            canvasElements,
            idx,
            sampleTensionLineLabels,
            sampleTensionLineData,
            sampleTensionLineData1,
            sampleTensionLineData2,
            sampleTensionLineData3
          );
        }
      }
    });
  }
  initTabToggle();
}

// 누적학습수준 탭 토글
function initTabToggle() {
  const chartInstance = _chart["TENSION_LINE0"];
  const tabButtons = document.querySelectorAll(".tension-section .tab--button");

  tabButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (chartInstance) {
        if (idx === 0) {
          // 누적 진단 탭
          chartInstance.show(0);
          chartInstance.show(1);
          chartInstance.hide(2);
          chartInstance.hide(3);
        } else if (idx === 1) {
          // 누적 학습량 탭
          chartInstance.hide(0);
          chartInstance.hide(1);
          chartInstance.show(2);
          chartInstance.show(3);
        }

        // 차트 업데이트
        chartInstance.update();
        updateLegendAfterTabChange();
      }
    });
  });
}

// 탭 변경 후 범례 업데이트
function updateLegendAfterTabChange() {
  setTimeout(() => {
    const chartInstance = _chart["TENSION_LINE0"];
    const activeButton = document.querySelector(".custom-x-btns button.active");
    const chartWrapper = document.querySelector(".chart-wrapper");

    if (activeButton && chartWrapper && chartInstance) {
      const selectedIndex = parseInt(activeButton.dataset.index);
      createLegendInfo(chartWrapper, sampleTensionLineLegends, chartInstance.config.data.datasets, selectedIndex, "TENSION_LINE0", ".tension-section");
    }
  }, 10);
}

//#endregion tension line chart

//#region radar chart
/**
 * <div class="radal-chart">
 *     <div class="legend"></div>
 *     <canvas class="chart"></canvas>
 * </div>
 */
function setRadarChart($parent, $target, $ChartStyle, $label, $data, $dataLabel) {
  let _s = $ChartStyle;
  const isMainDataset = (el) => el.datasetIndex === 0;

  const datasets = {
    labels: $label,
    datasets: [
      {
        label: $dataLabel[0],
        data: $data[0].data,
      },
      {
        label: $dataLabel[1],
        data: $data[1].data,
      },
    ],
  };

  // OPTIONS
  const config = {
    type: "radar",
    data: datasets,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 15,
          right: 0,
          bottom: 10,
          left: 0,
        },
      },
      autoPadding: false,
      elements: {
        line: {
          borderWidth: 1,
          borderDash: (el) => (isMainDataset(el) ? [] : [5, 3]),
          borderColor: (el) => (isMainDataset(el) ? _s.border : "#868686"),
          backgroundColor: (el) => (isMainDataset(el) ? _s.background : "rgba(200, 200, 200, 0.5)"),
        },
        point: {
          pointStyle: false,
        },
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          beginAtZero: true,
          pointLabels: {
            font: {
              family: "NanumSquareRound",
              size: 14,
            },
            color: "#000",
            padding: 7,
          },
          angleLines: {
            display: false,
          },
          grid: {
            lineWidth: (l) => {
              if (l.tick.value % 20 == 0) {
                return 1;
              }
              return 0;
            },
            color: "rgba(0, 0, 0, 0.16)",
          },
          ticks: {
            display: false,
          },
        },
      },
      plugins: {
        htmlLegend: {
          containerClassName: ".radial-chart",
        },
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
    plugins: [pluginChartLegend, pluginRadarChart],
  };

  const chartInstance = new Chart($target[0].getContext("2d"), config);
  _chart["PROFILE_RADAR"] = chartInstance;

  // 범례 생성
  setTimeout(() => {
    createRadarLegendInfo($parent, $label, $data);
  }, 100);
}

function loadElRadarChart() {
  let elRadarChart = document.querySelectorAll(".radal-chart");
  if (elRadarChart) {
    elRadarChart.forEach((e) => {
      let radarSampleDataLabel = [];
      radarSampleDataLabel = ["김민지", "과목 평균"];

      if (e.dataset.chartHeight) {
        const targetHeight = Number(e.dataset.chartHeight);
        e.style.height = targetHeight + 25 + "px";
      }

      setRadarChart(
        e,
        e.getElementsByClassName("chart"),
        setChartAttrStyle(e),
        radarSampleLabel,
        radarSampleData,
        radarSampleDataLabel
      );
    });
  }
}
// #endregion radar chart

//#region line chart
/**
 * <div class="line-chart">
 *     <div class="legend"></div>
 *     <canvas class="chart"></canvas>
 * </div>
 */
function setLineChart($parent, $chartWrapper, $target, $idx, label, data0, data1) {
  const canvas = $target[0];
  const chartHeight = $parent.dataset.chartHeight ? Number($parent.dataset.chartHeight) : 190;
  
  // 버튼 설정
  const buttonWidth = 52;
  const buttonGap = 10;
  
  // 전체 버튼 영역 계산
  const totalButtonsWidth = buttonWidth * label.length + buttonGap * (label.length - 1);
  
  // 캔버스 너비는 버튼 영역과 동일하게 설정
  const canvasWidth = totalButtonsWidth;
  
  canvas.height = chartHeight;
  canvas.width = canvasWidth;

  const datasets = {
    labels: label,
    datasets: [
      {
        label: "김민지",
        data: data0,
        borderColor: "#45BCFF",
        backgroundColor: "#94D8FF",
        pointBorderColor: "#45BCFF",
        pointBackgroundColor: "#94D8FF",
      },
      {
        label: "과목 평균",
        data: data1,
        borderColor: "#A6A6A6",
        backgroundColor: "#C6C6C6",
        pointBorderColor: "#A6A6A6",
        pointBackgroundColor: "#C6C6C6",
      },
    ],
  };

  const config = {
    type: "line",
    data: datasets,
    options: {
      responsive: false,
      maintainAspectRatio: false,
      devicePixelRatio: 1,
      animation: {
        duration: 0,
      },
      layout: {
        padding: {
          left: buttonWidth / 2, // 첫 번째 포인트가 첫 번째 버튼 중앙에 오도록
          right: buttonWidth / 2, // 마지막 포인트가 마지막 버튼 중앙에 오도록
          top: 20,
          bottom: 0,
        },
        autoPadding: false,
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      elements: {
        line: {
          borderWidth: 3,
          tension: 0, // 직선
        },
        point: {
          pointStyle: "circle",
          pointRadius: 4,
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 2,
        },
      },
      scales: {
        x: {
          type: "category",
          grid: {
            display: true,
            color: "#cccccc",
            drawOnChartArea: true,
            drawTicks: false,
            lineWidth: 1,
          },
          border: {
            display: false,
          },
          ticks: {
            display: false, // x축 라벨 숨김
            padding: 0,
          },
          afterFit: function (scale) {
            scale.height = 0;
          },
        },
        y: {
          grid: {
            color: "#cccccc",
            drawOnChartArea: true,
            lineWidth: 1,
          },
          border: {
            display: false,
          },
          beginAtZero: true,
          min: -2,
          max: 102,
          ticks: {
            color: "transparent",
            font: {
              family: "NanumSquareRound",
              size: 16,
              weight: 700,
            },
          },
          afterTickToLabelConversion: function (chart) {
            chart.ticks = [];
            chart.ticks.push({ value: 0, label: "미흡" });
            chart.ticks.push({ value: 12, label: "다소 미흡" });
            chart.ticks.push({ value: 41, label: "보통" });
            chart.ticks.push({ value: 61, label: "우수" });
            chart.ticks.push({ value: 90, label: "매우 우수" });
            chart.ticks.push({ value: 100, label: "매우 우수" });
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
    plugins: [pluginCursorLine],
  };

  const chartInstance = new Chart($target[0].getContext("2d"), config);
  _chart["LINE_CHART" + $idx] = chartInstance;

  // 공통 함수들 사용
  createCustomXButtons($chartWrapper, chartInstance, label);
  registerChartClickEvent(canvas, $chartWrapper, chartInstance, handleLineChartPointClick);
  setInitialPointSelection($chartWrapper, chartInstance, handleLineChartPointClick);
}

function loadElLineChart() {
  let elLineCharts = document.querySelectorAll(".line-chart");
  if (elLineCharts.length > 0) {
    elLineCharts.forEach((lineChart, idx) => {
      const chartWrapper = lineChart.querySelector(".chart-wrapper");
      if (chartWrapper) {
        const canvasElements = chartWrapper.getElementsByClassName("chart");

        if (canvasElements.length > 0) {
          setLineChart(
            lineChart,
            chartWrapper,
            canvasElements,
            idx,
            sampleLineLabels,
            sampleLineData[0].data,
            sampleLineData[1].data
          );
        }
      }
    });
  }
}
//#endregion line chart