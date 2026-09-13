"use client";

/**
 * Side-profile blueprint diagram of a 737-class aircraft.
 * Layers (top to bottom in DOM order):
 *   .acft-skin         — fuselage outline, wings, tail, engines, gear (always visible at 20%)
 *   .acft-skin-detail  — windows, doors, panel lines (fade in with skin)
 *   .acft-systems      — hydraulic/fuel/pneumatic lines, engine fan (fades in at B)
 *   .acft-structure    — ribs, spars, stringers (fades in at C)
 *   .acft-core         — engine internals, APU, avionics, cabin floor (fades in at D)
 *   .acft-stress       — high-fatigue cross-hatch (pulses at D)
 *   .acft-markers      — per-tier inspection dots
 *   .acft-scanline     — 1px sweep line (Beat 2 element)
 */
export default function AircraftDiagram({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 500"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      data-cursor="view"
      data-cursor-label="INSPECT"
      aria-label="Aircraft technical diagram"
    >
      <defs>
        {/* Clean hairline stroke, inherits currentColor from CSS */}
        <style>
          {`
            .acft-line {
              stroke: currentColor;
              stroke-width: 1;
              fill: none;
              stroke-linecap: round;
              stroke-linejoin: round;
              vector-effect: non-scaling-stroke;
            }
            .acft-dashed {
              stroke: currentColor;
              stroke-width: 1;
              fill: none;
              stroke-dasharray: 4 4;
              vector-effect: non-scaling-stroke;
            }
            .acft-faint {
              stroke: currentColor;
              stroke-width: 0.75;
              fill: none;
              opacity: 0.55;
              vector-effect: non-scaling-stroke;
            }
          `}
        </style>
      </defs>

      {/* ═══════════════════════════════════════════════════════════
          SKIN — the base silhouette. Drawn on enter via strokeDasharray.
      ═══════════════════════════════════════════════════════════ */}
      <g className="acft-skin" style={{ opacity: 0.9 }}>
        {/* Fuselage outline */}
        <path
          className="acft-line acft-draw"
          d="M 100 250
             Q 110 203, 200 203
             L 1000 203
             Q 1050 205, 1080 225
             L 1100 250
             L 1080 275
             Q 1050 295, 1000 297
             L 200 297
             Q 110 297, 100 250 Z"
        />

        {/* Wing (side-view projection, swept back) */}
        <path
          className="acft-line acft-draw"
          d="M 380 285
             L 680 330
             L 720 345
             L 540 300 Z"
        />

        {/* Engine nacelle (under wing) */}
        <path
          className="acft-line acft-draw"
          d="M 520 345
             Q 520 315, 560 315
             L 660 315
             Q 680 315, 680 345
             Q 680 385, 660 385
             L 560 385
             Q 520 385, 520 345 Z"
        />

        {/* Vertical stabilizer */}
        <path
          className="acft-line acft-draw"
          d="M 1000 203
             Q 1020 100, 1045 72
             L 1070 72
             Q 1080 90, 1090 150
             L 1100 250 Z"
        />

        {/* Horizontal stabilizer */}
        <path
          className="acft-line acft-draw"
          d="M 1020 250
             L 1090 240
             L 1100 255
             L 1020 265 Z"
        />

        {/* Landing gear — struts + wheels */}
        <path className="acft-line acft-draw" d="M 200 297 L 200 360" />
        <circle
          className="acft-line acft-draw-circle"
          cx="200"
          cy="366"
          r="11"
        />

        <path className="acft-line acft-draw" d="M 580 297 L 580 355" />
        <circle
          className="acft-line acft-draw-circle"
          cx="580"
          cy="363"
          r="14"
        />
      </g>

      {/* ═══════════════════════════════════════════════════════════
          SKIN DETAIL — windows, doors, panel lines. Fades in with skin.
      ═══════════════════════════════════════════════════════════ */}
      <g className="acft-skin-detail" style={{ opacity: 0.7 }}>
        {/* Cockpit windshield */}
        <path
          className="acft-line"
          d="M 125 215 L 168 208 L 172 222 L 128 228 Z"
        />
        <path
          className="acft-line"
          d="M 178 208 L 202 206 L 204 219 L 182 221 Z"
        />

        {/* Passenger windows — row along the upper fuselage */}
        {Array.from({ length: 22 }).map((_, i) => (
          <rect
            key={`w-${i}`}
            className="acft-faint"
            x={240 + i * 32}
            y={228}
            width={16}
            height={10}
            rx={2}
          />
        ))}

        {/* Front door */}
        <rect
          className="acft-line"
          x={212}
          y={215}
          width={28}
          height={72}
          rx={3}
        />

        {/* Rear door */}
        <rect
          className="acft-line"
          x={905}
          y={215}
          width={28}
          height={72}
          rx={3}
        />

        {/* Cargo doors */}
        <rect
          className="acft-faint"
          x={290}
          y={270}
          width={80}
          height={24}
          rx={2}
        />
        <rect
          className="acft-faint"
          x={770}
          y={270}
          width={90}
          height={24}
          rx={2}
        />

        {/* Panel lines — a few accents along the fuselage */}
        <line className="acft-faint" x1="260" y1="203" x2="260" y2="297" />
        <line className="acft-faint" x1="880" y1="203" x2="880" y2="297" />
        <line className="acft-faint" x1="200" y1="250" x2="1000" y2="250" />
      </g>

      {/* ═══════════════════════════════════════════════════════════
          SYSTEMS — hydraulic / fuel / pneumatic. Appears at B-CHECK.
      ═══════════════════════════════════════════════════════════ */}
      <g className="acft-systems" style={{ opacity: 0 }}>
        {/* Hydraulic lines running fore-aft */}
        <path
          className="acft-line"
          d="M 210 235 Q 500 235, 900 235"
          strokeDasharray="6 3"
        />
        <path
          className="acft-line"
          d="M 210 265 Q 500 265, 900 265"
          strokeDasharray="6 3"
        />

        {/* Pneumatic line to engine */}
        <path className="acft-line" d="M 500 265 Q 520 280, 545 315" />

        {/* Fuel tank (dashed region inside wing) */}
        <rect className="acft-dashed" x="420" y="290" width="230" height="30" />

        {/* Engine fan (front view within the nacelle) */}
        <circle className="acft-line" cx="545" cy="345" r="26" />
        <circle className="acft-faint" cx="545" cy="345" r="14" />
        {/* Fan blades radiating outward */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x1 = 545 + Math.cos(angle) * 14;
          const y1 = 345 + Math.sin(angle) * 14;
          const x2 = 545 + Math.cos(angle) * 26;
          const y2 = 345 + Math.sin(angle) * 26;
          return (
            <line
              key={`fan-${i}`}
              className="acft-faint"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          );
        })}

        {/* Electrical bus along the crown */}
        <path className="acft-faint" d="M 210 218 Q 500 218, 900 218" />
      </g>

      {/* ═══════════════════════════════════════════════════════════
          STRUCTURE — ribs, spars, stringers. Appears at C-CHECK.
      ═══════════════════════════════════════════════════════════ */}
      <g className="acft-structure" style={{ opacity: 0 }}>
        {/* Vertical ribs along the fuselage */}
        {Array.from({ length: 17 }).map((_, i) => (
          <line
            key={`rib-${i}`}
            className="acft-line"
            x1={220 + i * 46}
            y1={203}
            x2={220 + i * 46}
            y2={297}
          />
        ))}

        {/* Longitudinal stringers */}
        <line className="acft-faint" x1="200" y1="225" x2="1000" y2="225" />
        <line className="acft-faint" x1="200" y1="275" x2="1000" y2="275" />

        {/* Wing spars */}
        <line className="acft-line" x1="400" y1="288" x2="700" y2="336" />
        <line className="acft-line" x1="420" y1="296" x2="700" y2="343" />

        {/* Wing ribs */}
        {Array.from({ length: 6 }).map((_, i) => {
          const t = i / 5;
          const xTop = 400 + t * 300;
          const yTop = 288 + t * 48;
          const xBot = 420 + t * 280;
          const yBot = 296 + t * 47;
          return (
            <line
              key={`wr-${i}`}
              className="acft-faint"
              x1={xTop}
              y1={yTop}
              x2={xBot}
              y2={yBot}
            />
          );
        })}

        {/* Tail structure — fin ribs */}
        <line className="acft-faint" x1="1030" y1="130" x2="1075" y2="200" />
        <line className="acft-faint" x1="1045" y1="100" x2="1085" y2="180" />
      </g>

      {/* ═══════════════════════════════════════════════════════════
          CORE — engine internals, APU, avionics, cabin floor. Appears at D-CHECK.
      ═══════════════════════════════════════════════════════════ */}
      <g className="acft-core" style={{ opacity: 0 }}>
        {/* Engine compressor stages — vertical bars inside nacelle */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`stage-${i}`}
            className="acft-line"
            x1={575 + i * 15}
            y1={322}
            x2={575 + i * 15}
            y2={378}
          />
        ))}

        {/* Combustion chamber outline */}
        <ellipse className="acft-faint" cx="630" cy="350" rx="14" ry="20" />

        {/* APU in the tail cone */}
        <rect
          className="acft-line"
          x={1040}
          y={240}
          width={28}
          height={22}
          rx={2}
        />
        <line className="acft-faint" x1="1046" y1="246" x2="1062" y2="246" />
        <line className="acft-faint" x1="1046" y1="252" x2="1062" y2="252" />

        {/* Avionics bay in the nose */}
        <rect
          className="acft-line"
          x={130}
          y={230}
          width={45}
          height={24}
          rx={2}
        />
        <line className="acft-faint" x1="138" y1="236" x2="168" y2="236" />
        <line className="acft-faint" x1="138" y1="242" x2="168" y2="242" />

        {/* Cabin floor line */}
        <line className="acft-line" x1="200" y1="272" x2="1000" y2="272" />

        {/* Seat rows (simplified silhouettes) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={`seat-${i}`}
            className="acft-faint"
            x={240 + i * 58}
            y={262}
            width={22}
            height={10}
            rx={1}
          />
        ))}
      </g>

      {/* ═══════════════════════════════════════════════════════════
          STRESS — high-fatigue cross-hatch overlay. Pulses at D-CHECK.
      ═══════════════════════════════════════════════════════════ */}
      <g className="acft-stress" style={{ opacity: 0 }}>
        {/* Crown stress region */}
        <rect
          className="acft-dashed"
          x={540}
          y={195}
          width={120}
          height={16}
          rx={2}
        />
        {/* Wing root lower surface */}
        <rect
          className="acft-dashed"
          x={430}
          y={285}
          width={100}
          height={18}
          rx={2}
        />
        {/* Gear pivot region */}
        <rect
          className="acft-dashed"
          x={560}
          y={290}
          width={45}
          height={14}
          rx={2}
        />
      </g>

      {/* ═══════════════════════════════════════════════════════════
          MARKERS — inspection points, one class per tier.
      ═══════════════════════════════════════════════════════════ */}
      <g className="acft-markers">
        {/* A-CHECK — surface inspection points */}
        <circle className="acft-marker acft-marker-a" cx={110} cy={215} r={4} />
        <circle className="acft-marker acft-marker-a" cx={390} cy={286} r={4} />
        <circle
          className="acft-marker acft-marker-a"
          cx={1085}
          cy={240}
          r={4}
        />

        {/* B-CHECK — intermediate inspection points */}
        <circle className="acft-marker acft-marker-b" cx={226} cy={250} r={4} />
        <circle className="acft-marker acft-marker-b" cx={919} cy={250} r={4} />
        <circle className="acft-marker acft-marker-b" cx={300} cy={282} r={4} />

        {/* C-CHECK — heavy maintenance points */}
        <circle className="acft-marker acft-marker-c" cx={545} cy={315} r={4} />
        <circle className="acft-marker acft-marker-c" cx={460} cy={292} r={4} />
        <circle className="acft-marker acft-marker-c" cx={580} cy={297} r={4} />

        {/* D-CHECK — structural points */}
        <circle className="acft-marker acft-marker-d" cx={600} cy={203} r={4} />
        <circle className="acft-marker acft-marker-d" cx={470} cy={295} r={4} />
        <circle className="acft-marker acft-marker-d" cx={640} cy={327} r={4} />
      </g>

      {/* ═══════════════════════════════════════════════════════════
          SCAN LINE — 1px horizontal sweep, animated independently.
      ═══════════════════════════════════════════════════════════ */}
      <rect
        className="acft-scanline"
        x={0}
        y={0}
        width={1200}
        height={1}
        fill="currentColor"
        opacity={0}
      />
    </svg>
  );
}
