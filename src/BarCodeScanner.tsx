import { UnavailabilityError } from '@unimodules/core';
import { PermissionResponse, PermissionStatus } from 'expo-modules-core';
import * as React from 'react';
import { Platform, ViewProps } from 'react-native';

import ExpoBarCodeScannerModule from './ExpoBarCodeScannerModule';
import ExpoBarCodeScannerView from './ExpoBarCodeScannerView';
import CameraManager from 'expo-camera/src/ExponentCameraManager';

import { ConversionTables, ensureNativeProps } from 'expo-camera/src/utils/props';

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
  target?: number;
};

export type BarCodeEventCallbackArguments = {
  nativeEvent: BarCodeEvent;
};

export type BarCodeScannedCallback = (params: BarCodeEvent) => void;

export { PermissionResponse, PermissionStatus };

export interface BarCodeScannerProps extends ViewProps {
  type?: 'front' | 'back' | number;
  barCodeTypes?: string[];
  flashMode?: "off" | "on" | "auto" | "torch",
  autoFocus?: "on" | "off",
  onBarCodeScanned?: BarCodeScannedCallback;
}

export class BarCodeScanner extends React.Component<BarCodeScannerProps> {
  lastEvents: { [key: string]: any } = {};
  lastEventsTimes: { [key: string]: any } = {};

  static Constants = {
    BarCodeType,
    Type,
    FlashMode: CameraManager.FlashMode,
    AutoFocus: CameraManager.AutoFocus,
  };

  static ConversionTables = {
    type: Type,
    flashMode: ConversionTables.flashMode,
    autoFocus: ConversionTables.autoFocus
  };

  static defaultProps = {
    type: Type.back,
    barCodeTypes: Object.values(BarCodeType),
    autoFocus: CameraManager.AutoFocus.on,
    flashMode: CameraManager.FlashMode.off,
  };

  static async getPermissionsAsync(): Promise<PermissionResponse> {
    return ExpoBarCodeScannerModule.getPermissionsAsync();
  }

  static async requestPermissionsAsync(): Promise<PermissionResponse> {
    return ExpoBarCodeScannerModule.requestPermissionsAsync();
  }

  static async scanFromURLAsync(
    url: string,
    barCodeTypes: string[] = Object.values(BarCodeType)
  ): Promise<BarCodeScannerResult[]> {
    if (!ExpoBarCodeScannerModule.scanFromURLAsync) {
      throw new UnavailabilityError('expo-barcode-scanner', 'scanFromURLAsync');
    }
    if (Array.isArray(barCodeTypes) && !barCodeTypes.length) {
      throw new Error('No barCodeTypes specified; provide at least one barCodeType for scanner');
    }

    if (Platform.OS === 'ios') {
      if (Array.isArray(barCodeTypes) && !barCodeTypes.includes(BarCodeType.qr)) {
        // Only QR type is supported on iOS, fail if one tries to use other types
        throw new Error('Only QR type is supported by scanFromURLAsync() on iOS');
      }
      // on iOS use only supported QR type
      return await ExpoBarCodeScannerModule.scanFromURLAsync(url, [BarCodeType.qr]);
    }

    // On other platforms, if barCodeTypes is not provided, use all available types
    return await ExpoBarCodeScannerModule.scanFromURLAsync(url, barCodeTypes);
  }

  render() {
    const nativeProps = ensureNativeProps(this.props);
    console.log(nativeProps)
    const { onBarCodeScanned } = this.props;
    return (
      <ExpoBarCodeScannerView
        {...nativeProps}
        onBarCodeScanned={this.onObjectDetected(onBarCodeScanned)}
      />
    );
  }

  onObjectDetected = (callback?: BarCodeScannedCallback) => ({
    nativeEvent,
  }: BarCodeEventCallbackArguments) => {
    const { type } = nativeEvent;
    if (
      this.lastEvents[type] &&
      this.lastEventsTimes[type] &&
      JSON.stringify(nativeEvent) === this.lastEvents[type] &&
      Date.now() - this.lastEventsTimes[type] < EVENT_THROTTLE_MS
    ) {
      return;
    }

    if (callback) {
      callback(nativeEvent);
      this.lastEventsTimes[type] = new Date();
      this.lastEvents[type] = JSON.stringify(nativeEvent);
    }
  };

  convertNativeProps(props: BarCodeScannerProps) {
    const nativeProps: BarCodeScannerProps = {};

    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'string' && BarCodeScanner.ConversionTables[key]) {
        nativeProps[key] = BarCodeScanner.ConversionTables[key][value];
      } else {
        nativeProps[key] = value;
      }
    }

    return nativeProps;
  }
}

export const { Constants, getPermissionsAsync, requestPermissionsAsync } = BarCodeScanner;
