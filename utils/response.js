module.exports = {
    Resp : function(res, status, result) {
        res.statusCode = status;
        res.send({
            status : true,
            result : result
        });
    },
    
    Error : function(res, status, result) {
        res.statusCode = status;
        res.send({
            status : false,
            error : result
        });
    }
}