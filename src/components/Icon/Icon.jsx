export function Icon({ name, size=20, stroke=2, ...props }) {
  const s = { width: size, height: size, flexShrink: 0 };
  const common = { fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", style: s, "aria-hidden": true, ...props };
  switch (name) {
    case "home": return <svg {...common} viewBox="0 0 24 24"><path d="M3 10L12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10z"/></svg>;
    case "swap": return <svg {...common} viewBox="0 0 24 24"><path d="M17 4l4 4-4 4"/><path d="M3 8h14"/><path d="M7 20l-4-4 4-4"/><path d="M21 16H7"/></svg>;
    case "keyboard": return <svg {...common} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="9" r="1.2" fill="currentColor" stroke="none"/><circle cx="8" cy="15" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg>;
    case "alphabet": return <svg {...common} viewBox="0 0 24 24"><path d="M4 16l3-8 3 8"/><path d="M5.5 12h5"/><path d="M14 8h4"/><path d="M15 8v8"/><path d="M18 12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/></svg>;
    case "learn": return <svg {...common} viewBox="0 0 24 24"><path d="M12 3L2 8l10 5 10-5-10-5z"/><path d="M6 11v3c0 1.5 2 3 6 3s6-1.5 6-3v-3"/><path d="M22 8v5"/></svg>;
    case "practice": return <svg {...common} viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5l4 4L7 21l-4 1 1-4 12.5-14.5z"/></svg>;
    case "search": return <svg {...common} viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case "settings": return <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 1-2 0 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 1 0-2 1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6c.4-.05.8-.2 1-.6a1.65 1.65 0 0 1 2 0c.2.4.6.55 1 .6a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15.4 9a1.65 1.65 0 0 0-.6 1 1.65 1.65 0 0 1 0 2c.05.4.2.8.6 1z"/></svg>;
    case "help": return <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
    case "more": return <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19.5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case "copy": return <svg {...common} viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V7a2 2 0 0 1 2-2h8"/></svg>;
    case "trash": return <svg {...common} viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;
    case "check": return <svg {...common} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>;
    case "x": return <svg {...common} viewBox="0 0 24 24"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>;
    case "play": return <svg {...common} viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/></svg>;
    case "sun": return <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>;
    case "moon": return <svg {...common} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    case "menu": return <svg {...common} viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>;
    case "braille": return <svg {...common} viewBox="0 0 24 24"><circle cx="8" cy="6" r="1.8" fill="currentColor" stroke="none"/><circle cx="16" cy="6" r="1.8" fill="currentColor" stroke="none" opacity="0.35"/><circle cx="8" cy="12" r="1.8" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="1.8" fill="currentColor" stroke="none"/><circle cx="8" cy="18" r="1.8" fill="currentColor" stroke="none" opacity="0.35"/><circle cx="16" cy="18" r="1.8" fill="currentColor" stroke="none" opacity="0.35"/></svg>;
    default: return null;
  }
}
export default Icon;
