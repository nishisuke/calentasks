import * as firebase from 'firebase/app'

const firebaseConfig = process.env.DEBUG
  ? {
      apiKey: 'AIzaSyCqqsJW9PeipNztCgy7MZ34yjpsYE11wPk',
      authDomain: 'timels.firebaseapp.com',
      databaseURL: 'https://timels.firebaseio.com',
      projectId: 'timels',
      storageBucket: 'timels.appspot.com',
      messagingSenderId: '175384727066',
      appId: '1:175384727066:web:239e8e3cfae23c17474ba3',
      measurementId: 'G-8WSLQQTL9D',
    }
  : {
      apiKey: 'AIzaSyABejcBSNBkAA2XbkzvFIJDP2S-FPOXvXg',
      authDomain: 'calentasks.firebaseapp.com',
      databaseURL: 'https://calentasks.firebaseio.com',
      projectId: 'calentasks',
      storageBucket: 'calentasks.appspot.com',
      messagingSenderId: '483052015807',
      appId: '1:483052015807:web:041f6a5a7a3dc80955f60a',
      measurementId: 'G-TE170CBQF5',
    }

firebase.initializeApp(firebaseConfig)
