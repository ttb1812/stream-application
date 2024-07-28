import {
  Dimensions,
  ScaledSize as RNScaledSize,
  Platform,
  EmitterSubscription,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export class ScaledSize {
  private static _instance?: ScaledSize;
  static instance(): ScaledSize {
    if (!ScaledSize._instance) {
      ScaledSize._instance = new ScaledSize();
    }
    return ScaledSize._instance;
  }
  private _eventSubscription: EmitterSubscription | null = null;

  //iPhone 14 Plus - (resolution): 1284px × 2778px, 428px × 926px viewport
  private designWidth = 428;
  private designHeight = 926;
  private readonly minWidth = 397;
  private readonly _ratio = !DeviceInfo.isTablet() ? 1 : 1.5;
  private readonly _dimensions: RNScaledSize = {
    ...Dimensions.get('screen'),
  };
  private readonly _dimensionsWindow: RNScaledSize = {
    ...Dimensions.get('window'),
  };
  /**
   * work with orientation is portrait
   */
  private _orientation: 'portrait' | 'landscape' = 'portrait';
  constructor(
    dimensions?: RNScaledSize,
    dimensionDesign?: Pick<RNScaledSize, 'width' | 'height'>,
  ) {
    this._dimensions = dimensions || Dimensions.get('screen');

    if (dimensionDesign) {
      this.designHeight = dimensionDesign.height;
      this.designWidth = dimensionDesign.width;
    }

    this.dimensionEventSubscription();
  }

  /**
   * scaledSize.scale(10) Responsive by width screen. (Image Size)
   * */
  scale(size: number): number {
    return ((this._dimensions.width / this.designWidth) * size) / this._ratio;
  }

  /**
   * scaledSize.verticalScale(10) Responsive by height screen.
   * */
  verticalScale = (size: number) => {
    if (this.minWidth > this._dimensions.width) {
      return this.scale(size);
    }

    return ((this._dimensions.height / this.designHeight) * size) / this._ratio;
  };

  /**
   * scaledSize.moderateScale(10) Responsive for padding - margin - fontSize.
   * */
  moderateScale = (
    size: number,
    factor = Platform.OS === 'android' ? 0.7 : 0.5,
  ) => (size + (this.scale(size) - size) * factor) / this._ratio;

  get currentOrientation() {
    return this._orientation;
  }

  get deviceWidth() {
    return this._dimensionsWindow.width;
  }

  // Not include status bar height
  get deviceHeight() {
    return this._dimensionsWindow.height;
  }

  // Only for android
  get deviceWidthScreen() {
    return Platform.OS === 'android'
      ? this._dimensions.width
      : this._dimensionsWindow.width;
  }

  // Only for android
  get deviceHeightScreen() {
    return Platform.OS === 'android'
      ? this._dimensions.height
      : this._dimensionsWindow.height;
  }

  /**
   *
   * listener change width/height
   */
  private dimensionEventSubscription() {
    if (!this._eventSubscription) {
      this._eventSubscription = Dimensions.addEventListener(
        'change',
        ({screen}) => {
          if (screen.height > screen.width) {
            this._orientation = 'portrait';
          } else {
            this._orientation = 'landscape';
          }
        },
      );
    }
  }

  /**
   * remove registered Event
   * */
  destroy() {
    this._eventSubscription?.remove();
  }
}

export const scaledSize = ScaledSize.instance();
