const path = require('path')
const fs = require('fs')

const libPackagePath = path.join(__dirname, 'src/datav/patch/package.json') 
const modulesPackagePath = path.join(__dirname, 'node_modules/@dataview/datav-vue3/package.json')
 
fs.writeFileSync(modulesPackagePath, fs.readFileSync(libPackagePath))
 