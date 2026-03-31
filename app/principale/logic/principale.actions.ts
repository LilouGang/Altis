export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export const zoomIn = (prev: ViewState) => ({ ...prev, zoom: prev.zoom + 1 });
export const zoomOut = (prev: ViewState) => ({ ...prev, zoom: prev.zoom - 1 });
export const resetNorth = (prev: ViewState) => ({ ...prev, bearing: 0 });
export const toggle3D = (prev: ViewState) => ({ ...prev, pitch: prev.pitch === 0 ? 60 : 0 });