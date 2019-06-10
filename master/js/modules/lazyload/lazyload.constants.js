(function () {
    'use strict';

    angular
        .module('app.lazyload')
        .constant('APP_REQUIRES', {
            // jQuery based and standalone scripts
            scripts: {
                'modernizr': ['vendor/modernizr/modernizr.custom.js'],
                'icons': ['vendor/fontawesome/css/font-awesome.min.css',
                    'vendor/simple-line-icons/css/simple-line-icons.css'],
                'weather-icons': ['vendor/weather-icons/css/weather-icons.min.css',
                    'vendor/weather-icons/css/weather-icons-wind.min.css'],
                'datatables.buttons': ['vendor/datatables-buttons/js/buttons.colVis.js',
                    'vendor/datatables-buttons/js/buttons.flash.js',
                    'vendor/datatables-buttons/js/buttons.html5.js',
                    'vendor/datatables-buttons/js/buttons.print.js'],
                'moment': ['vendor/moment/min/moment-with-locales.min.js', 'vendor/moment/min/zh-cn.js'],
                'filestyle': ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.min.js'],
                'highcharts':['vendor/highcharts/data.js','vendor/highcharts/highcharts-3d.js','vendor/highcharts/drilldown.js','vendor/highcharts/highcharts-zh_CN.js'],
                'analysis-highcharts':['vendor/highcharts/data.js','vendor/highcharts/highcharts-3d.js','vendor/highcharts/exporting.js','vendor/highcharts/drilldown.js','vendor/highcharts/highcharts-zh_CN.js'],
                'export': ['vendor/export/xlsx.core.min.js']
            },
            // Angular based script (use the right module name)
            modules: [
                // {
                //     name: 'toaster',
                //     files: ['vendor/angular-toastr/dist/angular-toastr.min.js', 'vendor/angular-toastr/dist/angular-toastr.min.css', 'vendor/angular-toastr/dist/angular-toastr.tpls.js']
                // },
                {
                    name: 'ui.select',
                    files: ['vendor/angular-ui-select/dist/select.min.js', 'vendor/angular-ui-select/dist/select.min.css']
                },
                {
                    name: 'datatables', files: [
                    'vendor/datatables/media/css/jquery.dataTables.min.css',
                    'vendor/datatables/media/css/dataTables.material.min.css'
                ], serie: true
                },
                {
                    name: 'datatables.editor', files: ['vendor/datatables/media/css/editor.dataTables.min.css',
                    'vendor/datatables/media/js/dataTables.editor.min.js']
                },
                {
                    name: 'datatables.bootstrap', files: [
                    'vendor/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
                    'vendor/datatables-buttons/js/dataTables.buttons.js',
                    'vendor/datatables-colvis/js/dataTables.colVis.js',
                    'vendor/datatables-buttons/css/buttons.dataTables.css',
                    'vendor/datatables-colvis/css/dataTables.colVis.css',
                    'vendor/angular-datatables/dist/plugins/select/angular-datatables.select.js',
                    'vendor/FixedColumns/js/dataTables.fixedColumns.js',
                    'vendor/FixedHeader/js/dataTables.fixedHeader.js']
                },
                {name: 'lodash', files: ['vendor/lodash/dist/lodash.min.js']},
                {
                    name: 'localytics.directives', files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                    'vendor/chosen_v1.2.0/chosen.min.css',
                    'vendor/angular-chosen-localytics/chosen.js']
                },
                {
                    name: 'ui.grid',
                    files: ['vendor/angular-ui-grid/ui-grid.min.css', 'vendor/angular-ui-grid/ui-grid.min.js',
                        'vendor/angular-ui-grid/csv.js']
                }
                // {
                //     name: 'textAngular', files: ['vendor/textAngular/dist/textAngular.css',
                //     'vendor/textAngular/dist/textAngular-rangy.min.js',
                //     'vendor/textAngular/dist/textAngular-sanitize.js',
                //     'vendor/textAngular/src/globals.js',
                //     'vendor/textAngular/src/factories.js',
                //     'vendor/textAngular/src/DOM.js',
                //     'vendor/textAngular/src/validators.js',
                //     'vendor/textAngular/src/taBind.js',
                //     'vendor/textAngular/src/main.js',
                //     'vendor/textAngular/dist/textAngularSetup.js'
                // ], serie: true
                // }
            ]
        })
    ;

})();
