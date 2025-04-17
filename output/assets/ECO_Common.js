function Display_Message(sTitle, sText, sType) {
    swal({
        title: sTitle,
        text: sText,
        type: sType
    });
}
function successalert(sTitle, sText) {
    swal({
        title: sTitle,
        text: sText,
        type: 'success'
    });
}
function erroralert(sTitle, sText) {
    swal({
        title: sTitle,
        text: sText,
        type: 'error'
    });
}
function warningalert(sTitle, sText) {
    swal({
        title: sTitle,
        text: sText,
        type: 'warning'
    });
}
//function confirmalert(sTitle, sText) {
////    debugger;
//    //e.preventDefault();
//    swal({
//        title: sTitle,
//        text: sText,
//        type: "warning",
//        showCancelButton: true,
//        confirmButtonColor: "#DD6B55",
//        confirmButtonText: "Yes!", //"Yes, delete it!"
//        cancelButtonText: "No!", //"No, cancel plx!"
//        closeOnConfirm: true,
//        closeOnCancel: true
//        //html: false
//    }, function (isConfirm) {        
//        debugger;
//        if (isConfirm) {
////            $(this).closest('form').submit();
//            //                            debugger;
//            swal("Deleted!", "Your imaginary file has been deleted.", "success");
//        } 
//        else {
//           // return false;
//             swal("Cancelled", "Your imaginary file is safe :)", "error");
//        }
//    });
//    swal({
//            title: sTitle,
//            text: sText,
//            type: "warning",
//            showCancelButton: true,
//            confirmButtonColor: "#DD6B55",
//            confirmButtonText: "Yes!", //"Yes, delete it!"
//            cancelButtonText: "No!", //"No, cancel plx!"
//            closeOnConfirm: false,
//            closeOnCancel: false
//        },
//        function (isConfirm) {
//            //                        if (isConfirm) {
//            //                            //                            debugger;
//            //                            swal("Deleted!", "Your imaginary file has been deleted.", "success");
//            //                        } else {
//            //                            swal("Cancelled", "Your imaginary file is safe :)", "error");
//            //                        }
//            return isConfirm;
//        });
//}