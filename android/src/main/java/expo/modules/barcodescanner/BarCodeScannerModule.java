package expo.modules.barcodescanner;

import android.Manifest;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import expo.modules.barcodescanner.utils.BarCodeScannerResultSerializer;
import expo.modules.interfaces.barcodescanner.BarCodeScannerInterface;
import expo.modules.interfaces.barcodescanner.BarCodeScannerResult;
import expo.modules.interfaces.barcodescanner.BarCodeScannerSettings;
import expo.modules.interfaces.imageloader.ImageLoaderInterface;
import expo.modules.interfaces.permissions.Permissions;

import com.google.android.gms.vision.barcode.Barcode;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.unimodules.core.ExportedModule;
import org.unimodules.core.ModuleRegistry;
import org.unimodules.core.Promise;
import org.unimodules.core.interfaces.ExpoMethod;

import static expo.modules.barcodescanner.ExpoBarCodeScanner.CAMERA_TYPE_BACK;
import static expo.modules.barcodescanner.ExpoBarCodeScanner.CAMERA_TYPE_FRONT;

public class BarCodeScannerModule extends ExportedModule {
  private static final String TAG = "ExpoBarCodeScannerModule";
  private static final String ERROR_TAG = "E_BARCODE_SCANNER";
  private final BarCodeScannerProvider mBarCodeScannerProvider;
  private ModuleRegistry mModuleRegistry;

  private static final Map<String, Object> VALID_BARCODE_TYPES =
      Collections.unmodifiableMap(new HashMap<String, Object>() {
        {
          put("aztec", Barcode.AZTEC);
          put("ean13", Barcode.EAN_13);
          put("ean8", Barcode.EAN_8);
          put("qr", Barcode.QR_CODE);
          put("pdf417", Barcode.PDF417);
          put("upc_e", Barcode.UPC_E);
          put("datamatrix", Barcode.DATA_MATRIX);
          put("code39", Barcode.CODE_39);
          put("code93", Barcode.CODE_93);
          put("itf14", Barcode.ITF);
          put("codabar", Barcode.CODABAR);
          put("code128", Barcode.CODE_128);
          put("upc_a", Barcode.UPC_A);
        }
      });

  @Override
  public void onCreate(ModuleRegistry moduleRegistry) {
    mModuleRegistry = moduleRegistry;
  }

  public BarCodeScannerModule(Context context) {
    super(context);
    mBarCodeScannerProvider = new BarCodeScannerProvider();
  }

  @Override
  public String getName() {
    return TAG;
  }

  @Override
  public Map<String, Object> getConstants() {
    return Collections.unmodifiableMap(new HashMap<String, Object>() {
      {
        put("BarCodeType", getBarCodeConstants());
        put("Type", getTypeConstants());
        put("FlashMode", getFlashModeConstants());
        put("AutoFocus", getAutoFocusConstants());
      }
      private Map<String, Object> getAutoFocusConstants() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("on", true);
            put("off", false);
          }
        });
      }
      private Map<String, Object> getBarCodeConstants() {
        return VALID_BARCODE_TYPES;
      }
      private Map<String, Object> getFlashModeConstants() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("off", Constants.FLASH_OFF);
            put("on", Constants.FLASH_ON);
            put("auto", Constants.FLASH_AUTO);
            put("torch", Constants.FLASH_TORCH);
          }
        });
      }
      private Map<String, Object> getTypeConstants() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("front", CAMERA_TYPE_FRONT);
            put("back", CAMERA_TYPE_BACK);
          }
        });
      }
    });
  }

  @ExpoMethod
  public void requestPermissionsAsync(final Promise promise) {
    Permissions.askForPermissionsWithPermissionsManager(mModuleRegistry.getModule(Permissions.class), promise, Manifest.permission.CAMERA);
  }

  @ExpoMethod
  public void getPermissionsAsync(final Promise promise) {
    Permissions.getPermissionsWithPermissionsManager(mModuleRegistry.getModule(Permissions.class), promise, Manifest.permission.CAMERA);
  }

  @ExpoMethod
  public void scanFromURLAsync(final String url, final List<Double> barCodeTypes, final Promise promise) {
    final List<Integer> types = new ArrayList<>();
    if (barCodeTypes != null) {
      for (int i = 0; i < barCodeTypes.size(); i++) {
        types.add(barCodeTypes.get(i).intValue());
      }
    }

    final ImageLoaderInterface imageLoader = mModuleRegistry.getModule(ImageLoaderInterface.class);
    imageLoader.loadImageForManipulationFromURL(url, new ImageLoaderInterface.ResultListener() {
      @Override
      public void onSuccess(@NonNull Bitmap bitmap) {
        BarCodeScannerInterface scanner = mBarCodeScannerProvider.createBarCodeDetectorWithContext(getContext());
        scanner.setSettings(new BarCodeScannerSettings() {{
          putTypes(types);
        }});
        List<BarCodeScannerResult> results = scanner.scanMultiple(bitmap);

        List<Bundle> resultList = new ArrayList<>();
        for (BarCodeScannerResult result : results) {
          if (types.contains(result.getType())) {
            resultList.add(BarCodeScannerResultSerializer.toBundle(result, 1.0f));
          }
        }
        promise.resolve(resultList);
      }

      @Override
      public void onFailure(@Nullable Throwable cause) {
        promise.reject(ERROR_TAG + "_IMAGE_RETRIEVAL_ERROR", "Could not get the image from given url: '" + url + "'", cause);
      }
    });
  }
}