# tgz-foreach

modify .tgz file entries:

Open `./files/package.tgz` and print each file path:

```javascript 
const tgz_modify = require('tgz-foreach')
tgz_foreach('files/package.tgz', (header, data) => {
  console.log('file path:', header.name)
})
```


