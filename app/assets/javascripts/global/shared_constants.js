const IS_FIREFOX = typeof InstallTrigger !== 'undefined';
const SCROLLED_CLASS = 'scrolled';
const ASCENDING_SORT_INDICATOR = "<span> <i class='fa-solid fa-sort-up sort-indicator' aria-hidden='true'></i></span>";
const DESCENDING_SORT_INDICATOR = "<span> <i class='fa-solid fa-sort-down sort-indicator' aria-hidden='true'></i></span>";
const UNSORTED_SORT_INDICATOR = "<span class='unsorted-sort-indicator'> <i class='fa-solid fa-sort' aria-hidden='true'></i></span>";
const STATUS_ID_TO_CLASS = {
  7: 'success-color',
  8: 'caution-color'
}