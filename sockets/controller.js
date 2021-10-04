const TicketControl = require('../models/ticket-control');


const ticketControl =  new TicketControl();


const socketController = (socket) => {
    
    // console.log('Cliente conectado', socket.id );

    // socket.on('disconnect', () => {
    //     console.log('Cliente desconectado', socket.id );
    // });

    //Cuando un cliente se conecta
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);


    
    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguienteTicket();
        callback( siguiente );

        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    })

    socket.on('atender-ticket', ( { escritorio }, callback ) => {
        // console.log(escritorio);

        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio.'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio );


        if (!ticket) {
            return callback({
                ok: false,
                msg: 'No hay tickets para atender.'
            });
        } else {
            
            //Notificar cambio en los ultimos4
            socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
            //Notificar cambio en los tickets pendientes
            socket.emit('tickets-pendientes', ticketControl.tickets.length);
            socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
            
            return callback({
                ok: true,
                ticket
            });
                
        }

    })

}



module.exports = {
    socketController
}

