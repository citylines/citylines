export default {
    cities: {
      title: 'Queremos reconstruir los sistemas de transporte de las ciudades del mundo',
      search: 'Ingresa una ciudad o un país',
      contributors: {
        one: '%(contributors)s colaborador',
        other: '%(contributors)s colaboradores',
        list: {
          title: 'Mayores colaboradores',
          total: 'Histórico',
          last_month: 'Último mes'
        }
      },
      top_systems: 'Mayores sistemas',
      support: 'Únete a nuestra',
      support_link: 'sala de chat en Gitter'
    },
    main: {
      title: 'citylines.co',
      description: 'Citylines.co es una plataforma de mapeo colaborativo de los sistemas de transporte urbano del mundo',
      log_in: 'Ingresar'
    },
    auth: {
      log_in_with_google: 'Iniciar sesión con Google',
      log_in_with_twitter: 'Iniciar sesión con Twitter',
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
    title: 'Sistemas de transporte de %(city)s',
    system_title: '%(system)s de %(city)s',
    description: 'Explora los sistemas de transporte de %(city)s, y su historia, en citylines.co —la plataforma de mapeo colaborativo de los sistemas de transporte urbano del mundo.',
    edit: 'Editar',
    stop_editing: 'Dejar de editar',
    lines: 'Líneas',
    years: {
      config: {
        timeline_speed: 'Velocidad de la línea de tiempo',
        show_transport_modes: 'Mostrar modos de transporte'
      }
    },
    km_operative: 'Operativos: %(km)s km',
    km_under_construction: 'En construcción: %(km)s km',
    all_lines: 'Todas las líneas',
    popup: {
      station: 'Estación %(name)s',
      unnamed_station: 'Estación',
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
      add_line: 'Agregar línea',
      fields: {
        klasses_id: {
          section_id: 'Tramo Id:%(id)s',
          station_id: 'Estación Id:%(id)s'
        },
        name: 'Nombre',
        opening: 'Inauguración',
        buildstart: 'Comienzo de construcción',
        closure: 'Cierre',
        osm_id: 'Id de OSM',
        osm_tags: 'Tags de OSM'
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
      discard: 'Descartar',
      too_many_elements: "¡Demasiados elementos! No se pueden guardar más de 20 elementos al mismo tiempo"
    },
    lines_editor: {
      create: 'Crear',
      new_line_placeholder: 'Nueva línea',
      new_system_placeholder: 'Nuevo sistema',
      unnamed_system: 'Sistema sin nombre',
      save: 'Guardar',
      delete: 'Borrar',
      cancel: 'Cancelar'
    },
    osm: {
      zoom: 'La importación está habilitada sólo para niveles de zoom mayores a 13',
      import_button: 'Importar',
      relation: 'Relación',
      members: 'Miembros:',
      ways: 'vías',
      nodes: 'nodos con'
    },
    no_lines_alert: 'No hay líneas creadas. Los elementos deben tener asignados una línea para poder ser guardados'
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
      title: 'Política de privacidad y tratamiento de datos personales',
      p1: 'Citylines.co recoge su nombre, apellido, correo electrónico y nombre de pantalla (en el caso de Twitter) cuando Usted inicia sesión usando Google o Twitter.',
      p2: 'Citylines.co guarda esta información en una base de datos privada protegida en la nube.',
      p3: 'Citylines.co usa esta información con fines sólo relacionados a su autenticación y/o para enviarle correos electrónicos ocasionalmente, con novedades o notificaciones.',
      p4: 'Citylines.co no va a compartir su información con nadie más.',
      p5: 'Por defecto, Citylines.co va a guardar su información mientras usted sea un usuario de Citylines.co.',
      p6: 'Usted, en tanto individuo, tiene los siguientes derechos: derecho a la información sobre los datos que Citylines.co tiene sobre usted, derecho a su corrección, actualización o eliminación en cualquier momento, derecho a solicitar su procesamiento de forma limitada, derecho a solicitar su tranferencia a otra localización u organización -mientras sea posible técnicamente-, derecho a hacer objeciones sobre su eventual procesamiento, derecho a hacer reclamos a las autoridades competentes.'
    }
  },
  data: {
    short_title: 'Datos',
    title: "Nuestros datos son abiertos",
    license: "La información guardada en la base de datos de <b>citylines.co</b> está disponible bajo la licencia <a class='c-link' href='http://opendatacommons.org/licenses/odbl/1.0/' target='_blank'> Open Database License</a> (ODbL)",
    see_terms_1: "Ver los",
    see_terms_2: "términos de uso",
    cities: 'Ciudades',
    systems: 'Sistemas',
    lines: 'Líneas',
    features: 'Tramos',
    stations: 'Estaciones',
    section_lines: 'Líneas por tramos',
    station_lines: 'Líneas por estaciones',
    all_data: 'Todos los datos',
    data_by_city: 'Datos por ciudad',
    select_city: 'Seleccionar ciudad'
  },
  user: {
    my_cities: 'Mis ciudades',
    cities_of_user: 'Ciudades de %(name)s',
    table: {
      city: 'Ciudad',
      created_km: 'Km creados',
      created_stations: 'Estaciones creadas',
      modified_or_deleted_elements: 'Elementos modificados o borrados',
      caption: 'Ciudades ordenadas según kms creados y número de elementos modificados'
    },
    you_never_contributed: '¡Todavía no haz contribuido a ninguna ciudad!',
    user_never_contributed: '%(name)s todavía no contribuyó a ninguna ciudad',
    see_cities: 'Ver ciudades'
  },
  error: {
    title: 'La URL ingresada no corresponde a ninguna ciudad',
    subtitle: 'Quizás la URL está mal escrita o quizás todavía no cargamos la ciudad que buscas.',
    redirect: 'Buscar otras ciudades'
  },
  transport_modes: {
    default: 'Seleccionar modo',
    high_speed_rail: 'Tren de Alta Velocidad',
    inter_city_rail: 'Tren Interurbano',
    commuter_rail: 'Tren de Cercanías',
    heavy_rail: 'Metro Pesado',
    light_rail: 'Tren Ligero',
    brt: 'BRT',
    people_mover: 'People Mover',
    bus: 'Autobús'
  }
}
