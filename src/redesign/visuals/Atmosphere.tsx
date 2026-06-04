/**
 * Atmosphere — the warm, living backdrop for the light direction.
 * Fixed behind every section: slow amber + sage radial washes plus a faint
 * paper grain. Replaces the dark site's yuzu-on-black ambient glow. Purely
 * decorative, so it is aria-hidden and pointer-events:none (set in CSS).
 */
export function Atmosphere() {
  return (
    <div className="tapin-light__atmosphere" aria-hidden="true">
      <div className="tapin-light__washes" />
      <div className="tapin-light__grain" />
    </div>
  );
}
