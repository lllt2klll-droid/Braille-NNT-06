import './ProgressBar.css';
export default function ProgressBar({ value=0, max=100, label }){
  const pct = Math.max(0, Math.min(100, (value/max)*100));
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <div className="progress-track"><div className="progress-fill" style={{width: `${pct}%`}} /></div>
      {label && <div className="progress-label">{label} {Math.round(pct)}%</div>}
    </div>
  );
}
