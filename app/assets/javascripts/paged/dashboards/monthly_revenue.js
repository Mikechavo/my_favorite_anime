window.dashboards ||= {}
window.dashboards.monthlyRevenue ||= {}
window.dashboards.monthlyRevenue.initDashboard = (container) => {
    new MonthlyRevenueDashboardController(container)
}

class MonthlyRevenueDashboardController {
    constructor(container) {
        this.container = container
        initPanelExpanders(container)

        this.initLineCodesChartControls()

        this.lineCodesData = JSON.parse($('#line_codes_chart_data').val() || [])
        this.initLineCodesChart()
        this.initLineCodesRecurrenceChart()
        this.initLineCodesPackageChart()
    }

    initLineCodesChartControls() {
        let showAll = this.container.find('.show-all')

        let showLineCodes = this.container.find('.show-line-codes')
        let lineCodes = this.container.find('#line-codes-chart').closest('.horizontal-grid')

        let showRecurrences = this.container.find('.show-recurrences')
        let recurrences = this.container.find('#line-codes-recurrence-chart').closest('.horizontal-grid')

        let showPackages = this.container.find('.show-packages')
        let packages = this.container.find('#line-codes-package-chart').closest('.horizontal-grid')

        showAll.on('click', () => {
            lineCodes.show()
            recurrences.show()
            packages.show()
        })

        showLineCodes.on('click', () => {
            lineCodes.show()
            recurrences.hide()
            packages.hide()
        })

        showRecurrences.on('click', () => {
            lineCodes.hide()
            recurrences.show()
            packages.hide()
        })

        showPackages.on('click', () => {
            lineCodes.hide()
            recurrences.hide()
            packages.show()
        })

        showLineCodes.trigger('click')
    }

    initLineCodesChart() {
        let lineCodeTotalData = []
        let categories = []

        this.lineCodesData.line_code_totals.forEach((lineCodeData) => {
            let roundedPrice = Math.round(lineCodeData.total_price)
            lineCodeTotalData.push(roundedPrice)
            categories.push(lineCodeData.type.split(' '))
        })

        let dataSeries = [
            { name: 'Total Price', data: lineCodeTotalData }
        ]

        let options = {
            series: dataSeries,
            chart: {
                height: 500,
                type: 'bar',
            },
            dataLabels: {
              enabled: false
            },
            tooltip: {
                shared: true,
                intersect: false,
                style: {
                    fontSize: '16px',
                }
            },
            grid: {
              row: {
                colors: ['#fff', '#f2f2f2']
              }
            },
            xaxis: {
                type: 'category',
                labels: {
                    hideOverlappingLabels: false,
                    minHeight: 80,
                },
                categories: categories,
                tickPlacement: 'on'
            },
        };

        let chart = new ApexCharts(document.querySelector("#line-codes-chart"), options);
        chart.render();
    }

    initLineCodesRecurrenceChart() {
        let recurrences = this.lineCodesData.recurrences
        let lineCodeTotalData = []
        recurrences.forEach((recurrence) => {
            lineCodeTotalData[recurrence] = { name: recurrence, data: [] }
        })

        let categories = []

        this.lineCodesData.line_code_totals.forEach((lineCodeData) => {
            recurrences.forEach((recurrence) => {
                let recurrenceData = lineCodeData.recurrence_totals[recurrence] || {}
                let recurrencePrice = recurrenceData.total_price || 0
                let roundedPrice = Math.round(recurrencePrice)
                lineCodeTotalData[recurrence].data.push(roundedPrice)
            })
            categories.push(lineCodeData.type.split(' '))
        })

        let dataSeries = []
        let lineCodeKeys = Object.keys(lineCodeTotalData)
        lineCodeKeys.forEach((lineCodeKey) => {
            dataSeries.push(lineCodeTotalData[lineCodeKey])
        })

        let options = {
            series: dataSeries,
            chart: {
                height: 500,
                type: 'bar',
            },
            dataLabels: {
              enabled: false
            },
            tooltip: {
                shared: true,
                intersect: false,
                style: {
                    fontSize: '16px',
                }
            },
            grid: {
              row: {
                colors: ['#fff', '#f2f2f2']
              }
            },
            xaxis: {
                type: 'category',
                labels: {
                    hideOverlappingLabels: false,
                    minHeight: 80,
                },
                categories: categories,
                tickPlacement: 'on'
            },
        };

        let chart = new ApexCharts(document.querySelector("#line-codes-recurrence-chart"), options);
        chart.render();
    }

    initLineCodesPackageChart() {
        let packages = this.lineCodesData.packages
        let lineCodeTotalData = []
        packages.forEach((packageName) => {
            lineCodeTotalData[packageName] = { name: packageName, data: [] }
        })

        let categories = []

        this.lineCodesData.line_code_totals.forEach((lineCodeData) => {
            packages.forEach((packageName) => {
                let packageData = lineCodeData.package_totals[packageName] || {}
                let packagePrice = packageData.total_price || 0
                let roundedPrice = Math.round(packagePrice)
                lineCodeTotalData[packageName].data.push(roundedPrice)
            })
            categories.push(lineCodeData.type.split(' '))
        })

        let dataSeries = []
        let lineCodeKeys = Object.keys(lineCodeTotalData)
        lineCodeKeys.forEach((lineCodeKey) => {
            dataSeries.push(lineCodeTotalData[lineCodeKey])
        })

        let options = {
            series: dataSeries,
            chart: {
                height: 500,
                type: 'bar',
            },
            dataLabels: {
              enabled: false
            },
            tooltip: {
                shared: true,
                intersect: false,
                style: {
                    fontSize: '16px',
                }
            },
            grid: {
              row: {
                colors: ['#fff', '#f2f2f2']
              }
            },
            xaxis: {
                type: 'category',
                labels: {
                    hideOverlappingLabels: false,
                    minHeight: 80,
                },
                categories: categories,
                tickPlacement: 'on'
            },
        };

        let chart = new ApexCharts(document.querySelector("#line-codes-package-chart"), options);
        chart.render();
    }
}
