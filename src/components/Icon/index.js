import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../config/color';


function SearchGlyph({color, size}) {
  const ring = size * 0.62;
  return (
    <View style={{width: size, height: size}}>
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring,
          borderWidth: 2,
          borderColor: color,
          marginTop: size * 0.05,
          marginLeft: size * 0.05,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.34,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          right: 1,
          bottom: size * 0.14,
          transform: [{rotate: '45deg'}],
        }}
      />
    </View>
  );
}

function CloseGlyph({color, size}) {
  const bar = {
    position: 'absolute',
    width: size * 0.45,
    height: 2,
    backgroundColor: color,
    borderRadius: 1,
  };
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      <View style={[bar, {transform: [{rotate: '45deg'}]}]} />
      <View style={[bar, {transform: [{rotate: '-45deg'}]}]} />
    </View>
  );
}

function CheckGlyph({color, size}) {
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      <View
        style={{
          width: size * 0.22,
          height: size * 0.42,
          borderRightWidth: 2.2,
          borderBottomWidth: 2.2,
          borderColor: color,
          transform: [{rotate: '45deg'}, {translateY: -size * 0.06}],
        }}
      />
    </View>
  );
}

function Glyph({symbol, color, size}) {
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      <Text
        style={{
          color,
          fontSize: size * 0.62,
          fontWeight: '800',
          lineHeight: size,
          textAlign: 'center',
        }}>
        {symbol}
      </Text>
    </View>
  );
}

function Slash({color, size}) {
  return (
    <View
      style={{
        position: 'absolute',
        width: size * 0.78,
        height: 2,
        backgroundColor: color,
        borderRadius: 1,
        transform: [{rotate: '-45deg'}],
      }}
    />
  );
}

function WifiOffGlyph({color, size}) {
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      {[0.92, 0.64, 0.36].map((scale, index) => (
        <View
          key={scale}
          style={{
            position: 'absolute',
            width: size * scale,
            height: size * scale,
            borderRadius: size,
            borderWidth: 2,
            borderColor: color,
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            transform: [{rotate: '-45deg'}],
            top: size * (0.02 + index * 0.1),
          }}
        />
      ))}
      <View
        style={{
          position: 'absolute',
          width: 3.5,
          height: 3.5,
          borderRadius: 2,
          backgroundColor: color,
          bottom: size * 0.1,
          left: size * 0.18,
        }}
      />
      <Slash color={color} size={size} />
    </View>
  );
}

function RefreshGlyph({color, size}) {
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      <Text
        style={{
          color,
          fontSize: size * 0.78,
          fontWeight: '700',
          lineHeight: size,
          textAlign: 'center',
        }}>
        ↻
      </Text>
    </View>
  );
}

function GearGlyph({color, size}) {
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      <Text
        style={{
          color,
          fontSize: size * 0.72,
          lineHeight: size,
          textAlign: 'center',
        }}>
        ⚙
      </Text>
    </View>
  );
}

function LockGlyph({color, size}) {
  const stroke = Math.max(1.8, size * 0.1);
  const shackle = size * 0.4;
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      <View
        style={{
          width: shackle,
          height: size * 0.3,
          borderWidth: stroke,
          borderBottomWidth: 0,
          borderColor: color,
          borderTopLeftRadius: shackle,
          borderTopRightRadius: shackle,
          marginBottom: -stroke,
        }}
      />
      <View
        style={{
          width: size * 0.68,
          height: size * 0.5,
          borderRadius: size * 0.14,
          borderWidth: stroke,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: size * 0.12,
            height: size * 0.16,
            borderRadius: size * 0.06,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

function ClockGlyph({color, size}) {
  const stroke = Math.max(1.8, size * 0.1);
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: stroke,
          height: size * 0.3,
          backgroundColor: color,
          borderRadius: 99,
          top: size * 0.22,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.26,
          height: stroke,
          backgroundColor: color,
          borderRadius: 99,
          left: size * 0.5 - stroke / 2,
          top: size * 0.5 - stroke / 2,
        }}
      />
    </View>
  );
}

function ShieldGlyph({color, size}) {
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      <View
        style={{
          width: size * 0.62,
          height: size * 0.72,
          borderWidth: 2,
          borderColor: color,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          borderBottomLeftRadius: size * 0.32,
          borderBottomRightRadius: size * 0.32,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: size * 0.16,
            height: size * 0.28,
            borderRightWidth: 1.8,
            borderBottomWidth: 1.8,
            borderColor: color,
            transform: [{rotate: '45deg'}, {translateY: -1}],
          }}
        />
      </View>
    </View>
  );
}

function ChevronDownGlyph({color, size}) {
  const bar = size * 0.46;
  const thickness = Math.max(1.8, size * 0.14);
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      <View
        style={{
          width: bar,
          height: bar,
          borderBottomWidth: thickness,
          borderRightWidth: thickness,
          borderColor: color,
          transform: [{rotate: '45deg'}, {translateY: -size * 0.1}],
        }}
      />
    </View>
  );
}

function InfoCircleGlyph({color, size}) {
  const stroke = Math.max(1.6, size * 0.1);
  return (
    <View style={[styles.center, {width: size, height: size}]}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: stroke * 1.15,
            height: stroke * 1.15,
            borderRadius: stroke,
            backgroundColor: color,
            marginBottom: size * 0.08,
          }}
        />
        <View
          style={{
            width: stroke,
            height: size * 0.28,
            borderRadius: stroke,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

export default function Icon({
  name,
  color,
  size = 20,
  circle = false,
  filled = false,
  circleColor,
  style,
}) {
  const inner = size * (circle ? (filled ? 0.58 : 0.72) : 1);
  const glyphColor = filled && circle ? colors.white : color;
  let glyph = null;
  if (name === 'search') {
    glyph = <SearchGlyph color={glyphColor} size={inner} />;
  } else if (name === 'close') {
    glyph = <CloseGlyph color={glyphColor} size={inner} />;
  } else if (name === 'check') {
    glyph = <CheckGlyph color={glyphColor} size={inner} />;
  } else if (name === 'alert') {
    glyph = <Glyph symbol="!" color={glyphColor} size={inner} />;
  } else if (name === 'info') {
    glyph = <Glyph symbol="i" color={glyphColor} size={inner} />;
  } else if (name === 'warning') {
    glyph = <Glyph symbol="!" color={glyphColor} size={inner} />;
  } else if (name === 'wifiOff') {
    glyph = <WifiOffGlyph color={glyphColor} size={inner} />;
  } else if (name === 'refresh') {
    glyph = <RefreshGlyph color={glyphColor} size={inner} />;
  } else if (name === 'gear') {
    glyph = <GearGlyph color={glyphColor} size={inner} />;
  } else if (name === 'lock') {
    glyph = <LockGlyph color={glyphColor} size={inner} />;
  } else if (name === 'shield') {
    glyph = <ShieldGlyph color={glyphColor} size={inner} />;
  } else if (name === 'clock') {
    glyph = <ClockGlyph color={glyphColor} size={inner} />;
  } else if (name === 'chevronDown') {
    glyph = <ChevronDownGlyph color={glyphColor} size={inner} />;
  } else if (name === 'infoCircle') {
    glyph = <InfoCircleGlyph color={glyphColor} size={inner} />;
  }

  if (!circle) {
    return <View style={style}>{glyph}</View>;
  }

  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size,
          borderWidth: filled ? 0 : 1.8,
          borderColor: circleColor || color,
          backgroundColor: filled ? color : 'transparent',
        },
        style,
      ]}>
      {glyph}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
