function HeroMetroMap() {
  const stations = [
    { x: 80, y: 80 },
    { x: 190, y: 80, interchange: true },
    { x: 280, y: 150, interchange: true },
    { x: 410, y: 150, interchange: true },
    { x: 520, y: 220, interchange: true },   // <-- questo è il nodo rosso/verde
    { x: 640, y: 220 },

    { x: 95, y: 320 },
    { x: 190, y: 245 },
    { x: 280, y: 245, interchange: true },
    { x: 500, y: 105 },
    { x: 635, y: 105 },

    { x: 85, y: 205 },
    { x: 190, y: 205 },
    { x: 365, y: 220 },
    { x: 635, y: 315 },

    { x: 145, y: 55 },
    { x: 365, y: 310 },
    { x: 535, y: 310 }
  ];

  return (
    <svg
      className="hero-metro-map"
      viewBox="0 0 720 390"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="network-lines" filter="url(#map-glow)">
        <polyline
          className="network-line line-red-map"
          points="80,80 190,80 280,150 410,150 520,220 640,220"
        />

        <polyline
          className="network-line line-blue-map"
          points="95,320 190,245 280,245 410,150 500,105 635,105"
        />

        <polyline
          className="network-line line-green-map"
          points="85,205 190,205 280,150 365,220 520,220 635,315"
        />

        <polyline
          className="network-line line-yellow-map"
          points="145,55 190,80 280,150 280,245 365,310 535,310"
        />
      </g>

      <g className="network-stations">
        {stations.map((station, index) => (
          <g key={index}>
            {station.interchange ? (
              <>
                <circle
                  className="station-node station-interchange-outer"
                  cx={station.x}
                  cy={station.y}
                  r="17"
                />
                <circle
                  className="station-node station-interchange-inner"
                  cx={station.x}
                  cy={station.y}
                  r="8"
                />
              </>
            ) : (
              <circle
                className="station-node"
                cx={station.x}
                cy={station.y}
                r="9"
              />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

export default HeroMetroMap;