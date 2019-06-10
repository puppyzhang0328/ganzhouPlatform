(function (angular) {
    angular.module('app.utils')
        .service('datatablesOptions', datatablesOptionsFactory);
    datatablesOptionsFactory.$inject = ['DTOptionsBuilder'];
    'use strict';
    function datatablesOptionsFactory(DTOptionsBuilder) {
        var dtOptions = DTOptionsBuilder.newOptions()
            .withDOM('frtip')
            .withOption('ordering', false)
            .withOption('searching', false)
            .withOption('autoWidth', true)
            .withOption('scrollX', '90%')
            .withOption('scrollY', '70%')
            .withOption('deferRender', true)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('dom',  '<"top"i>rt<"bottom"Bflp><"clear">')
            .withOption('aLengthMenu', [50, 100, 250, 500, 1000])
            .withBootstrap()
            .withButtons([
            {
                exportData: {decodeEntities:true},
                extend: 'print',
                exportOptions: {
                    columns: ':visible'
                },
                message: '打印对账单',
                text: '<i class="fa fa-print"> 打印'
            },
            {
                exportData: {decodeEntities:true},
                extend: 'copy',
                exportOptions: {
                    columns: ':visible'
                },
                text: '<i class="fa fa-files-o"> 复制 '
            },
            {
                exportData: {decodeEntities:true},
                extend: 'excel',
                exportOptions: {
                    columns: ':visible'
                },
                text: '<i class="fa fa-file-text-o"> Excel'
            },
            {
                exportData: {decodeEntities:true},
                extend: 'csv',
                exportOptions: {
                    columns: ':visible'
                },
                text: '<i class="fa fa-file-text-o"> CSV'
            },
            {
                exportData: {decodeEntities:true},
                extend: 'pdf',
                exportOptions: {
                    columns: ':visible'
                },

                text: '<i class="fa fa-file-pdf-o"> PDF'
            },
            {
                exportData: {decodeEntities:true},
                extend: 'colvis',
                text: function (dt, button, config) {
                    return dt.i18n('button.colvis', '选择列');
                }

            }
        ])
            .withLanguage({
                'sProcessing': '处理中...',
                'sLengthMenu': '显示 _MENU_ 项结果',
                'sZeroRecords': '没有匹配结果',
                'sInfo': '显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项',
                'sInfoEmpty': '显示第 0 至 0 项结果，共 0 项',
                'sInfoFiltered': '(由 _MAX_ 项结果过滤)',
                'sInfoPostFix': '',
                'sSearch': '搜索:',
                'sUrl': '',
                'sEmptyTable': '表中数据为空',
                'sLoadingRecords': '载入中...',
                'sInfoThousands': ',',
                'oPaginate': {
                    'sFirst': '首页',
                    'sPrevious': '上页',
                    'sNext': '下页',
                    'sLast': '末页'
                },
                'oAria': {
                    'sSortAscending': ': 以升序排列此列',
                    'sSortDescending': ': 以降序排列此列'
                },
                'oTableTools': {
                    'sSwfPath': 'vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf'
                }
            })
        return {
            getDatatableOption: getDatatableOption
        };
        function getDatatableOption() {
            return dtOptions;
        }
    }
})(angular);