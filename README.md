## React Native Syntax Highlighter


Syntax highlighting component for `React Native` using <a href='https://github.com/conorhastings/react-syntax-highlighter'> `react-syntax-highlighter`</a>

<img src='./react-native-syntax-highlighter.gif' />

### Install

`npm install react-native-syntax-highlighter --save`


### Use

#### props
Accepts all of the same props as <a href='https://github.com/conorhastings/react-syntax-highlighter'> `react-syntax-highlighter`</a> with two additional props.
* `fontFamily` - the font family to use for syntax text.
* `fontSize` - the fontSize for syntax text.

```js
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';
const Component = () => {
  const codeString = '(num) => num + 1';
  return <SyntaxHighlighter language='javascript' style={docco}>{codeString}</SyntaxHighlighter>;  
}
```
