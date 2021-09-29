import { PermissionResponse, PermissionStatus } from 'expo-modules-core';

import ExpoBarCodeScannerModule from 'expo-barcode-scanner/src/ExpoBarCodeScannerModule';
import { ViewProps } from 'react-native';
const { BarCodeType, Type } = ExpoBarCodeScannerModule;

const EVENT_THROTTLE_MS = 500;

export type BarCodePoint = {
  x: number;
  y: number;
};

export type BarCodeSize = {
  height: number;
  width: number;
};

export type BarCodeBounds = {
  origin: BarCodePoint;
  size: BarCodeSize;
};

export type BarCodeScannerResult = {
  type: string;
  data: string;
  bounds?: BarCodeBounds;
  cornerPoints?: BarCodePoint[];
};

export type BarCodeEvent = BarCodeScannerResult & {
    nativeEvent: BarCodeEvent;
  target?: number;
};

export type BarCodeEventCallbackArguments = {
  nativeEvent: BarCodeEvent;
};

export type BarCodeScannedCallback = (params: BarCodeEvent) => void;

export type BarCodeScannerProps = {
    pointerEvents?: any;
    style?: any;
    ref?: Function;
    onBarCodeScanned?: BarCodeScannedCallback;
    flashMode?: number | string;
    autoFocus?: string | boolean | number;
  };