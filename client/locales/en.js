export default {
    cities: {
      title: "We want to build the transit systems of the World",
      search: 'Enter a city or a country',
      contributors: {
        one: '%(contributors)s contributor',
        other: '%(contributors)s contributors',
        list: {
          title: 'Top contributors',
          total: 'Ever',
          last_month: 'Last month'
        }
      },
      support: 'Join our',
      support_link: 'live chat room at Gitter'
    },
    main: {
      log_in: 'Log in'
    },
    auth: {
      log_in_with_google: 'Log in with Google',
      log_in_with_twitter: 'Log in with Twitter',
      disclaimer: 'By logging in you are agreeing to the',
      disclaimer_link: 'contributor terms',
      privacy_disclaimer: 'and the',
      privacy_disclaimer_link: 'privacy policy'
    },
    cookie_notice: {
      notice: 'This website uses cookies. If you continue to use this website you accept our cookies policy.',
      accept: 'Accept',
      info: 'Information about our cookies policy',
      text: {
        title: 'Our cookies policy',
        p1: 'Cookies are small pieces of information that are stored in your web browser and that can be accessed by one or several websites.',
        p2: 'Citylines.co uses own and third-party cookies with the purpose of improving the user experience. We use own cookies to remember which user has logged in and to know whether the user has pressed or not the Accept button in the cookies banner. Regarding the third-party cookies, Google uses cookies in this website to store information related to the Google Login and to Google Analytics. All these cookies are persistent and are used only with the described scope.',
        p3: 'You can disable the cookies in this website, but this could affect certain features of Citilines.co.',
        p4: 'You can find more information about cookies at <a target="_blank" class="c-link" href="http://www.aboutcookies.org">aboutcookies.org</a>, including guides on how to see which cookies are installed in your browser, or how to uninstall them.'
    }
  },
  city: {
    edit: 'Edit',
    stop_editing: 'Stop editing',
    lines: 'Lines',
    km_operative: 'Operative: %(km)s km',
    km_under_construction: 'Under construction: %(km)s km',
    all_lines: "All the lines",
    popup: {
      station: 'Station %(name)s',
      track: 'Track information',
      buildstart: 'Beginning of construction: %(year)s',
      opening: 'Opening: %(year)s',
      closure: 'Closure: %(year)s',
      length: 'Approximate length: %(km)s km'
    }
  },
  editor: {
    edit_features: 'Edit features',
    edit_lines: 'Edit lines',
    feature_viewer: {
      selected_feature: 'Selected feature',
      no_feature_selected: 'No feature selected',
      add_line: 'Add line',
      fields: {
        klasses_id: {
          section: 'Track Id:%(id)s',
          station: 'Station Id:%(id)s'
        },
        name: 'Name',
        opening: 'Opening',
        buildstart: 'Beginning of construction',
        closure: 'Closure',
        osm_id: 'OSM Id',
        osm_tags: 'OSM Tags'
      }
    },
    modified_features: {
      title: 'Modified features',
      no_features_modified: 'No features modified',
      types: {
        geo: '(Geo)',
        props: '(Props)',
        created: '(New)',
        removed: '(Removed)'
      },
      klasses: {
        section: 'Track',
        station: 'Station'
      },
      save: 'Save',
      discard: 'Discard',
      too_many_elements: "Too many elements! You can't save more than 20 elements at the same time"
    },
    lines_editor: {
      create: 'Create',
      new_line_placeholder: 'New line',
      new_system_placeholder: 'New system',
      unnamed_system: 'Unnamed system',
      save: 'Save',
      delete: 'Delete',
      are_you_sure: 'Are you sure?',
      yes: 'Yes',
      no: 'No'
    },
    osm: {
      zoom: 'Import is only allowed in zoom levels bigger than 13',
      import_button: 'Import',
      relation: 'Relation',
      members: 'Members:',
      ways: 'ways',
      nodes: 'nodes with'
    },
    no_lines_alert: 'There are no lines. Features must be assigned a line before they can be saved'
  },
  terms: {
    title: 'Terms of use',
    license: {
      title: 'License',
      p1: "Citylines.co is <i>open data</i> licensed under the <a class='c-link' href='http://opendatacommons.org/licenses/odbl/1.0/' target='_blank'> Open Database License</a> (ODbL). Any rights in individual contents of the database are licensed under the <a href='http://opendatacommons.org/licenses/dbcl/1.0/' target='_blank' class='c-link'>Database Contents License</a> (DbCL).",
      p2: "You can find a summary of the ODbL license <a href='https://opendatacommons.org/licenses/odbl/summary/' target='_blank' class='c-link'>here</a>."
    },
    contributor: {
      title: 'Contributor terms',
      p1: 'Your contribution should not infringe the intellectual property rights of anyone else. When you contribute any content you are indicating that you have the right to authorize Citylines.co to use and distribute it under our current license terms.',
      p2: 'You hereby grant to Citylines.co a licence to do any act that is restricted by copyright, database right or any related right over anything within the contents you contributed.',
      p3: 'Citylines.co agrees that it may only use or sub-license the content you contributed as part of a database and only under the terms of the ODbL 1.0 license for the database and DbCL 1.0 license for the individual contents of the database.'
    },
    privacy: {
      title: 'Privacy policy',
      p1: 'Citylines.co collects your name, surname, email and screen name (if applicable), which are retrieved from the authentication system when you log in using Google or Twitter.',
      p2: 'Citylines.co stores this data in a secured private database.',
      p3: 'Citylines.co uses your information only for authentication purposes or to send you emails occasionally.',
      p4: 'Citylines.co won’t share your information with no one else.',
      p5: 'You can ask Citylines.co, at any time, to delete your personal information from it’s database.'
    }
  },
  data: {
    short_title: 'Data',
    title: "Our data is open",
    download: "Download",
    license: "The information stored in the <b>citylines.co</b> database is under the <a class='c-link' href='http://opendatacommons.org/licenses/odbl/1.0/' target='_blank'> Open Database License</a> (ODbL)",
    see_terms_1: "See the",
    see_terms_2: "terms of use",
    cities: 'Cities',
    systems: 'Systems',
    lines: 'Lines',
    features: 'Tracks',
    stations: 'Stations'
  },
  user: {
    my_cities: 'My cities',
    cities_of_user: 'Cities of %(name)s',
    table: {
      city: 'City',
      created_km: 'Km created',
      created_stations: 'Stations created',
      modified_or_deleted_elements: 'Modified or deleted elements',
      caption: 'Cities are ordered by created km and number of modified features'
    },
    you_never_contributed: "You haven't contributed to any city yet!",
    user_never_contributed: "%(name)s hasn't contributed to any city yet",
    see_cities: 'See cities'
  }
}
