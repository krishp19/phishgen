
let InitializeNgMethods = function ($scope, $http) {
    $scope.MakeHttpCall = function (method, url, data, contentType, $event) {
        $(".preloader").fadeIn();
        return $http({
            method: method,
            url: url,
            data: data,

            headers: { 'Content-Type': contentType, 'X-Requested-With': 'XMLHttpRequest' }
        }).then(function (response) {
            //debugger;
            $(".preloader").fadeOut();
            return angular.fromJson(response.data.d);
          
          
            }, function (response) {
            //    debugger;
            $(".preloader").fadeOut();
            if (response.status === 403) {
                window.location = response.data.Link;
            }
        });

    };
    $scope.MakeHttpCallAPI = function (method, url, data, contentType, $event) {
        $(".preloader").fadeIn();
        return $http({
            method: method,
            url: url,
            data: data,

            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            $(".preloader").fadeOut();
            $(this).scrollTop(0);
            return angular.fromJson(response.data);


        }, function (response) {
            //    debugger;
            $(".preloader").fadeOut();
            if (response.status === 403) {
                window.location = response.data.Link;
            }
        });

    };

    $scope.MakeHttpCallNoScroll = function (method, url, data, contentType, $event) {
        $(".preloader").fadeIn();
        return $http({
            method: method,
            url: url,
            data: data,

            headers: { 'Content-Type': contentType, 'X-Requested-With': 'XMLHttpRequest' }
        }).then(function (response) {
            //debugger;
            $(".preloader").fadeOut();
            return angular.fromJson(response.data.d);


        }, function (response) {
            //    debugger;
            $(".preloader").fadeOut();
            if (response.status === 403) {
                window.location = response.data.Link;
            }
        });

    };

    $scope.MakeHttpCallAsyncFalse = function (method, url, data, contentType) {
        $(".preloader").fadeIn();
        return $http({
            method: method,
            url: url,
            data: data,
            async: false,
            headers: { 'Content-Type': contentType}
        }).then(function (response) {
            $(".preloader").fadeOut();
            return response.data;
        }, function (response) {
            $(".preloader").fadeOut();
            if (response.status === 403) {
                window.location = response.data.Link;
            }
        });

    };  
    var config = {
        
        responseType: "arraybuffer",
        transformResponse: jsonBufferToObject,
    };
    $scope.DownloadExel = function (method, url, data, contentType) {
        $(".preloader").fadeIn();
        return $http({
            method: method,
            url: url,
            data: data,
            responseType: "arraybuffer",
            headers: { 'Content-Type': contentType, 'X-Requested-With': 'XMLHttpRequest' }
        }).then(function (response) {
            $(".preloader").fadeOut();
            $(this).scrollTop(0);
            return response;
        }, function (response) {
            debugger;
            $(".preloader").fadeOut();
            if (response.status === 403) {
                window.location = response.data.Link;
            }
        });
    };


    $scope.GetJsonAsWellAsArrayBufferResponse = function (method, url, data, contentType) {
        $(".preloader").fadeIn();
        return $http({
            method: method,
            url: url,
            data: data,
            responseType: config,
            headers: { 'Content-Type': contentType, 'X-Requested-With': 'XMLHttpRequest' }
        }).then(function (response) {
            $(this).scrollTop(0);
            $(".preloader").fadeOut();
            return response;
        }, function (response) {
            $(".preloader").fadeOut();
            if (response.status === 403) {
                window.location = response.data.Link;
            }
        });
    };
    function jsonBufferToObject(data, headersGetter, status) {
        debugger;
        var type = headersGetter("Content-Type");
        if (!type.startsWith("application/json")) {
            return data.d;
        };
        var decoder = new TextDecoder("utf-8");
        var domString = decoder.decode(data);
        var json = JSON.parse(domString);
        return json;
    };



    $scope.FileUploadCall = function (url, data, Upload) {
        return Upload.upload({
            url: url,
            data: data
        }).then(function (response) {
            $(".preloader").fadeOut();
            return response.data;
        }, function (response) {
            $(".preloader").fadeOut();
        });
    };

    $scope.ResetValidation = function (formName, modelname) {
        modelname = null;
        //$(':submit').attr('disabled', false);
        var form = $(formName);
        var validator = $(formName).validate();
        $(form).data("validator").settings.ignore = "";
        validator.resetForm();

        form.find("[data-valmsg-summary=true]")
            .removeClass("validation-summary-errors")
            .removeClass("myErrorClass")
            .addClass("validation-summary-valid")
            .find("ul").empty();

        //reset unobtrusive field level, if it exists
        form.find("[data-valmsg-replace]")
            .removeClass("field-validation-error")
            .addClass("field-validation-valid")
            .empty();

        //Remove DropDown Border While Reset
        form.find("[dir]")
            .removeClass("myErrorClass");
    };

    $scope.downloadXLS = function (xlsHeader, xlsData, filename, ws_name) {


        var createXLSLFormatObj = [];

        var xlsRows = xlsData;


        createXLSLFormatObj.push(xlsHeader);
        $.each(xlsRows, function (index, value) {
            var innerRowData = [];
            $.each(value, function (ind, val) {

                innerRowData.push(val);
            });
            createXLSLFormatObj.push(innerRowData);
        });

        if (typeof console !== 'undefined')

            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

        /* Add worksheet to workbook */

        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        /* Write workbook and Download */
        if (typeof console !== 'undefined')
            XLSX.writeFile(wb, filename);
        // if (typeof console !== 'undefined') console.log(new Date());

    }

    $scope.ExportDataPdf = function (pdfHeader, pdfData, header, filename) {
        var doc = new jsPDF();
        var totalPagesExp = "{total_pages_count_string}";

        var pageContent = function (data) {

            // HEADER
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            //if (base64Img) {
            //    doc.addImage(base64Img, 'JPEG', data.settings.margin.left, 15, 10, 10);
            //}
            doc.text(header, data.settings.margin.left, 22);

            // FOOTER
            var str = "Page " + data.pageCount;
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                str = str + " of " + totalPagesExp;
            }
            doc.setFontSize(10);
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            doc.text(str, data.settings.margin.left + 160, pageHeight - 10);
        };
        var columns = pdfHeader;
        var rows = [pdfData];
        // Only pt supported (not mm or in)


        //doc.setPage(1);
        //var splitTitle = doc.splitTextToSize("Sabarmati-Adalaj Highway, Nr.DCIS Circle, Off. S.P.Ring Road, \nBeside Narmada Canal, Adalaj, Ahmedabad - 342421, Gujarat, India.", 600);
        //doc.text(40, 20, "Divine Child International School");
        //doc.setFontSize(10);
        //doc.text(40, 35, splitTitle);
        ////doc.text(40, 20, splitTitle);



        //doc.autoTable(columns, rows[0], { margin: { top: 60 } });
        doc.autoTable(columns, rows[0], {
            addPageContent: pageContent,
            margin: { top: 30 }
        });
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }

        doc.save(filename);

    };
};
//For Notification
let ShowNotification = function (type, message, display) {
    Lobibox.notify(type, {
        size: 'mini',
        msg: message,
        position: 'top right'
    });
};
///Currently In Not Working Mode
let Pagination = function (sortType, sortColumn) {
    this.PaginationModel = {
        ItemsPerPage: "10",
        CurrentPage: "1",
        TotalItems: "1",
        SortType: sortType,
        SortColumn: sortColumn,
        Reverse: true,
        info: "",
        OldPage: "1"
    };

    this.PageChanged = function (newPage) {

        if (this.PaginationModel.CurrentPage === newPage) {
            this.PaginationModel.CurrentPage = newPage;
            this.GetPagedList();
        }
    };
    this.PageChangedPopUp = function (newPage) {

        if (this.PaginationModel.CurrentPage === newPage) {
            this.PaginationModel.CurrentPage = newPage;
            this.GetPagedListPopUp();
        }
    };

    this.ItemPerPage = function () {

        this.PageChanged("1");
    };
    this.ItemPerPagePopUp = function () {

        this.GetPagedListPopUp("1");
    };
    this.ItemPerPage1 = function () {

        this.GetPagedList();
    };
    this.SortColumn = function (newPredicate) {

        this.PaginationModel.Reverse = this.PaginationModel.Reverse === true ? false : true;

        this.PaginationModel.SortColumn = newPredicate !== undefined ? newPredicate : this.PaginationModel.SortColumn;
        this.PaginationModel.SortType = this.PaginationModel.Reverse === true ? "DESC" : "ASC";
        this.GetPagedList();
    };
    this.SortColumnPopUp = function (newPredicate) {

        this.PaginationModel.Reverse = this.PaginationModel.Reverse === true ? false : true;

        this.PaginationModel.SortColumn = newPredicate !== undefined ? newPredicate : this.PaginationModel.SortColumn;
        this.PaginationModel.SortType = this.PaginationModel.Reverse === true ? "DESC" : "ASC";
        this.GetPagedListPopUp();
    };
    this.MasterSearch = function (searchString) {

        this.PaginationModel.CurrentPage = 1;
        //this.PaginationModel.ItemsPerPage = 10;
        this.GetPagedList();
    };
    this.MasterSearchPopUp = function (searchString) {

        this.PaginationModel.CurrentPage = 1;
        //this.PaginationModel.ItemsPerPage = 10;
        this.GetPagedListPopUp();
    };
};

