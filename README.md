## React Native Syntax Highlighter


Syntax highlighting component for `React Native` using <a href='https://github.com/conorhastings/react-syntax-highlighter'> `react-syntax-highlighter`</a>

<img src='./react-native-syntax-highlighter.gif' />

You can try it out with <a href='https://expo.io'>Expo</a> <a href='https://expo.io/@conor/test-native-syntax'>here</a>

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

### Unsupported Props
Some of the react-syntax-highlighter props are not currently supported by the mobile version, you can see which listed below:

- useInlineStyles
- showLineNumbers
- startingLineNumber
- lineNumberContainerStyle
- lineNumberStyle

### Styles Available   

- agate
- androidstudio
- arduinoLight
- arta
- ascetic
- atelierCaveDark
- atelierCaveLight
- atelierDuneDark
- atelierDuneLight
- atelierEstuaryDark
- atelierEstuaryLight
- atelierForestDark
- atelierForestLight
- atelierHeathDark
- atelierHeathLight
- atelierLakesideDark
- atelierLakesideLight
- atelierPlateauDark
- atelierPlateauLight
- atelierSavannaDark
- atelierSavannaLight
- atelierSeasideDark
- atelierSeasideLight
- atelierSulphurpoolDark
- atelierSurphulpoolLight
- atomOneDark
- atomOneLight
- brownPaper
- codepenEmbed
- colorBrewer
- dark
- darkula
- defaultStyle
- docco
- dracula
- far
- foundation
- githubGist
- github
- googlecode
- grayscale
- gruvboxDark
- gruvboxLight
- hopscotch
- hybrid
- idea
- irBlack
- kimbieDark
- kimbieLight
- magula
- monoBlue
- monokaiSublime
- monokai
- obsidian
- ocean
- paraisoDark
- paraisoLight
- pojoaque
- purebasic
- qtcreatorDark
- qtcreatorLight
- railscasts
- rainbow
- schoolBook
- solarizedDark
- solarizedLight
- sunburst
- tomorrowNightBlue
- tomorrowNightBright
- tomorrowNightEighties
- tomorrowNight
- tomorrow
- vs
- xcode
- xt256
- zenburn


