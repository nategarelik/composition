import { useRef, useEffect, DependencyList } from 'react';
import * as d3 from 'd3-selection';

/**
 * Custom hook for integrating D3.js with React.
 *
 * Pattern: "D3 for math, React for DOM"
 * - D3 calculates positions, layouts, transitions
 * - React renders and updates the DOM
 * - This hook bridges them via useRef + useEffect
 *
 * @param renderFn - Function that receives D3 selection and performs operations
 * @param deps - Dependency array (like useEffect)
 * @returns Ref to attach to the SVG element
 *
 * @example
 * function MyChart({ data }) {
 *   const svgRef = useD3(
 *     (svg) => {
 *       svg.selectAll('circle')
 *         .data(data)
 *         .join('circle')
 *         .attr('r', 5);
 *     },
 *     [data]
 *   );
 *   return <svg ref={svgRef} />;
 * }
 */
export function useD3<T extends SVGElement = SVGSVGElement>(
  renderFn: (selection: d3.Selection<T, unknown, null, undefined>) => void,
  deps: DependencyList
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      renderFn(d3.select(ref.current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export default useD3;
