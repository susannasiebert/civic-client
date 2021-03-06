(function() {
  'use strict';

  /**
   * Renders an data grid of evidence items, the last column containing a button labeled either 'Add' or 'Remove',
   * depending on if the grid's mode is specified as 'search' or 'list'. Clicking 'Add' will add the evidence item object
   * to the array provided to the 'items' attribute. Clicking 'Remove' will remove the item's object from the 'items' array.
   * Obviously two grids need to operate in tandem to be of much use, so this grid will likely be utlilized by a more abstract
   * component that renders both grids.
   *
   * @param {string} role - Either 'browse' or 'list'.
   * @param {array} items - Array containing the list of evidence item objects manipulated by the grids.
   */

  angular.module('civic.events')
    .directive('evidenceSelector', evidenceSelector)
    .controller('EvidenceSelectorController', EvidenceSelectorController);

  // @ngInject
  function evidenceSelector() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        mode: '=',
        items: '='
      },
      templateUrl: 'app/views/events/common/evidenceSelector/evidenceSelector.tpl.html',
      controller: 'EvidenceSelectorController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceSelectorController($scope,
                                      $state,
                                      $window,
                                      uiGridConstants,
                                      Datatables,
                                      Evidence,
                                      _) {
    var ctrl = $scope.ctrl = {};

    var pageCount = 5;
    var maxRows = ctrl.maxRows = pageCount;

    // declare ui paging/sorting/filtering vars
    ctrl.mode = $scope.mode;
    ctrl.totalItems = Number();
    ctrl.page = 1;
    ctrl.count= maxRows;

    ctrl.filters = [];

    ctrl.sorting = [{
      field: 'id',
      direction: 'asc'
    }];

    $scope.$watch('ctrl.totalItems', function() {
      ctrl.totalPages = Math.ceil(ctrl.totalItems / pageCount);
    });

    var evidence_levels = {
      A: 'Validated',
      B: 'Clinical',
      C: 'Case Study',
      D: 'Preclinical',
      E: 'Inferential'
    };

    ctrl.addItem = function(rowItem) {
      Evidence.get(rowItem.id).then(function(item) {
        item.evidence_level_string = item.evidence_level + ' - ' + evidence_levels[item.evidence_level];
        if(item.drugs.length > 0) {
          item.drugsStr = _.chain(item.drugs).map('name').value().join(', ');
        } else {
          item.drugsStr = 'N/A';
        }
        $scope.items.unshift(item);
      });
    };

    ctrl.removeItem = function(item) {
      $scope.items = _.reject($scope.items, {id: item.id});
    };

    ctrl.isInItems = function(id){
      return _.some($scope.items, { 'id': id});
    };

    ctrl.gridOptions = {
      enablePaginationControls: false,

      useExternalFiltering: true,
      useExternalSorting: true,
      useExternalPaging: true,

      paginationPageSizes: [maxRows],
      paginationPageSize: maxRows,
      minRowsToShow: maxRows,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,

      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      rowTemplate: 'app/views/events/common/evidenceSelector/evidenceSelectorRowTemplate.tpl.html'
    };

    // set up column defs and data transforms for each mode
    var modeColumnDefs = {
      'browse': [
        {
          name: 'id',
          displayName: 'EID',
          visible: true,
          width: '5%',
          type: 'number',
          enableSorting: true,
          enableFiltering: true,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'gene_name',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variant_name',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'disease',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'source_citation',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'source_title',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'action_add',
          displayName: '',
          width: '70',
          allowCellFocus: false,
          enableFiltering: false,
          cellTemplate: 'app/views/events/common/evidenceSelector/evidenceSelectorAddCell.tpl.html'
        }
      ],
      'list': [
        {
          name: 'gene_name',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variant_name',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'disease',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'source_citation',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'source_title',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'action_remove',
          displayName: '',
          width: '70',
          allowCellFocus: false,
          enableFiltering: false,
          cellTemplate: 'app/views/events/common/evidenceSelector/evidenceSelectorRemoveCell.tpl.html'
        }
      ]
    };

    ctrl.gridOptions.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      // called from pagination directive when page changes
      ctrl.pageChanged = function() {
        updateData();
      };

      // reset paging and do some other stuff on filter changes
      gridApi.core.on.filterChanged($scope, function() {
        // updateData with new filters
        var filteredCols = _.filter(this.grid.columns, function(col) {
          return _.has(col.filter, 'term') && !_.isEmpty(col.filter.term) && _.isString(col.filter.term);
        });
        if (filteredCols.length > 0) {
          ctrl.filters = _.map(filteredCols, function(col) {
            return {
              'field': col.field,
              'term': col.filter.term
            };
          });
        } else {
          ctrl.filters = [];
        }
        ctrl.page = 1;
        updateData();
      });

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length > 0) {
          ctrl.sorting = _.map(sortColumns, function(col) {
            return {
              'field': col.field,
              'direction': col.sort.direction
            };
          });
        } else {
          ctrl.sorting = [];
        }
        updateData();
      });

    };

    function updateData() {
      fetchData(ctrl.mode, ctrl.count, ctrl.page, ctrl.sorting, ctrl.filters)
        .then(function(data){
          ctrl.gridOptions.data = data.result;
          ctrl.gridOptions.columnDefs = modeColumnDefs[ctrl.mode];
          ctrl.totalItems = data.total;
        });
    }

    function fetchData(mode, count, page, sorting, filters) {
      var request;

      request= {
        mode: 'evidence_items',
        count: count,
        page: page
      };

      if (filters.length > 0) {
        _.each(filters, function(filter) {
          request['filter[' + filter.field + ']'] = filter.term;
        });
      }

      if (sorting.length > 0) {
        _.each(sorting, function(sort) {
          request['sorting[' + sort.field + ']'] = sort.direction;
        });
      }
      return Datatables.query(request);
    }

    updateData();
  }
})();
