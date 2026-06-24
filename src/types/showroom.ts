export type ViewMode = 'guests' | 'venues';
export type RouteMode = 'showroom' | 'redesign';

export interface ShowroomProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  routeMode?: RouteMode;
  onNavigateShowroom?: (view?: ViewMode) => void;
}
