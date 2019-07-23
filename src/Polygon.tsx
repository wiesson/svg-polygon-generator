import * as React from "react";

type Triangle = {
  p1: number[];
  p2: number[];
  p3: number[];
};

type Value = {
  key: string;
  title: string;
  percentage: number;
  points?: Triangle[];
  textPoints?: number[];
  gradientPoint?: number[];
  gradientAngle?: number;
  textAngle?: number;
};

type Point = {
  r: number;
  phi: number;
};

function toRadians(angle: number): number {
  return (Math.PI / 180) * angle;
}

function pointsFn(elements: any[], angle: number, radius: number) {
  return elements.map((_, index) => ({
    phi: toRadians(angle * index - angle / 2),
    r: radius
  }));
}

function polygonFn(points: Point[] = []): string {
  return points.map(toCartesian).join(" ");
}

function getPoints(points: Triangle): string {
  return Object.values(points)
    .map(p => p.join(" "))
    .toString();
}

function toCartesian({ r, phi }: Point) {
  return [r * Math.cos(phi), r * Math.sin(phi)];
}

type Props = {
  values: Value[];
  offset?: number;
  textRadius?: number;
  size?: number;
};

function getFactor(value: number) {
  return value * 0.9 + 10;
}

function Polygon({ values, offset = 0, textRadius = 65, size = 300 }: Props) {
  const radius = 48;
  const innerRadius = 48 - 2;

  const angle = 360 / values.length;

  const points = pointsFn(values, angle, radius);
  const polygon = polygonFn(points);

  const triangles = values.map((v, index) => {
    const textPoint = toCartesian({
      phi: toRadians(offset + angle * index),
      r: (radius * textRadius) / 100
    });

    const i = index + 1;

    const halfAngle = angle / 2;

    const p1 = [0, 0];

    const p2 = [
      Math.cos(toRadians(-halfAngle) * i) * innerRadius,
      Math.sin(toRadians(-halfAngle) * i) * innerRadius
    ];

    const p3 = [
      Math.cos(toRadians(halfAngle * i)) * innerRadius,
      Math.sin(toRadians(halfAngle * i)) * innerRadius
    ];

    return {
      ...v,
      textPoint,
      points: {
        p1,
        p2,
        p3
      }
    };
  });

  const [first, ...rest] = triangles;
  const trianglePoints = getPoints(first.points);

  return (
    <div style={{ padding: "2rem" }}>
      <svg viewBox="-50 -50 100 100" height={size} width={size}>
        <defs>
          <linearGradient
            id="polygonGradient"
            x1="-25%"
            y1="-25%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#C6C6C6" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>

          <filter id="shadow" x="-20%" y="-20%" width="140%" height="120%">
            <feGaussianBlur stdDeviation="2 2" result="shadow" />
            <feOffset dx="6" dy="6" />
          </filter>
          <filter id="tshadow" x="0" y="0" width="200%" height="200%">
            <feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
          <filter id="tshadow2" width="150%" height="150%">
            <feOffset result="offOut" in="SourceGraphic" dx="30" dy="30" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>

          {triangles.map(t => {
            const { percentage } = t;
            const value = getFactor(percentage);

            return (
              <linearGradient
                id={`fillGradient${t.key}`}
                key={`fillGradient${t.key}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="gold" />
                <stop offset={`${value}%`} stopColor="tomato" />
                <stop offset={`${value}%`} stopColor="transparent" />
              </linearGradient>
            );
          })}
        </defs>

        <g>
          <polygon
            points={polygon}
            stroke="white"
            strokeWidth="4"
            fill={`url(#polygonGradient)`}
            transform={`rotate(${offset})`}
          />

          <polygon
            points={trianglePoints}
            stroke="white"
            strokeWidth="0.5"
            fill={`url(#fillGradient1)`}
            transform={`rotate(${offset})`}
          />

          {rest.map((t, index) => {
            return (
              <polygon
                transform={`rotate(${angle * (index + 1) + offset})`}
                key={`polygon${t.key}`}
                points={trianglePoints}
                stroke="white"
                strokeWidth="0.5"
                fill={`url(#fillGradient${t.key})`}
              />
            );
          })}

          {triangles.map(t => {
            const [x, y] = t.textPoint;

            return (
              <g key={t.key}>
                <text
                  x={x}
                  y={y - 1}
                  fontSize="6"
                  fontWeight="bold"
                  fill="white"
                  textAnchor="middle"
                >
                  <tspan>{t.percentage}%</tspan>
                </text>

                <text
                  textAnchor="middle"
                  x={x}
                  y={y + 4}
                  fontSize="4"
                  fill="white"
                >
                  <tspan>{t.title}</tspan>
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default Polygon;
