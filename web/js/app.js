var App = function () {

};

App.prototype.sendAjax = function (method, route, params, callBack) {

    $.ajax({
        url: route,
        dataType: 'json',
        method: method,
        data: params,
        success: function (data) {
            callBack(data);
        },

        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

// module.exports = App;
//das