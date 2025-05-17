const path = require('path');

module.exports = {
  packagerConfig: {
    icon: 'assets/icon', // optional icon without extension
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'tomproject',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
  ],
};