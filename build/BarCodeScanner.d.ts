import { PermissionResponse, PermissionStatus } from 'expo-modules-core';
import * as React from 'react';
import { ViewProps } from 'react-native';
export declare type BarCodePoint = {
    x: number;
    y: number;
};
export declare type BarCodeSize = {
    height: number;
    width: number;
};
export declare type BarCodeBounds = {
    origin: BarCodePoint;
    size: BarCodeSize;
};
export declare type BarCodeScannerResult = {
    type: string;
    data: string;
    bounds?: BarCodeBounds;
    cornerPoints?: BarCodePoint[];
};
export declare type BarCodeEvent = BarCodeScannerResult & {
    target?: number;
};
export declare type BarCodeEventCallbackArguments = {
    nativeEvent: BarCodeEvent;
};
export declare type BarCodeScannedCallback = (params: BarCodeEvent) => void;
export { PermissionResponse, PermissionStatus };
export interface BarCodeScannerProps extends ViewProps {
    type?: 'front' | 'back' | number;
    barCodeTypes?: string[];
    flashMode?: "off" | "on" | "auto" | "torch";
    autoFocus?: "on" | "off";
    onBarCodeScanned?: BarCodeScannedCallback;
}
export declare class BarCodeScanner extends React.Component<BarCodeScannerProps> {
    lastEvents: {
        [key: string]: any;
    };
    lastEventsTimes: {
        [key: string]: any;
    };
    static Constants: {
        BarCodeType: any;
        Type: any;
        FlashMode: any;
        AutoFocus: any;
    };
    static ConversionTables: {
        type: any;
        flashMode: Record<"on" | "off" | "auto" | "torch", string | number | undefined>;
        autoFocus: Record<"on" | "off" | "auto" | "singleShot", string | number | boolean | undefined>;
    };
    static defaultProps: {
        type: any;
        barCodeTypes: unknown[];
        autoFocus: any;
        flashMode: any;
    };
    static getPermissionsAsync(): Promise<PermissionResponse>;
    static requestPermissionsAsync(): Promise<PermissionResponse>;
    static scanFromURLAsync(url: string, barCodeTypes?: string[]): Promise<BarCodeScannerResult[]>;
    render(): JSX.Element;
    onObjectDetected: (callback?: BarCodeScannedCallback | undefined) => ({ nativeEvent, }: BarCodeEventCallbackArguments) => void;
    convertNativeProps(props: BarCodeScannerProps): BarCodeScannerProps;
}
export declare const Constants: {
    BarCodeType: any;
    Type: any;
    FlashMode: any;
    AutoFocus: any;
}, getPermissionsAsync: typeof BarCodeScanner.getPermissionsAsync, requestPermissionsAsync: typeof BarCodeScanner.requestPermissionsAsync;
