// all pages should have listener for modal closing
$(document).ready(() => {
    new unifiedSortController()
})

class unifiedSortController {
    constructor() {
        this.appendSortIndicators()
        $('.unified-table thead th').on('click', (evt) => {
            const clicked = $(evt.currentTarget)
            const table = clicked.closest('table')
            if (table.hasClass('no-sort')) {
                return
            }

            const sortOrder = this.determineSortOrder(clicked)
            this.updateSortIndicators(clicked, sortOrder)

            const sortTarget = clicked.closest('thead').next('tbody')
            const sortRows = sortTarget.children('tr')
            const sortType = this.getSortType(clicked, sortRows)

            if (sortType == 'text' && sortOrder == 'descending') {
                this.sortTextDescending(clicked, sortTarget, sortRows)
            }

            if (sortType == 'text' && sortOrder == 'ascending') {
                this.sortTextAscending(clicked, sortTarget, sortRows)
            }

            if (sortType == 'data' && sortOrder == 'descending') {
                this.sortDataDescending(clicked, sortTarget, sortRows)
            }

            if (sortType == 'data' && sortOrder == 'ascending') {
                this.sortDataAscending(clicked, sortTarget, sortRows)
            }
        })

        // trigger any initial sorting logic on all tables
        $('.unified-table .initial-sort').trigger('click')
    }

    appendSortIndicators() {
        $('.unified-table thead th').each((index, headerCell) => {
            const cell = $(headerCell)
            const table = cell.closest('table')
            if (table.hasClass('no-sort')) {
                return
            }
            cell.append(' ')
            cell.append('<i class="fa-solid fa-sort-up sort-ascending"></i>')
            cell.append('<i class="fa-solid fa-sort-down sort-descending"></i>')
            cell.append('<i class="fa-solid fa-sort sort-neutral"></i>')
            cell.find('.sort-descending').hide()
            cell.find('.sort-ascending').hide()
        })
    }

    determineSortOrder(clicked) {
        // determine new sort by state of current cell
        let newSortOrder
        if (clicked.find('.sort-descending').is(':visible')) {
            newSortOrder = 'ascending'
        } else if (clicked.find('.sort-ascending').is(':visible')) {
            newSortOrder = 'descending'
        } else {
            newSortOrder = 'ascending'
        }
        return newSortOrder
    }

    updateSortIndicators(clicked, sortOrder) {
        // reset state of all sort indicators in table
        clicked.closest('.unified-table').find('thead th .sort-descending').hide()
        clicked.closest('.unified-table').find('thead th .sort-ascending').hide()
        clicked.closest('.unified-table').find('thead th .sort-neutral').show()
        if (sortOrder == 'ascending') {
            clicked.find('.sort-ascending').show()
            clicked.find('.sort-neutral').hide()
        } else {
            clicked.find('.sort-descending').show()
            clicked.find('.sort-neutral').hide()
        }
    }

    getSortType(clicked, sortRows) {
        const clickedIndex = clicked.index()
        const firstRow = sortRows.eq(0)
        const matchingCell = firstRow.children('td').eq(clickedIndex)
        let sortType
        if(matchingCell.data('sort') == undefined) {
            sortType = 'text'
        } else {
            sortType = 'data'
        }
        return sortType
    }

    sortTextAscending(clicked, sortTarget, sortRows) {
        const clickedIndex = clicked.index()
        sortRows.sort((rowOne, rowTwo) => {
            const firstCell = $(rowOne).children('td').eq(clickedIndex).text().toUpperCase()
            const secondCell = $(rowTwo).children('td').eq(clickedIndex).text().toUpperCase()

            if(firstCell === secondCell){
                return 0
            }
            // special logic to put blanks at end and maintain order
            if(firstCell === null || firstCell === '-' || firstCell === ''){
                return 1
            }
            // special logic to put blanks at end and maintain order
            if(secondCell === null || secondCell === '-' || secondCell === ''){
                return -1
            }
            if(firstCell < secondCell){
                return -1
            }
            if(firstCell > secondCell){
                return 1
            }
            return 0
        })

        sortRows.each((index, row) => {
            sortTarget.append(row)
        })
    }

    sortTextDescending(clicked, sortTarget, sortRows) {
        const clickedIndex = clicked.index()
        sortRows.sort((rowOne, rowTwo) => {
            const firstCell = $(rowOne).children('td').eq(clickedIndex).text().toUpperCase()
            const secondCell = $(rowTwo).children('td').eq(clickedIndex).text().toUpperCase()

            if(firstCell < secondCell){
                return 1
            }
            if(firstCell > secondCell){
                return -1
            }
            return 0
        })
        sortRows.each((index, row) => {
            sortTarget.append(row)
        })
    }

    sortDataAscending(clicked, sortTarget, sortRows) {
        const clickedIndex = clicked.index()
        sortRows.sort((rowOne, rowTwo) => {
            const firstCell = parseFloat($(rowOne).children('td').eq(clickedIndex).data('sort'))
            const secondCell = parseFloat($(rowTwo).children('td').eq(clickedIndex).data('sort'))

            if(firstCell === secondCell){
                return 0
            }
            // special logic to put blanks at end and maintain order
            if(firstCell == 0){
                return 1
            }
            // special logic to put blanks at end and maintain order
            if(secondCell == 0){
                return -1
            }
            if(firstCell < secondCell){
                return -1
            }
            if(firstCell > secondCell){
                return 1
            }
            return 0
        })

        sortRows.each((index, row) => {
            sortTarget.append(row)
        })
    }

    sortDataDescending(clicked, sortTarget, sortRows) {
        const clickedIndex = clicked.index()
        sortRows.sort((rowOne, rowTwo) => {
            const firstCell = parseFloat($(rowOne).children('td').eq(clickedIndex).data('sort'))
            const secondCell = parseFloat($(rowTwo).children('td').eq(clickedIndex).data('sort'))

            if(firstCell < secondCell){
                return 1
            }
            if(firstCell > secondCell){
                return -1
            }
            return 0
        })
        sortRows.each((index, row) => {
            sortTarget.append(row)
        })
    }
}
