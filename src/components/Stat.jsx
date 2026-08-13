import { useCountUp } from "../hooks/useCountUp";
import { useInView } from "../hooks/useInView";

export function Stat({ label, target }) {
  const [ref, inView] = useInView(0.5);
  const value = useCountUp(target, inView);

  return (
    <div ref={ref} className="ff-stat">
      <div className="ff-stat__num">{value}</div>
      <div className="ff-stat__label">{label}</div>
    </div>
  );
}
