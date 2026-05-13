export type ViewMode = 'guests' | 'venues';
export type RouteMode = 'showroom' | 'products';

export interface ShowroomProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  routeMode?: RouteMode;
  onNavigateProducts?: () => void;
  onNavigateShowroom?: (view?: ViewMode) => void;
}
