
const Request = require('../models/request.model');
const User = require('../models/user.model');

const requestcontroller = {};



requestcontroller.sendrequest = async (req, res) => {
    const id_send = req.user.id;
    const { id_received } = req.params;
      console.log(id_received);
    if (id_send != id_received) {
    
        const requestexistsend = await Request.findOne(
            {
                send: id_send,
                received: id_received
            }).populate('User');

        const requestexistsreceived = await Request.findOne(
            {
                send: id_received,
                received: id_send
            }).populate('User');

        

        if (requestexistsend == null && requestexistsreceived == null) {
            console.log('No hay solicitud');

            const newRequest = new Request({
                send: id_send,
                received: id_received
            });
            await newRequest.save();
            res.redirect('/index');

        } else {
            console.log("send by: " + requestexistsreceived + "\t send to: " + requestexistsend);
        }
    } else {
        console.log("s")
    }
};


requestcontroller.getRequestsends = async (req, res) => {

    const id = req.user.id;
    const Sends = await Request.find({ send: id, accept: false }).populate("received");
    console.log(Sends);
    res.render('user/requestSends', {Sends});


};

requestcontroller.getRequestReceived = async (req, res) => {
    //se obtiene la informacion del usuario de acuerdo a su id 
    const Received = await Request.find({ received: req.user.id, accept: false }).populate("send").sort({ 'date': 'desc' });
    res.render('user/requestReceived', { Received });
};

//aceptar Solicitud de Amistad
requestcontroller.setacceptRequest = async (req, res) => {

    const request = await Request.findById({ _id: req.params.id });
    //auxiliar cambio de variable
    let accept = request.accept;
    if (accept === false) {
        accept = true;
    }

    //cambia estado de variable de false a true
    await request.updateOne({ accept: accept });

    //Se agrega el usuario que envio la solicitud a la lista de amigos del usuario que recibio la solicitud 
    const userSession = await User.findByIdAndUpdate(req.user.id, {
        $push: {
            friends: {
                _id: request.send,
                request: request
            }

        }
    });
    //Se agrega el usuario que recibio la solicitud a la lista de amigos del usuario que envio la solicitud
    const userAccept = await User.findByIdAndUpdate(request.send,
        {

            $push: {
                friends: {
                    _id: request.received,
                    request: request
                }

            }
        });
    //
    console.log(userSession.name + "  Acepto al usuario: " + userAccept.name);

    res.redirect('/myRequestReceived');

}

requestcontroller.setDeleteRequest = async (req,res) => {
  

    await Request.findByIdAndDelete({ _id: req.params.id });

    res.redirect('/myRequestReceived');
    
}

module.exports = requestcontroller;





