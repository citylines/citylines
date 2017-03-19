export default {
    cities: {
      title: 'En <b>citylines.co</b> queremos reconstruir los sistemas de transporte de las ciudades del mundo',
      search: 'Ingresa una ciudad o un país',
      city_item: '%(lines)s líneas | %(contributors)s colaboradores',
      contact: 'Contacto',
      contact_link: 'Entrá al <a className="c-link" target="_blank" href="https://groups.google.com/forum/#!forum/citylinesco">Grupo de Google</a>, contactanos en <a className="c-link c-link--secondary" href="https://twitter.com/citylines_co" target="_blank">@citylines_co</a>, o visitá el <a className="c-link c-link--secondary" href="https://github.com/BrunoSalerno/citylines" target="_blank">repositorio de Github</a>.'
    },
    main: {
      log_in: 'Ingresar'
    },
    auth: {
      log_in: 'Iniciar sesión',
      log_in_with_google: 'Iniciar sesión con Google',
      disclaimer: 'Al iniciar sesión usted acepta los',
      disclaimer_link:'términos del colaborador'
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
        p4: 'Puede consultar más información sobre cookies en <a target="_blank" className="c-link" href="http://www.aboutcookies.org">aboutcookies.org</a>, incluyendo cómo ver las que tiene instaladas y cómo eliminarlas.'
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
      track: 'Tramo de la línea',
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
      p1: "Citylines.co es <i>open data</i> con licencia <a className='c-link' href='http://opendatacommons.org/licenses/odbl/1.0/' target='_blank'>Open Database License</a> (ODbL). Cualquier derecho sobre contenidos individuales de la base de datos es regido por la licencia <a href='http://opendatacommons.org/licenses/dbcl/1.0/' target='_blank' className='c-link'>Database Contents License</a> (DbCL).",
      p2: "Usted puede encontrar un resumen de la licencia ODbL <a href='https://opendatacommons.org/licenses/odbl/summary/' target='_blank' className='c-link'>aquí</a>."
    },
    contributor: {
      title: 'Términos del colaborador',
      p1: 'Su contribución no debe infringir derechos de propiedad de nadie más. Al contribuir usted está indicando que tiene derecho a autorizar a Citylines.co a usar y distribuir el contenido aportado por usted bajo nuestros términos legales.',
      p2: 'Usted autoriza a Citylines.co a hacer cualquier uso del contenido por usted aportado dentro de los límites de la licencia que aquí se establece.',
      p3: 'Citylines.co se compromete a usar y distribuir el contenido que usted aportó en fórma de base de datos y sólo bajo los términos de las licencias ODbL 1.0 para la base de datos y DbCL 1.0 para los contenidos individuales de la base de datos.'
    }
  }
}
