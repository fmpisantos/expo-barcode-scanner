/*import { requireNativeViewManager } from '@unimodules/core';

const ExpoBarCodeScannerView = requireNativeViewManager('ExpoBarCodeScannerView');

export default ExpoBarCodeScannerView;*/


import { requireNativeViewManager } from '@unimodules/core';
import * as React from 'react';

import { BarCodeScannerProps } from 'expo-barcode-scanner/src/BarCodeScanner';

const ExpoBarCodeScannerView: React.ComponentType<BarCodeScannerProps> = requireNativeViewManager(
  'ExpoBarCodeScannerView'
);

export default ExpoBarCodeScannerView;
