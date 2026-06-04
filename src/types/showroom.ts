export type ViewMode = 'guests' | 'venues';
export type RouteMode = 'showroom' | 'products' | 'redesign';

export interface ShowroomProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  routeMode?: RouteMode;
  onNavigateProducts?: () => void;
  onNavigateShowroom?: (view?: ViewMode) => void;
}
