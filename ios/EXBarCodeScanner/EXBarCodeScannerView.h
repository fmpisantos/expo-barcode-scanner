// Copyright 2018-present 650 Industries. All rights reserved.

#import <AVFoundation/AVFoundation.h>
#import <UIKit/UIKit.h>
#import <UMCore/UMModuleRegistry.h>
#import <UMCore/UMAppLifecycleListener.h>
#import <EXBarCodeScanner/EXBarCodeScannerView.h>

static const int EXFlashModeTorch = 3;
typedef NS_ENUM(NSInteger, EXCameraFlashMode) {
  EXCameraFlashModeOff = AVCaptureFlashModeOff,
  EXCameraFlashModeOn = AVCaptureFlashModeOn,
  EXCameraFlashModeTorch = EXFlashModeTorch,
  EXCameraFlashModeAuto = AVCaptureFlashModeAuto
};

typedef NS_ENUM(NSInteger, EXCameraAutoFocus) {
  EXCameraAutoFocusOff = AVCaptureFocusModeLocked,
  EXCameraAutoFocusOn = AVCaptureFocusModeContinuousAutoFocus,
};

@interface EXBarCodeScannerView : UIView <UMAppLifecycleListener>


@property (nonatomic, assign) NSInteger presetCamera;
@property (nonatomic, strong) NSArray *barCodeTypes;
@property (nonatomic, assign) EXCameraFlashMode flashMode;
@property (nonatomic, assign) NSInteger autoFocus;

- (instancetype)initWithModuleRegistry:(UMModuleRegistry *)moduleRegistry;
- (void)onReady;
- (void)onMountingError:(NSDictionary *)event;
- (void)onBarCodeScanned:(NSDictionary *)event;
- (void)updateFlashMode;
- (void)updateFocusMode;

@end
