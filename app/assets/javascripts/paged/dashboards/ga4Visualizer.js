//##########################################################################
//## CHART JS  FOR => app/views/dashboards/ga4_visualizer/index.html.slim ##
//##########################################################################
let chart;
let graphTitle

//##############################################################################
//## PAGE READY LOGIC ##
//######################
$(document).ready(function () {
  // =============================================================
  // Extract common jQuery selectors into variables for efficiency
  // -------------------------------------------------------------
  const accountDropdown     = $('#account-dropdown');
  const compareLastYear     = $('#compare-last-year');
  const trafficTypeDropdown = $('#traffic-type-dropdown');
  const chartTypeDropdown   = $('#chart-type-dropdown');
  const visualizerForm      = $('#ga4_visualizer_form')
  const selectedAccountId   = accountDropdown.val();

  // ============================================
  // Initialize chart data when the page is ready
  // --------------------------------------------
  initializeChartData(chartData);

  // ===========================================================================
  // Hide all site dropdowns and show the one for the currently selected account
  // ---------------------------------------------------------------------------
  $('.site-dropdown-wrapper').addClass('hidden-ga4-website');
  $('#site-dropdown-wrapper-' + selectedAccountId).removeClass('hidden-ga4-website');


  //############################################################################
  //## Event Handlers ##
  //####################
  // =========================================================------------------
  // When the account dropdown changes, hide all site
  // dropdowns and show the one for the newly selected account
  // ---------------------------------------------------------
  accountDropdown.on('change', function () {
    const accountId = $(this).val();
    $('.site-dropdown-wrapper').addClass('hidden-ga4-website');
    $('#site-dropdown-wrapper-' + accountId).removeClass('hidden-ga4-website');
  });

  // =============================================================--------------
  // When the Compare Last Year dropdown changes, update the chart
  // -------------------------------------------------------------
  compareLastYear.on('change', function () {
    let trafficType = trafficTypeDropdown.val();
    let compareLastYearVal = compareLastYear.val();

    if (compareLastYearVal === 'Yes' && trafficType === 'All Traffic') {
      showLastYearsData(priorYearData, chartData);
    } else {
      handleTrafficType(trafficType, chartData, compareLastYearVal);
    }
  });

  // ======================================================---------------------
  // When the Chart Type dropdown changes, update the chart
  // ------------------------------------------------------
  chartTypeDropdown.on('change', function () {
    const selectedChartType = $(this).val();
    updateChartType(selectedChartType);
    });

  // ===================================================--------------------------
  // Updates Chart if different Traffic Type is selected
  // ---------------------------------------------------
  trafficTypeDropdown.on('change', function () {
    const selectedTrafficType = $(this).val();
    updateTrafficType(selectedTrafficType, chartData);
  });

  // =================================================================----------
  // Handle form submission: check for errors and update hidden fields
  // -----------------------------------------------------------------
  visualizerForm.on('submit', function () {
    const siteId = $('.site-dropdown:visible').val();
    const ga4Id  = $('.site-dropdown:visible option:selected').data('ga4-id');
    const startDate = new Date($('input[name="ga4_query_dates[start_date]"]').val());
    const stopDate   = new Date($('input[name="ga4_query_dates[stop_date]"]').val());

    // ===========================
    // Check if a site is selected
    // ---------------------------
    if (!siteId || siteId === "") {
      $('#site-selection-error').show();
      event.preventDefault();
    } else {
      $('#site-selection-error').hide();
      $('#selected-site-id').val(siteId);
      $('#selected-ga4-id').val(ga4Id);
    }

    // ================================================
    // Check if the start date is ahead of the end date
    // ------------------------------------------------
    if (startDate > stopDate) {
      $('#date-selection-error').show();
      event.preventDefault();
    } else {
      $('#date-selection-error').hide();
    }
  });
});

//##############################################################################
//## CHART DISPLAY LOGIC ##
//#########################
// ===========================================----------------------------------
// Set the chart's title using the given title
// -------------------------------------------
function setGraphTitle(title, chartData) {
  const trafficType = $('#traffic-type-dropdown').val()

  if (chartData != null) {
    updateMaxValue(chartData, trafficType); // Update maxValue for chart
  }

  graphTitle = title;
  options.title.text = `${trafficType} for: ${graphTitle}`;
}

// =============================================================----------------
// Initialize chart data and render the chart if data is present
// -------------------------------------------------------------
function initializeChartData(chartData) {
  if (chartData) {
    chart = new ApexCharts(document.querySelector("#ga4chart"), options);
    chart.render();
    handleTrafficType("Organic Traffic", chartData, "Yes")
  }
}

// ==================================================---------------------------
// Logic to compare last years data with current year
// --------------------------------------------------
function showLastYearsData(priorYearData, currentYearData) {
  if (currentYearData) {
    let allTrafficData = currentYearData['All Traffic'];
    let series = [
      {
        name: 'All Traffic - Current Year',
        data: Object.values(allTrafficData),
        fillOpacity: 0.5,
      }
    ];

    if (priorYearData) {
      let priorAllTrafficData = priorYearData['All Traffic'];
      series.push({
        name: 'All Traffic - Prior Year',
        data: Object.values(priorAllTrafficData),
        fillOpacity: 0.5,
      });
    }

    options.series = series;
    options.xaxis.categories = Object.keys(currentYearData['All Traffic']);
    if (chart) {
      chart.updateOptions(options);
    } else {
      chart = new ApexCharts(document.querySelector("#ga4chart"), options);
      chart.render();
    }

  }
}

let maxValue = 0;

// ===========================================================================
// Dynamically Set max height based on highest data value Times 300%, 400%, or
// 600% depending on traffic type. (Makes charts with less peaks and troughs)
// ---------------------------------------------------------------------------
function updateMaxValue(chartData, trafficType) {
  const maxDataValue = Math.max(...Object.values(chartData[trafficType]));

  if (trafficType == 'Call Tracking') {
    maxValue = maxDataValue * 6; // Set 600% above the max value
  } else if (trafficType == 'All Traffic') {
    maxValue = maxDataValue * 3; // Set 300% above the max value
  } else {
    maxValue = maxDataValue * 4; // Set 400% above the max value
  }
}

// =================
// Set Default Chart
// -----------------
let options = {
  title: {
    text: graphTitle,
    align: 'center',
    style: {
      fontSize: '24px',
      fontWeight: 'bold'
    },
  },
  series: [],
  chart: {
    type: 'area',
    background: '#e5e6e8',
    height: 750
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: 'Sessions'
    },
    min: 0, // Set Baseline to 0
    max: () => maxValue, // Used to make max value dynamic
  },
  plotOptions: {},
  dataLabels: {
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 1,
      opacity: .45
    }
  },
  stroke: {
    show: true,
    width: 5,
  },
  fill: {
    gradient: {
      enabled: true,
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: .5,
      opacityTo: .3,
      stops: [0, 100]
    }
  }
};


// ================================================-----------------------------
// Update the chart type in the options object.
// and Re-render the chart with the updated options
// ------------------------------------------------
function updateChartType(chartType) {
  const trafficTypeDropdown = document.getElementById('traffic-type-dropdown');
  const selectedTrafficType = trafficTypeDropdown.value;
  let opacity = 1

  // ===================================
  // Set opacity based on the chart type
  // -----------------------------------
  if (chartType === 'area') {
    opacity = 0.5
  } else {
    opacity = 1
  }

  if (chartType === 'bar') {
    options.plotOptions = {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    };
    options.stroke = {
      show: true,
      width: 2,
    };
    options.fill = {
      gradient: {
        enabled: true,
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        inverseColors: false,
        opacityFrom: opacity,
        opacityTo: opacity,
        stops: [0, 100]
      }
    };
  } else {
    options.plotOptions = {};
    options.dataLabels = {
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: .45
      }
    };
    options.stroke = {
      show: true,
      width: 5,
    };
    options.fill = {
      gradient: {
        enabled: true,
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: opacity,
        opacityTo: opacity,
        stops: [0, 100]
      }
    };
  }

  options.chart.type = chartType;
  chart.updateOptions(options);

  // ==================================================================
  // Update the chart data based on the currently selected traffic type
  // ------------------------------------------------------------------
  updateTrafficType(selectedTrafficType, chartData);
}

function updateTrafficType(trafficType, chartData) {
  let compareLastYear = $('#compare-last-year').val()
  handleTrafficType(trafficType, chartData, compareLastYear);
}

// ===========================--------------------------------------------------
// Traffic Types Helper Method
// ---------------------------
function handleTrafficType(trafficType, chartData, compareLastYear) {
  let trafficData = chartData[trafficType];
  updateMaxValue(chartData, trafficType); // Update maxValue for chart

  // ===============================================================
  // If all values are zero, clear chart and display no data message
  // ---------------------------------------------------------------
  if (Object.values(trafficData).every(value => value === 0)) {
    options.title.text = `${trafficType} Data Not Available`;
    chart.updateOptions({ title: options.title });
    chart.updateSeries([]); //=> Clear the series data
    return;
  }

  let newSeries = [{
    name: `${trafficType} - Current Year`,
    data: Object.values(trafficData),
  }];

  // ===============================
  // If Compare Last Year set to Yes
  // -------------------------------
  if (compareLastYear === 'Yes') {
    let priorYearTrafficData = priorYearData[trafficType];
    newSeries.push({
      name: `${trafficType} - Prior Year`,
      data: Object.values(priorYearTrafficData),
    });
    options.title.text = `Compare Prior Year ${trafficType} For: ${graphTitle}`
  } else {
    options.title.text = `${trafficType} For: ${graphTitle}`
  }
  // ================
  // Update the Chart
  // ----------------
  options.xaxis.categories = Object.keys(trafficData);
  chart.updateOptions(options)
  chart.updateSeries(newSeries);
}
