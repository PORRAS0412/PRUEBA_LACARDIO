exports.success = (req,res,body = '', status = 200,tipomsg='', msg = '', logueado )=>{
    res.status(status).send({
        error : false,
        status :status,
        body : body,
        tipomsg :tipomsg,
        msg :msg
    })
}

exports.error = (req,res,body='',status = 500,tipomsg = '',msg = '', logueado)=>{
    res.status(status).send({
        error :true,
        status :status,
        body: body,
        tipomsg :tipomsg,
        msg :msg
    })
}