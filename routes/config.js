var express = require('express');
var router = express.Router();
var path = require('path');
var url = require('url');
var urljoin = require('url-join');

var middleware = require('@mw/config');
/**
 * Load route in route data below
 * All routes must be define here to use
 */
var routeData = [{
  uri: '/',
  routeFile: [
    ['/create-user', 'api/createUser'],
    ['/get-token', 'api/getAccessToken'],
    ['/verify-token', 'api/verifyAccessToken'],
  ]
}, {
  uri: '/user',
  routeFile: [
    ['/list-all', 'api/user/getAllUserInformation'],
    ['/id/:uid/get', 'api/user/getUserInformationByID'],
    ['/:username/get', 'api/user/getUserInformationByUsername'],
  ]
}, {
  uri: '/user/:username/novel',
  routeFile: [
    ['/create', 'api/novel/workspace/createNovel'],
    ['/list-all', 'api/novel/workspace/getUserNovelList'],
  ],
  middleware: [
    'AuthenticationMiddleware',
    'UserPermissionMiddleware'
  ],
  child: [{
    uri: '/id/:novelId',
    routeFile: [
      ['/', 'api/novel/workspace/getNovelInformationByNovelId'],
    ],
    middleware: [
      'ExistedNovelMiddleware',
      'ParticipantRoleMiddleware',
    ],
    child: [{
      routeFile: [
        ['/edit', 'api/novel/workspace/editNovelInformation'],
      ],
      middleware: [
        'NovelOwnerMiddleware'
      ]
    }, {
      routeFile: [
        ['/content', 'api/novel/workspace/manageNovelVolumeAndChapter']
      ],
      middleware: []
    }, {
      routeFile: [
        ['/chapter', 'api/novel/workspace/manageChapterAndTranslate']
      ],
      middleware: ['ChapterMiddleware']
    }]
  }]
}]
var addRoute = function (child = [], parentMiddleware = [], parentUri = '') {
  child.forEach(object => {
    let uri = urljoin(parentUri, object.uri || '');
    uri = uri.charAt(0) == '/' ? uri : '/' + uri; // this line fix url-join lib bug
    let middlewareName = [...parentMiddleware, ...(object.middleware || [])];
    // set child route first to fix middleware run more than one time bug
    if (object.child) {
      addRoute(object.child, middlewareName, uri);
    }
    let middlewareLoaded = middlewareName.map(value => middleware[value]);
    object.routeFile.forEach(routeFile => {
      let fullUri = urljoin(uri, routeFile[0] || '');
      fullUri = fullUri.charAt(0) == '/' ? fullUri : '/' + fullUri;
      router.use(fullUri, ...middlewareLoaded, require(path.join(__dirname, routeFile[1])));
      console.log({
        uri: fullUri,
        mw: middlewareName
      })
    })
  })
}
addRoute(routeData);

module.exports = router;