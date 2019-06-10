/**
 * Created by huangxiang  on 2016/12/15 0015.
 * @author: huangxiang
 * Module: uigrid.service.js
 * feature: ui-grid表格设置
 */
(function () {
    angular.module('app.utils')
        .factory('UiGridOptions', UiGridOptions);
    UiGridOptions.$inject = ['$document'];
    function UiGridOptions($document) {
        var vm = this;
        vm.dtOptions = {
            data: [], // 设置数据源
            excludeProperties: '__metadata',
            useExternalSorting: true,
            exporterOlderExcelCompatibility: true, // 因为其默认导出excel格式为utf-16，将该属性设置为true可以避免乱码
            /*分页属性设置*/
            /*分页属性设置完毕*/
            /*选中属性设置*/
            // enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
            enableFullRowSelection: false,  //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
            isRowSelectable: function (row) { //GridRow
                if (row.entity.age > 45) {
                    row.grid.api.selection.selectRow(row.entity); // 选中行
                }
            },
            // modifierKeysToMultiSelect: false,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
            // multiSelect: true,// 是否可以选择多个,默认为true;
            // noUnselect: false,//默认false,选中后是否可以取消选中
            selectionRowHeaderWidth: 30,//默认30 ，设置选择列的宽度；
            /*选中属性设置完毕*/
            enablePinning: true,
            enablePaging: true,
            enableSorting: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: vm.pagingOptions,
            filterOptions: vm.filterOptions,
            showFilter: false,
            enableFiltering: false,
            showGridFooter: true,
            fastWatch: true,
            showColumnFooter: true,
            enableGridMenu: true,
            enableGridFooter: true,
            exporterCvsFilename: 'myFile.cvx',
            exporterPdfDefaultStyle: {fontSize: 12},
            exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
            exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,
            exporterPdfHeader: {text: '长沙智慧交通集团', style: 'headerStyle'},
            exporterPdfFooter: function (currentPage, pageCount) {
                return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
            },
            exporterPdfCustomFormatter: function (docDefinition) {
                docDefinition.styles.headerStyle = {fontSize: 22, bold: true};
                docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
                return docDefinition;
            },
            exporterCsvLinkElement: angular.element($document[0].querySelectorAll('.custom-csv-link-location'))
        };
        return {
            getUiGridOption: getUiGridOption
        };

        function getUiGridOption() {
            return vm.dtOptions;
        }

    }
})();