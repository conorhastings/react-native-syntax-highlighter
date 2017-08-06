import React from 'react';
import { Text, ScrollView, Platform } from 'react-native';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { createStyleObject } from 'react-syntax-highlighter/dist/create-element';
import { defaultStyle } from'react-syntax-highlighter/dist/styles';


const styleCache = new Map();

function generateNewStylesheet(stylesheet) {
  if (styleCache.has(stylesheet)) {
    return styleCache.get(stylesheet);
  }
  const transformedStyle = Object.entries(stylesheet).reduce((newStylesheet, [className, style]) => {
    newStylesheet[className] = Object.entries(style).reduce((newStyle, [key, value]) => {
      if (key === 'overflowX') {
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
  styleCache.set(stylesheet, transformedStyle);
  return transformedStyle;
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
  const startingStyle = { fontFamily, fontSize, height: fontSize + 2 };
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


function NativeSyntaxHighlighter({ fontFamily, fontSize, style, children, ...rest}) {
  const transformedStyle = generateNewStylesheet(style);
  const defaultColor = transformedStyle.hljs && transformedStyle.hljs.color || '#000';
  if (transformedStyle.hljs && transformedStyle.hljs.color) {
    delete transformedStyle.hljs.color;
  }
  return (
    <SyntaxHighlighter
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
    </SyntaxHighlighter>
  );
}

NativeSyntaxHighlighter.defaultProps = {
  fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
  fontSize: 12,
  style: defaultStyle,
  PreTag: ScrollView,
  CodeTag: ScrollView
};

export default NativeSyntaxHighlighter;
