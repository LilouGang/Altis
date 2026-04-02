export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
}

export const zoomIn = (prev: ViewState) => ({ ...prev, zoom: prev.zoom + 1, transitionDuration: 400 });
export const zoomOut = (prev: ViewState) => ({ ...prev, zoom: prev.zoom - 1, transitionDuration: 400 });
export const resetNorth = (prev: ViewState) => ({ ...prev, bearing: 0, transitionDuration: 700 });
export const toggle3D = (prev: ViewState) => ({ ...prev, pitch: prev.pitch === 0 ? 60 : 0, transitionDuration: 900 });