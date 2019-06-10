(function() {
    'use strict';
    angular
        .module('app.sidebar')
        .controller('exportController', exportController);
    exportController.$inject = ['exportService'];
    function exportController(exportService){
        var vm = this;
        $('#excel-file').change(function(e) {
            var files = e.target.files;
            var fileReader = new FileReader();
            fileReader.onload = function(ev) {
                try {
                    var data = ev.target.result,
                        workbook = XLSX.read(data, {
                            type: 'binary'
                        }), // 以二进制流方式读取得到整份excel表格对象
                        persons = []; // 存储获取到的数据
                } catch (e) {
                    console.log('文件类型不正确');
                    return;
                }
                // 表格的表格范围，可用于判断表头是否数量是否正确
                var fromTo = '';
                // 遍历每张表读取
                for (var sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        fromTo = workbook.Sheets[sheet]['!ref'];
                        console.log(fromTo);
                        persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                        // break; // 如果只取第一张表，就取消注释这行
                    }
                }
                var i = persons.length;
                window.time = setInterval(function () { exportData(i,persons); },100);
            };
            // 以二进制方式打开文件
            fileReader.readAsBinaryString(files[0]);
        });

        var count = 0;
        function exportData(i,persons){
            if(count<i){
                var contentData = [];
                contentData.push(persons[count]);
                var data = angular.toJson(persons[count]);
                count++;
            }else{
                clearInterval(window.time);
                return false;
            }
            var exportUrl = $('#exportUrl').val();
            exportService.exportData(exportUrl, data).then(function (response){
                if (response.status == 0) {
                    console.log("导入"+data.TCC+"成功！");
                }else{
                    console.log("导入失败！"+response.status);
                    return false;
                }
            })
        }
    }

})();