import React, {Component} from 'react';
import {Link} from 'react-router';

class CookieNoticeText extends Component {

  render() {
    return (
        <div className="u-center-block__content">
          <h3 className="c-heading">Uso que hacemos de las cookies</h3>
          <p> Las cookies son pequeños pedazos de información que se almacenan en su navegador y que pueden ser consultados por uno o varios sitios web.</p>
          <p> Citylines.co usa cookies propias y de terceros para facilitar la navegación personalizada del usuario. Cookies propias: las utilizamos para recordar qué usuario ha iniciado sesión y para no mostrar el aviso sobre el uso de cookies si el usuario ha clickeado en el botón Aceptar. Cookies de terceros: Google utiliza cookies en este sitio vinculadas al servicio de inicio de sesión con Google, para recordar información referente a la sesión del usuario. Google también utiliza cookies de Google Analytics, para recabar información no personal vinculada al uso de Citylines.co. Todas estas cookies son permanentes y se utilizan solamente para los fines expuestos.</p>
          <p> Usted puede deshabilitar el uso de cookies mediante su navegador de internet, pero esto puede reducir la funcionalidad de algunos aspectos de Citylines.co. </p>
          <p> Puede consultar más información sobre cookies en <a target="_blank" className="c-link" href="http://www.aboutcookies.org">aboutcookies.org</a>, incluyendo cómo ver las que tiene instaladas y cómo eliminarlas.</p>
        </div>
        )
  }
}

export default CookieNoticeText
