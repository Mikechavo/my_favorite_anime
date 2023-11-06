window.dashboards ||= {}
window.dashboards.writers ||= {}
window.dashboards.writers.initDashboard = (container) => {
    new WritersDashboardController(container)
}

class WritersDashboardController {
    constructor(container) {
        this.container = container
        this.initExpandableDates()
        this.initWordCountsChart()
    }

    initExpandableDates() {
        let currentEpoch = parseInt($('#current_epoch').val())
        let dangerColor = rgbToHex($('#mixin-reader #color-danger').css('color'))
        let dateExpandables = this.container.find('.expandable-dates-row')

        // initial pass colors dates based on deadline and marks cells to be expandable
        dateExpandables.each((index, elem) => {
            let expandable = $(elem)
            let row = expandable.closest('tr')

            let deadlineCell = row.find('.deadline-cell')
            let minDeadline = deadlineCell.find('.expandable-dates-row[data-index=0]')
            let deadlineEpoch = parseInt(minDeadline.data('epoch'))
            // color deadline cell red if deadline is passed
            if(deadlineEpoch < currentEpoch && expandable.closest('td').hasClass('deadline-cell')) {
                expandable.css('color', dangerColor)
            }

            let scheduleCell = row.find('.schedule-cell')
            let minSchedule = scheduleCell.find('.expandable-dates-row[data-index=0]')
            let scheduleEpoch = parseInt(minSchedule.data('epoch'))
            // color schedule cell red if schedule is passed
            if(scheduleEpoch < currentEpoch && expandable.closest('td').hasClass('schedule-cell')) {
                expandable.css('color', dangerColor)
            }

            // add class to cell to indicate it can be expanded
            expandable.closest('td').addClass('dates-row-expander')
        })

        let expanderCells = this.container.find('.dates-row-expander')
        expanderCells.each((index, elem) => {
            let expander = $(elem)
            let cellExpandables = expander.find('.expandable-dates-row')
            let row = expander.closest('tr')
            let rowExpandables = row.find('.expandable-dates-row')
            // only modify cells that have multiple dates
            if(cellExpandables.length > 1) {
                // add styling to indicate cell can be expanded
                expander.css('cursor', 'pointer')
                expander.find('.expandable-dates-row[data-index=0]').append(' +')

                // flag row as dates expanded by default
                row.data('expanded', 1)
                // when an expander is clicked
                expander.on('click', () => {
                    // if dates are expanded
                    if(row.data('expanded') == 1) {
                        // retract and update row
                        rowExpandables.hide()
                        row.data('expanded', 0)
                    } else {
                        // expand and update row
                        rowExpandables.show()
                        row.data('expanded', 1)
                    }

                    // always show the first expandable row
                    row.find('.expandable-dates-row[data-index=0]').show()
                })
            }
        })

        // hide cells on load
        $('.deadline-cell').trigger('click')
    }

    initWordCountsChart() {
        let userIds = this.container.find('#writer_ids').val()
        let wordsData = this.container.find('#writers_words_data').val()
        let usersData = this.container.find('#writers_users_data').val()

        userIds = JSON.parse(userIds)
        wordsData = JSON.parse(wordsData)
        usersData = JSON.parse(usersData)

        let assignedWords = []
        let pendingWords = []
        let userLabels = []
        let chartSectionHeight = 100

        userIds.forEach((userId) => {
            let words = wordsData[userId]
            let user = usersData[userId]

            assignedWords.push(words.current)
            pendingWords.push(words.pending)
            userLabels.push(user.first_name + ' ' + user.last_name)
        })

        let assignedColor = rgbToHex($('#mixin-reader #color-primary').css('color'))
        let pendingColor = rgbToHex($('#mixin-reader #color-secondary-dark').css('color'))

        let options = {
            series: [{
                name: 'Assigned',
                data: assignedWords
            }, {
                name: 'Pending',
                data: pendingWords
            }],
            chart: {
                type: 'bar',
                height: 100 + chartSectionHeight * userIds.length
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        position: 'bottom',
                    },
                }
            },
            dataLabels: {
                enabled: true,
                offsetX: 3,
                style: {
                    fontSize: '16px',
                    colors: ['white']
                }
            },
            stroke: {
                show: true,
                width: 1,
                colors: ['#fff']
            },
            tooltip: {
                shared: true,
                intersect: false,
                style: {
                    fontSize: '16px',
                }
            },
            xaxis: {
                labels: {
                    style: {
                        fontSize: '16px',
                    }
                },
                categories: userLabels,
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: '16px',
                    }
                }
            },
            legend: {
                fontSize: '16px',
            },
            colors: [assignedColor, pendingColor],
            fill: {
                colors: [assignedColor, pendingColor]
            },
        }

        let chart = new ApexCharts(this.container.find("#writers-words-chart")[0], options)
        chart.render()
    }
}
