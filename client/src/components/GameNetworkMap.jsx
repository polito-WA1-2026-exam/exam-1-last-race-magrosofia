const STATION_LAYOUT = {
  'Porta Susa': {
    x: 220,
    y: 120,
    labelX: 220,
    labelY: 90,
    anchor: 'middle',
    label: ['Porta Susa']
  },

  'Porta Nuova': {
    x: 180,
    y: 280,
    labelX: 180,
    labelY: 320,
    anchor: 'middle',
    label: ['Porta', 'Nuova']
  },

  Politecnico: {
    x: 110,
    y: 420,
    labelX: 92,
    labelY: 455,
    anchor: 'middle',
    label: ['Politecnico']
  },

  Lingotto: {
    x: 310,
    y: 475,
    labelX: 280,
    labelY: 510,
    anchor: 'start',
    label: ['Lingotto']
  },

  'Piazza Statuto': {
    x: 450,
    y: 120,
    labelX: 450,
    labelY: 76,
    anchor: 'middle',
    label: ['Piazza', 'Statuto']
  },

  'Porta Palazzo': {
    x: 680,
    y: 120,
    labelX: 680,
    labelY: 76,
    anchor: 'middle',
    label: ['Porta', 'Palazzo']
  },

  'Piazza Castello': {
    x: 370,
    y: 280,
    labelX: 370,
    labelY: 320,
    anchor: 'middle',
    label: ['Piazza', 'Castello']
  },

  'Mole Antonelliana': {
    x: 560,
    y: 280,
    labelX: 560,
    labelY: 320,
    anchor: 'middle',
    label: ['Mole', 'Antonelliana']
  },

  'Piazza Vittorio Veneto': {
    x: 750,
    y: 280,
    labelX: 750,
    labelY: 320,
    anchor: 'middle',
    label: ['Piazza Vittorio', 'Veneto']
  },

  'Parco del Valentino': {
    x: 450,
    y: 430,
    labelX: 450,
    labelY: 465,
    anchor: 'middle',
    label: ['Parco del', 'Valentino']
  },

  'Gran Madre': {
    x: 650,
    y: 430,
    labelX: 650,
    labelY: 470,
    anchor: 'middle',
    label: ['Gran Madre']
  },

  Superga: {
    x: 780,
    y: 355,
    labelX: 780,
    labelY: 380,
    anchor: 'start',
    label: ['Superga']
  }
};

const LINE_COLORS = {
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  yellow: '#facc15'
};

function getFallbackPosition(station, index, total) {
  const angle = (2 * Math.PI * index) / Math.max(total, 1);

  return {
    x: 450 + 280 * Math.cos(angle),
    y: 280 + 180 * Math.sin(angle),
    labelX: 450 + 310 * Math.cos(angle),
    labelY: 280 + 210 * Math.sin(angle),
    anchor: 'middle',
    label: [station.name]
  };
}

function getStationLayout(station, index, total) {
  return STATION_LAYOUT[station.name] ?? getFallbackPosition(station, index, total);
}

function buildLayoutMap(stations) {
  const layoutMap = new Map();

  stations.forEach((station, index) => {
    layoutMap.set(station.id, getStationLayout(station, index, stations.length));
  });

  return layoutMap;
}

function formatLineColor(line) {
  if (!line) {
    return '#94a3b8';
  }

  return LINE_COLORS[line.color] || line.color || '#94a3b8';
}

function getStationClassName({ isStart, isDestination, isInterchange }) {
  if (isStart) {
    return 'map-station map-station-start';
  }

  if (isDestination) {
    return 'map-station map-station-destination';
  }

  if (isInterchange) {
    return 'map-station map-station-interchange';
  }

  return 'map-station';
}

function StationLabel({ layout }) {
  return (
    <text
      x={layout.labelX}
      y={layout.labelY}
      textAnchor={layout.anchor}
      className="map-station-label"
    >
      {layout.label.map((line, index) => (
        <tspan
          key={line}
          x={layout.labelX}
          dy={index === 0 ? 0 : 17}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
}

function GameNetworkMap({
  stations = [],
  segments = [],
  showConnections = true,
  startStation = null,
  destinationStation = null,
  selectedSegmentIds = []
}) {
  const layouts = buildLayoutMap(stations);
  const selectedSet = new Set(selectedSegmentIds);

  const startId = startStation?.id ?? null;
  const destinationId = destinationStation?.id ?? null;

  return (
    <div className="game-map-shell">
      <svg
        className="game-network-map"
        viewBox="0 0 900 560"
        role="img"
        aria-label="Metro network map"
      >

        {showConnections && (
          <g className="game-map-segments">
            {segments.map((segment) => {
              const p1 = layouts.get(segment.station1.id);
              const p2 = layouts.get(segment.station2.id);

              if (!p1 || !p2) {
                return null;
              }

              return (
                <line
                  key={segment.id}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={formatLineColor(segment.line)}
                  className={
                    selectedSet.has(segment.id)
                      ? 'map-segment map-segment-selected'
                      : 'map-segment'
                  }
                />
              );
            })}
          </g>
        )}

        <g className="game-map-stations">
          {stations.map((station, index) => {
            const layout = layouts.get(station.id);

            if (!layout) {
              return null;
            }

            const isStart = station.id === startId;
            const isDestination = station.id === destinationId;
            const isInterchange = Boolean(station.isInterchange);

            return (
              <g key={station.id} className="map-station-group">
                <circle
                  cx={layout.x}
                  cy={layout.y}
                  r={isStart || isDestination ? 15 : isInterchange ? 12 : 8}
                  className={getStationClassName({
                    isStart,
                    isDestination,
                    isInterchange
                  })}
                />

                {isInterchange && !isStart && !isDestination && (
                  <circle
                    cx={layout.x}
                    cy={layout.y}
                    r="4"
                    className="map-station-core"
                  />
                )}

                <StationLabel layout={layout} />

                {isStart && (
                  <text
                    x={layout.x}
                    y={layout.y - 24}
                    textAnchor="middle"
                    className="map-station-badge"
                  >
                    START
                  </text>
                )}

                {isDestination && (
                  <text
                    x={layout.x}
                    y={layout.y - 24}
                    textAnchor="middle"
                    className="map-station-badge"
                  >
                    DEST
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default GameNetworkMap;