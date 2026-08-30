//Acesse ou cadastre-se:
$('.autenticacao').hide();

let btn = document.querySelector('#autenticacao');
btn.setAttribute('class', 'btn btn-lg btn-outline-dark pb-3 normal');

btn.onclick = function () {
    if ($("#autenticacao").hasClass("active")) {
        btn.setAttribute('class', 'btn btn-lg btn-outline-dark pb-3 normal');
    } else {
        btn.setAttribute('class', 'btn btn-lg btn-outline-dark pb-3 active');
    }
}

$('#autenticacao').click(function () {
    $('.autenticacao').toggle();

});



