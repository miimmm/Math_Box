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

// #region 기존 line chart 플러그인
const pluginLineCustom = {
  id: 'scaleLabel',
  beforeDraw(chart, args, _opt) { //240118 바-라인 차트의 경우 세로줄 위치 조정
    const {
      ctx,
      canvas,
      config,
      scales: { x, y },
    } = chart;

    const barDataset = chart.getDatasetMeta(0);
    //240124 parent 변수 추가
    const parent = canvas.parentElement;
    //240124 bar-line-chart 삭제 single-main-bar-chart 추가
    if(parent.classList.contains('single-main-bar-chart')){
      barDataset.data.forEach((dataPoint, index) => {
        const verticalLineX = dataPoint.x;

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(verticalLineX, y.top);
        ctx.lineTo(verticalLineX, y.bottom);
        ctx.strokeStyle = '#d9d9d9';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });            
    }

    //240306 학생 월간리포트 영상 학습시간, 문제풀이수 y max값이 데이터의 최대값으로 들어가게
    const dataMaxValue = Math.max(
      ...chart.data.datasets.map(dataset => Math.max(...dataset.data))
    );
    // 240308 문제풀이 차트 최대값 올림 값
    const solveNum = Math.ceil(dataMaxValue / 10) * 10;
    // 240308 영상학습시간 차트 최대값의 30배수 값
    const videoTime = Math.ceil(dataMaxValue / 30) * 30;
    const hasData = chart.data.datasets.some(dataset => (
      dataset.data.some(value => value > 0)
    ));
    const _parent = chart.canvas.parentElement;
    if(_parent.classList.contains('is--solve') && 
    _parent.classList.contains('test_solve') && 
    !_parent.classList.contains('triple-bar-chart')) { // 240829 test_solve 추가 (월간리포트만 적용)  240923 트리플 차트 제외 추가    
      //240306 데이터가 있을 경우에만 차트 data의 최대값이 들어가도록 수정
      // 240308 문제풀이 차트 데이터의 최대값의 올림이 y max로 들어가도록 수정
      if(hasData) {
        chart.config.options.scales.y.ticks.stepSize = solveNum/4;
        chart.config.options.scales.y.max = solveNum;   
      } 
      // 240829 test_solve 추가 (월간리포트만 적용)
    } else if (_parent.classList.contains('is--watch') && _parent.classList.contains('test_solve')) { //240308 영상학습 차트 최소값이 60이고, 최대값이 30분 단위로 적용되게 수정
      if(hasData) {
        if (dataMaxValue <= 60) {
          chart.config.options.scales.y.ticks.stepSize = 60/4;
          chart.config.options.scales.y.max = 60;   
        } else {    
          chart.config.options.scales.y.ticks.stepSize = videoTime/4;
          chart.config.options.scales.y.max = videoTime;                
        }
      } 
    }
    // #240306 학생 월간리포트 영상 학습시간, 문제풀이수 y max값이 데이터의 최대값으로 들어가게
  },
  afterDatasetsDraw(chart, args, _opt) {
    const {
      ctx,
      canvas,
      config,
      scales: { x, y },
    } = chart;

    //240124 parent 변수 추가
    const parent = canvas.parentElement;

    //240118 누적 학습수준 y라벨 위치 조정
    //240124 클래스 bar-line-chart > main-doubleBar-chart 변경

    //240722 line-chart 추가로 y라벨 위치조정 함수로 변경
    function drawCustomYLabel(chart, ctx, offsets) {
      const scale = chart.scales.y;
      const customLabels = ['미흡', '다소 미흡', '보통', '우수', '매우 우수']
      
      chart.data.labels.forEach((label, index) => {
        if (index >= customLabels.length) return;
        const tick = scale.ticks[index];
        const currentOffset = offsets[index % offsets.length];
        

        // 텍스트 위치 조정
        const x = scale.right - 10;
        const y = scale.getPixelForTick(index) + currentOffset;                
        
        // 텍스트 그리기
        ctx.save();
        ctx.translate(x, y);
        ctx.textAlign = 'right';
        ctx.font = `bold ${scale.options.ticks.font.size}px ${scale.options.ticks.font.family}`;
        ctx.fillStyle = '#000';
        ctx.fillText(customLabels[index], 0, 0);
        ctx.restore();
      });
    }
    if (parent.classList.contains('main-doubleBar-chart')) {
      const offsets = [-13, -35, -22, -35, -10];
      // drawCustomYLabel(chart, ctx, offsets); 240828 y 라벨삭제
    }
    if (parent.classList.contains('line-chart')) {
      const offsets = [-6, -25, -15, -25, -5];
      drawCustomYLabel(chart, ctx, offsets);
    }

    //240102 데이터 없을 경우 추가
    const {datasets} = chart.data;
    let hasData = false;

    for (let i = 0; i < datasets.length; i += 1) {
      const dataset = datasets[i];
      for (let j = 0; j < dataset.data.length; j += 1) {
        if (dataset.data[j] !== 0) {
          hasData = true;
          break;
        }
      }
      if (hasData) {
        break;
      }
    }

    if (!hasData && parent.classList.contains('empty_txt')) {//240206 클래스 empty_txt만 해당으로 수정
      chart.options.scales.y.grid.display = false;

      // 데이터가 없을 때 '데이터가 없습니다' 텍스트 객체 생성
      // 240206 '데이터가 없습니다' 문구 위치 수정
      const canvasWidthNumber = parseInt(canvas.style.width, 10);
      const canvasHeightNumber = parseInt(canvas.style.height, 10);
      const dataAreaWidth = canvas.width - (_opt.y.width + _opt.y.space); 
      const dataAreaHeight = canvasHeightNumber - (_opt.x.height + _opt.x.space + _opt.x.padding); 

      ctx.beginPath();
      ctx.rect(canvas.width - dataAreaWidth, 0, dataAreaWidth, dataAreaHeight); 
      ctx.fillStyle = _opt.x.color;
      ctx.fill();
      ctx.closePath();

      //텍스트
      ctx.beginPath();
      
      const text = '데이터가 없습니다.';
      ctx.font = '20px NanumSquareRound';
      // 240206 '데이터가 없습니다' 문구 위치 수정
      const textWidth = ctx.measureText(text).width;
      const textX = (canvasWidthNumber - _opt.y.width + _opt.y.space - textWidth) / 2;
      ctx.fillStyle = '#1A1A1A';
      ctx.fillText(text, textX, dataAreaHeight / 2 - 20);
      ctx.closePath();
    }

    //240102 데이터 없을 경우 추가

    let _cellWidth = 0;
    const _xTicksPadding = config._config.options.scales.x.ticks.padding;

    const typeDoubleBar = canvas.parentNode.classList.contains(
      'double-bar-chart'
    )
      ? true
      : false;
    const typeTripleBar = canvas.parentNode.classList.contains(
      'triple-bar-chart'
    )
      ? true
      : false;
    const typeAnswerRatio = canvas.parentNode.classList.contains(
      'answer-raio-bar'
    )
      ? true
      : false;
    // [KT요청 : 230803] 전 과목 누적 학습 수준 변경
    const typeTension = canvas.parentNode.classList.contains(
      'tension-line-chart'
    )
      ? true
      : false;

    const typeXTentionMonth =
      _opt.x.height == 'tension' ||
      canvas.parentNode.classList.contains('month')
        ? true
        : false;

    if (_opt.x && _opt.x.display && x._labelItems !== null) {
      x._labelItems.forEach((label, idx) => {
        const pos = label.options.translation;

        const _labelW =
          idx == 0 || idx == x._labelSizes.widths.length - 1
            ? x._labelSizes.widths[idx] - 2
            : x._labelSizes.widths[idx];

        let _labelFirstW = 0;
        if (
          _opt.y !== undefined &&
          _opt.y.space !== undefined &&
          _opt.x.more !== undefined
        ) {
          _labelFirstW =
            idx == 0 && _opt.y.space > 0 ? _opt.y.space : 0;
        }

        let _labelBoxW = 0;
        // [KT요청 : 230803] 전 과목 누적 학습 수준 변경
        if (
          typeDoubleBar ||
          typeTripleBar ||
          typeAnswerRatio ||
          typeTension
        ) {
          if (_opt.x.weight) {
            _labelBoxW = _opt.x.width + 5;
          } else {
            _labelBoxW = _opt.x.padding * 2 + _labelW + 5;
          }
        } else {
          if (_opt.x.weight) {
            _labelBoxW = _opt.x.width;
          } else {
            _labelBoxW = _opt.x.padding * 2 + _labelW;
          }
        }

        const _labelCenter = _opt.x.width
          ? pos[0] - _labelBoxW * 0.5
          : pos[0] - _labelW * 0.5 - _opt.x.space;

        const _labelTextCenter = pos[0] - _labelW * 0.5;

        const optHeight = typeXTentionMonth ? 24 : _opt.x.height;
        const _textPt = optHeight - label.font.lineHeight;

        // [KT요청 : 230803] 전 과목 누적 학습 수준 변경
        const labelTop =
          typeXTentionMonth && !typeTension
            ? pos[1] - 4
            : typeTension
            ? pos[1]
            : typeAnswerRatio
            ? pos[1] + 3.5
            : _opt.x.width
            ? pos[1] - 4
            : _opt.x.width
            ? pos[1] - _textPt * 1.3
            : pos[1];

        const _textTop = typeXTentionMonth
          ? pos[1] + _textPt + 5
          : _opt.x.padding == 0 && _opt.x.space == 0
          ? pos[1] + _textPt
          : pos[1] + _xTicksPadding + _textPt;

        let nextPos;
        // console.log(x._labelItems);
                
        if (x._labelItems[idx + 1]) {
          nextPos = x._labelItems[idx + 1].options.translation;
        } else {
          nextPos = x._labelItems[idx - 1].options.translation;
        }

        _cellWidth = Math.abs(nextPos[0] - pos[0]);
        const _zeroRectL = idx == 0 ? pos[0] - _labelBoxW + 15 : pos[0];
        const _zeroRectW =
          idx == 0 ? _cellWidth + _labelBoxW : _cellWidth;

        const _yWidth =
          _opt.y && _opt.y.width && idx == 0 ? _opt.y.width : 0;

        // label과 zeroLine 사이 튀어나온 선
        ctx.beginPath();
        ctx.rect(
          _zeroRectL + _yWidth - _labelFirstW,
          x.top + 1,
          _zeroRectW - _yWidth + _labelFirstW,
          _opt.x.space + optHeight + _xTicksPadding + 30
        );
        ctx.fillStyle = _opt.x.color;
        ctx.fill();
        ctx.closePath();

        //240206 학습진단 차트 데이터 있을때 변수
        const mutipleChart = chart.canvas.parentElement.classList.contains('multiple_exam') && !chart.canvas.parentElement.classList.contains('is--empty')
        // 라벨 BG
        if (label.label !== '') {
          ctx.beginPath();
          ctx.roundRect(
            _labelCenter - 2, // 앞에 빈 데이터 있음
            // x.top + _opt.x.space + _xTicksPadding + 1,
            //240206 학습진단 차트일떄만 라벨 위치 조정
            mutipleChart
            ? labelTop + 8 
            : labelTop,
            _labelBoxW,
            optHeight,
            _opt.x.radius
          );
          ctx.fillStyle = _opt.x.label;
          ctx.fill();
          ctx.closePath();

          // 라벨 그리기
          ctx.beginPath();

          // console.log(label.font);
          ctx.font = label.font.string;
          // ctx.font = 'normal 14px NanumSquareRound';
          ctx.fillStyle = label.options.color;
          ctx.fillText(
            label.label,
            _labelTextCenter, // 앞에 빈 데이터 있음
            _textTop
          );
          ctx.closePath();
        }
      });
    }

    if (_opt.y && _opt.y.display && y._labelItems !== null) {
      y._labelItems.forEach((label, idx) => {
        const pos = label.options.translation;
        if (_opt.y.width) {
          pos[0] = _opt.y.width;
        }

        // label과 zeroLine 사이 튀어나온 선
        ctx.beginPath();
        ctx.rect(
          _opt.y.width,
          pos[1] - _opt.y.height * 0.5,
          _opt.y.space,
          _opt.y.height
        );
        ctx.fillStyle = _opt.y.color;
        ctx.fill();
        ctx.closePath();
      });
    }
  },
};
// #endregion 기존 line chart 플러그인

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
function setLineChart(
  $parent,
  $chartWrapper,
  $target,
  $idx,
  $labelSpaceX,
  $labelSpaceY,
  linelabel,
  datalabel,
  data
) {
  let _y = $labelSpaceY;
  let _x = $labelSpaceX;

  //240701 초등ui 
  const isEleWrap = document.querySelector('.wrap') && document.querySelector('.wrap').classList.contains('ele_ui');
  function isEleLayer(){
    const layerArea = document.querySelector('.layer-area')
    if(layerArea){
      if(layerArea.classList.contains('ele_ui')){
        return true
      }
    }
    return false;
  }
  const isEleChart = isEleWrap || isEleLayer();

  const datasets = {
    labels: linelabel,
    datasets: [
      {
        label: datalabel[1],
        data: data[1].data,
        borderColor: '#A6A6A6',
        backgroundColor: '#C6C6C6',
        pointBorderColor: '#A6A6A6',
        pointBackgroundColor: '#C6C6C6',
      },
      {
        label: datalabel[0],
        data: data[0].data,
        tooltip: [
          '화법과 작문, 미적분, 확률과 통계, 영어 독해, 생활과 윤리, 한국지리, 동아시아사, 생명과학, 지구과학',
          '과목 BB',
          '과목 CC',
          '과목 DD',
          '과목 EE',
        ],
        //240701 초등ui 색상 추가
        borderColor: isEleChart ? '#58AFFF' : '#45BCFF',
        backgroundColor: isEleChart? '#DEEFFF' : '#94D8FF',
        pointBorderColor: isEleChart? '#58AFFF' : '#45BCFF',
        pointBackgroundColor: isEleChart? '#DEEFFF' : '#94D8FF',
        userChart: true,
      },
    ],
  };

  // 버튼 설정
  const buttonWidth = 52;
  const buttonGap = 10;
  
  // 전체 버튼 영역 계산
  const totalButtonsWidth = buttonWidth * linelabel.length + buttonGap * (linelabel.length - 1);
  
  // 캔버스 너비는 버튼 영역과 동일하게 설정
  const canvasWidth = totalButtonsWidth;
  const chartHeight = $parent.dataset.chartHeight ? Number($parent.dataset.chartHeight) : 190;
  
  $target[0].height = chartHeight;
  $target[0].width = canvasWidth;

  // OPTIONS
  const config = {
    type: 'line',
    data: datasets,
    options: {
      responsive: false,
      maintainAspectRatio: false,
      elements: {
        line: {
          borderWidth: 3,
          tension: 0, // 직선
          hoverBorderColor: (c) => {},
          hoverBackgroundColor: (c) => {},
        },
        point: {
          pointStyle: 'circle',
          pointRadius: 4,
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 2,
        },
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
      scales: {
        x: {
          grid: {
            color: function (context) {
              // 첫번째, 마지막 라인 삭제하지 않고 모든 격자선 표시
              return '#cccccc';
            },
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            lineWidth: 1,
          },
          border: {
            display: false,
            dash: [2, 2],
          },
          beginAtZero: true,
          max: 100,
          ticks: {
            padding: 11,
            color: '#000',
            font: {
              family: 'NanumSquareRound',
              size: 14,
            },
            align: 'start',
            display: false, // x축 라벨 숨김
          },
          afterFit: (axis) => {
            if (_x && _x.space) {
              axis.height += _x.space;
              axis.height += _x.height - config.options.scales.x.ticks.font.size;
            } else {
              axis.height = 0;
            }
          },
        },
        y: {
          grid: {
            color: '#cccccc',
            drawOnChartArea: true,
            lineWidth: 1,
            // [이슈리스트 : 230908][2839] 차트 Y축 라벨 잘려보임 수정
            tickColor: _y ? _y.color : 'transparent',
            tickLength: _y ? _y.space - 3 : 0,
          },
          border: {
            display: false,
            dash: [2, 2],
          },
          beginAtZero: true,
          // [KT요청 : 230725] 데이터 값에 관계 없이 5단계 고정
          // 240722 0, 100 잘림 이슈 min, max, color 수정 afterTick 추가
          min: -2,
          max: 102,
          ticks: {
            color: 'transparent',
            font: {
              family: 'NanumSquareRound',
              size: 16,
              weight: 700,
            },
          },
          afterTickToLabelConversion: function (chart) {
            chart.ticks = []
            chart.ticks.push({ value: 0, label: '미흡'})
            chart.ticks.push({ value: 12, label: '다소 미흡' })
            chart.ticks.push({ value: 41, label: '보통' })
            chart.ticks.push({ value: 61, label: '우수' })
            chart.ticks.push({ value: 90, label: '매우 우수' })
            chart.ticks.push({ value: 100, label: '매우 우수' })
          },
          afterFit: (axis) => {
            if (_y && _y.width) {
              axis.width = _y.width + _y.space;
            }
          },
        },
      },
      // 툴팁 뜨는 위치
      interaction: {
        intersect: false,
        mode: 'nearest',
        axis: 'xy',
      },
      plugins: {
        scaleLabel: {
          y: {
            display: _y,
            width: _y ? _y.width : 0,
            height: _y ? _y.height : 0,
            space: _y ? _y.space : 0,
            color: _y ? _y.color : 'transparent',
          },
          x: {
            display: _x,
            width: _x ? _x.width : 0,
            height: _x ? _x.height : 0,
            padding: _x ? _x.padding : 0,
            space: _x ? _x.space : 0,
            color: _x ? _x.color : '#fff',
            label: _x ? _x.label : '#f4f4f4',
            radius: _x ? _x.radius : 5,
            halfline: _x ? _x.halfline : false,
          },
        },
        lastData: {},
        htmlLegend: {
          containerClassName: '.radial-chart',
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
    plugins: [pluginCursorLine, pluginLineCustom],
  };

  const chartInstance = new Chart($target[0].getContext('2d'), config);
  _chart['LINE_CHART' + $idx] = chartInstance;

  // 공통 함수들 사용
  createCustomXButtons($chartWrapper, chartInstance, linelabel);
  registerChartClickEvent($target[0], $chartWrapper, chartInstance, handleLineChartPointClick);
  setInitialPointSelection($chartWrapper, chartInstance, handleLineChartPointClick);
}

function loadElLineChart() {
  let elLineChart = document.querySelectorAll('.line-chart');
  if (elLineChart) {
    elLineChart.forEach((e, idx) => {
      let sampleDataLabel = [];
      let sampleLabel = [];

      if (e.classList.contains('student')) {
        sampleDataLabel = ['김민지', '과목 평균'];
      } else {
        sampleDataLabel = ['우리반', '과목 평균'];
      }

      if (e.classList.contains('month')) {
        sampleLabel = ['1월', '2월', '3월', '4월', '5월'];
      } else {
        sampleLabel = ['1주차', '2주차', '3주차', '4주차', '5주차'];
      }

      const chartWrapper = e.querySelector(".chart-wrapper");
      if (chartWrapper) {
        const canvasElements = chartWrapper.getElementsByClassName("chart");

        if (canvasElements.length > 0) {
          if (e.classList.contains('student')) {
            setLineChart(
              e,
              chartWrapper,
              canvasElements,
              idx,
              setChartAttrX(e),
              setChartAttrY(e),
              sampleLabel,
              sampleDataLabel,
              sampleLineData
            );
          } else if (e.classList.contains('empty')) {
            // empty 데이터 처리는 필요시 추가
            setLineChart(
              e,
              chartWrapper,
              canvasElements,
              idx,
              setChartAttrX(e),
              setChartAttrY(e),
              sampleLabel,
              sampleDataLabel,
              sampleLineData
            );
          } else {
            setLineChart(
              e,
              chartWrapper,
              canvasElements,
              idx,
              setChartAttrX(e),
              setChartAttrY(e),
              sampleLabel,
              sampleDataLabel,
              sampleLineData
            );
          }
        }
      }
    });
  }
}
//#endregion line chart