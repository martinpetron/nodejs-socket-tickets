//Referencias HTML

const lblEscritorio     =   document.querySelector('h1');
const lblTicket         =   document.querySelector('small');
const divAlerta         =   document.querySelector('.alert'); //. es para clases
const btnAtender        =   document.querySelector('button'); // es para el primer button que encuentre
const lblPendientes     =   document.querySelector('#lblPendientes'); // es para el primer button que encuentre


const searchParams =  new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error ('El escritorio es obligatorio.');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes) => {
    if (pendientes === 0) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    }
});

btnAtender.addEventListener( 'click', () => {

    socket.emit('atender-ticket', { escritorio }, ( { ok, ticket, msg} ) => {
        
        if (!ok) {
            lblTicket.innerText = 'Nadie';
            divAlerta.innerText = msg;
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = 'Ticket '+ ticket.numero;
        divAlerta.innerText = '';
        divAlerta.style.display = 'none';


    })
    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     // console.log('Desde el server', ticket );
    //     lblNuevoTicket.innerText = ticket;
    // });

});


console.log('Escritorio HTML');