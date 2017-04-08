export default {
    cities: {
      title: 'En <b>citylines.co</b> queremos reconstruir los sistemas de transporte de las ciudades del mundo',
      search: 'Ingresa una ciudad o un país',
      contributors: { one: '%(contributors)s colaborador', other: '%(contributors)s colaboradores'},
      support: 'Soporte en nuestro',
      google_group: 'grupo de Google'
    },
    main: {
      log_in: 'Ingresar'
    },
    auth: {
      log_in: 'Iniciar sesión',
      log_in_with_google: 'Iniciar sesión con Google',
      disclaimer: 'Al iniciar sesión usted acepta los',
      disclaimer_link:'términos del colaborador',
      privacy_disclaimer: 'y la',
      privacy_disclaimer_link: 'política de privacidad'
    },
    cookie_notice: {
      notice: 'Este sitio web usa cookies. Al navegarlo usted acepta el uso que hacemos de ellas.',
      accept: 'Aceptar',
      info: 'Información sobre las cookies que usamos',
      text: {
        title: 'Uso que hacemos de las cookies',
        p1: 'Las cookies son pequeños pedazos de información que se almacenan en su navegador y que pueden ser consultados por uno o varios sitios web.',
        p2: 'Citylines.co usa cookies propias y de terceros para facilitar la navegación personalizada del usuario. Cookies propias: las utilizamos para recordar qué usuario ha iniciado sesión y para no mostrar el aviso sobre el uso de cookies si el usuario ha clickeado en el botón Aceptar. Cookies de terceros: Google utiliza cookies en este sitio vinculadas al servicio de inicio de sesión con Google, para recordar información referente a la sesión del usuario. Google también utiliza cookies de Google Analytics, para recabar información no personal vinculada al uso de Citylines.co. Todas estas cookies son persistentes y se utilizan solamente para los fines expuestos.',
        p3: 'Usted puede deshabilitar el uso de cookies mediante su navegador de internet, pero esto puede reducir la funcionalidad de algunos aspectos de Citylines.co.',
        p4: 'Puede consultar más información sobre cookies en <a target="_blank" class="c-link" href="http://www.aboutcookies.org">aboutcookies.org</a>, incluyendo cómo ver las que tiene instaladas y cómo eliminarlas.'
    }
  },
  city: {
    edit: 'Editar',
    stop_editing: 'Dejar de editar',
    lines: 'Líneas',
    km_operative: 'Operativos: %(km)s km',
    km_under_construction: 'En construcción: %(km)s km',
    popup: {
      station: 'Estación %(name)s',
      track: 'Información del tramo',
      buildstart: 'Comienzo de construcción: %(year)s',
      opening: 'Inauguración: %(year)s',
      closure: 'Cierre: %(year)s',
      length: 'Longitud aproximada: %(km)s km'
    }
  },
  editor: {
    edit_features: 'Editar elementos',
    edit_lines: 'Editar líneas',
    feature_viewer: {
      selected_feature: 'Elemento seleccionado',
      no_feature_selected: 'Ningún elemento seleccionado',
      fields: {
        klasses_id: {
          section_id: 'Tramo Id:%(id)s',
          station_id: 'Estación Id:%(id)s'
        },
        line: 'Línea',
        name: 'Nombre',
        opening: 'Inauguración',
        buildstart: 'Comienzo de construcción',
        closure: 'Cierre'
      }
    },
    modified_features: {
      title: 'Elementos modificados',
      no_features_modified: 'Ningún elemento modificado',
      types: {
        geo: '(Geo)',
        props: '(Props)',
        created: '(Nuevo)',
        removed: '(Eliminado)'
      },
      klasses: {
        section: 'Tramo',
        station: 'Estación'
      },
      save: 'Guardar',
      discard: 'Descartar'
    },
    lines_editor: {
      create: 'Crear',
      new_line_placeholder: 'Nueva línea',
      new_system_placeholder: 'Nuevo sistema',
      unnamed_system: 'Sistema sin nombre',
      save: 'Guardar',
      delete: 'Borrar',
      are_you_sure: '¿Estás seguro?',
      yes: 'Sí',
      no: 'No'
    }
  },
  terms: {
    title: 'Términos de uso',
    license: {
      title:'Licencia',
      p1: "Citylines.co es <i>open data</i> con licencia <a class='c-link' href='http://opendatacommons.org/licenses/odbl/1.0/' target='_blank'>Open Database License</a> (ODbL). Cualquier derecho sobre contenidos individuales de la base de datos es regido por la licencia <a href='http://opendatacommons.org/licenses/dbcl/1.0/' target='_blank' class='c-link'>Database Contents License</a> (DbCL).",
      p2: "Usted puede encontrar un resumen de la licencia ODbL <a href='https://opendatacommons.org/licenses/odbl/summary/' target='_blank' class='c-link'>aquí</a>."
    },
    contributor: {
      title: 'Términos del colaborador',
      p1: 'Su contribución no debe infringir derechos de propiedad de nadie más. Al contribuir usted está indicando que tiene derecho a autorizar a Citylines.co a usar y distribuir el contenido aportado por usted bajo nuestros términos legales.',
      p2: 'Usted autoriza a Citylines.co a hacer cualquier uso del contenido por usted aportado dentro de los límites de la licencia que aquí se establece.',
      p3: 'Citylines.co se compromete a usar y distribuir el contenido que usted aportó en fórma de base de datos y sólo bajo los términos de las licencias ODbL 1.0 para la base de datos y DbCL 1.0 para los contenidos individuales de la base de datos.'
    },
    privacy: {
      title: 'Política de privacidad',
      p1: 'Citylines.co recoge su nombre, apellido y correo electrónico del servicio de autenticación de Google cuando Usted inicia sesión usando Google.',
      p2: 'Citylines.co guarda esta información en una base de datos privada protegida.',
      p3: 'Citylines.co usa esta información con fines sólo relacionados a su autenticación y/o para enviarle correos electrónicos ocasionalmente.',
      p4: 'Citylines.co no va a compartir su información con nadie más.',
      p5: 'Usted puede pedir a Citylines.co, en cualquier momento, que borre su información personal de la base de datos.'
    }
  },
  data: {
    short_title: 'Datos',
    title: "Nuestros datos son abiertos",
    download: "Descarga",
    license: "La información guardada en la base de datos de <b>citylines.co</b> está disponible bajo la licencia <a class='c-link' href='http://opendatacommons.org/licenses/odbl/1.0/' target='_blank'> Open Database License</a> (ODbL)",
    see_terms_1: "Ver los",
    see_terms_2: "términos de uso",
    cities: 'Ciudades',
    systems: 'Sistemas',
    lines: 'Líneas',
    features: 'Tramos',
    stations: 'Estaciones'
  }
}
