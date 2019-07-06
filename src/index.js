import React from 'react';
import { Text, ScrollView, Platform } from 'react-native';
import SyntaxHighlighter from 'react-syntax-highlighter';
import SyntaxHighlighterPrism from 'react-syntax-highlighter/prism';
import { createStyleObject } from 'react-syntax-highlighter/create-element';
import { defaultStyle } from'react-syntax-highlighter/styles/hljs';
import { prism as prismDefaultStyle } from'react-syntax-highlighter/styles/prism'; 

const styleCache = new Map();

const topLevelPropertiesToRemove = [
  "color", 
  "textShadow", 
  "textAlign", 
  "whiteSpace", 
  "wordSpacing",
  "wordBreak",
  "wordWrap",
  "lineHeight",
  "MozTabSize",
  "OTabSize",
  "tabSize",
  "WebkitHyphens",
  "MozHyphens",
  "msHyphens",
  "hyphens",
  "fontFamily"
];

function generateNewStylesheet({ stylesheet, highlighter }) {
  if (styleCache.has(stylesheet)) {
    return styleCache.get(stylesheet);
  }
  // I don't know why, but sometimes 'stylesheet' comes as an Array
  // like this [{ stylesheet }, { opacity: 0.85 }], instead of an Object,
  // so this throws an error referenced at issue #17
  // So, this is a workaround, if the  stylesheet is an Array,
  // returns the first element, wich is the actual style object.
  stylesheet = Array.isArray(stylesheet) ? stylesheet[0] : stylesheet;
  const transformedStyle = Object.entries(stylesheet).reduce((newStylesheet, [className, style]) => {
    newStylesheet[className] = Object.entries(style).reduce((newStyle, [key, value]) => {
      if (key === 'overflowX' || key === "overflow") {
        newStyle.overflow = value === 'auto' ? 'scroll' : value;
      }
      else if (value.includes('em')) {
        const [num] = value.split('em');
        newStyle[key] = Number(num) * 16;
      }
      else if (key === 'background') {
        newStyle.backgroundColor = value;
      }
      else if (key === 'display') {
        return newStyle;
      }
      else {
        newStyle[key] = value;
      }
      return newStyle;
    }, {});
    return newStylesheet;
  }, {});
  const topLevel = highlighter === "prism" ?  transformedStyle['pre[class*=\"language-\"]'] :  transformedStyle.hljs;
  const defaultColor = topLevel && topLevel.color || "#000";
  topLevelPropertiesToRemove.forEach(property => {
    if (topLevel[property]) {
      delete topLevel[property];
    }
  });
  if (topLevel.backgroundColor === "none") {
    delete topLevel.backgroundColor;
  }
  const codeLevel =  transformedStyle['code[class*=\"language-\"]'];
  if (highlighter === "prism" && !!codeLevel) {
    topLevelPropertiesToRemove.forEach(property => {
      if (codeLevel[property]) {
        delete codeLevel[property];
      }
    });
    if (codeLevel.backgroundColor === "none") {
      delete codeLevel.backgroundColor;
    }
  }
  styleCache.set(stylesheet, { transformedStyle, defaultColor });
  return  { transformedStyle, defaultColor };
}

function createChildren({ stylesheet, fontSize, fontFamily }) {
  let childrenCount = 0;
  return (children, defaultColor) => {
    childrenCount += 1;
    return children.map((child, i) => createNativeElement({
      node: child,
      stylesheet,
      key:`code-segment-${childrenCount}-${i}`,
      defaultColor,
      fontSize,
      fontFamily
    }));
  }
}

function createNativeElement({ node, stylesheet, key, defaultColor, fontFamily, fontSize = 12 }) {
  const { properties, type, tagName: TagName, value } = node;
  const startingStyle = { fontFamily, fontSize, height: fontSize + 5 };
  if (type === 'text') {
    return (
      <Text
        key={key}
        style={Object.assign({ color: defaultColor }, startingStyle)}
      >
        {value}
      </Text>
    );
  } else if (TagName) {
    const childrenCreator = createChildren({ stylesheet, fontSize, fontFamily });
    const style = createStyleObject(
      properties.className,
      Object.assign(
        { color: defaultColor },
        properties.style,
        startingStyle
      ),
      stylesheet
    );
    const children = childrenCreator(node.children, style.color || defaultColor);
    return <Text key={key} style={style}>{children}</Text>;
  }
}

function nativeRenderer({ defaultColor, fontFamily, fontSize }) {
  return ({ rows, stylesheet }) => rows.map((node, i) => createNativeElement({
    node,
    stylesheet,
    key: `code-segment-${i}`,
    defaultColor,
    fontFamily,
    fontSize
  }))
}


function NativeSyntaxHighlighter({ 
  fontFamily, 
  fontSize, 
  children, 
  highlighter = "highlightjs", 
  style = highlighter === "prism" ? prismDefaultStyle : defaultStyle,
  ...rest
}) {
  const { transformedStyle, defaultColor } = generateNewStylesheet({
    stylesheet: style,
    highlighter
  });
  const Highlighter = (
    highlighter === "prism" 
    ? 
    SyntaxHighlighterPrism 
    : 
    SyntaxHighlighter
  );
  return (
    <Highlighter
      {...rest}
      style={transformedStyle}
      horizontal={true}
      renderer={(nativeRenderer({
        defaultColor,
        fontFamily,
        fontSize
      }))}
    >
      {children}
    </Highlighter>
  );
}

NativeSyntaxHighlighter.defaultProps = {
  fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
  fontSize: 12,
  PreTag: ScrollView,
  CodeTag: ScrollView
};

export default NativeSyntaxHighlighter;
