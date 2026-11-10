"use client";

import { useRef, useEffect } from "react";

const VERT = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

// Simplified noise for background texture
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;

    // Smooth color palette based on brand green (#1e5631)
    vec3 color1 = vec3(0.118, 0.337, 0.192); // Deep Brand Green
    vec3 color2 = vec3(0.988, 0.976, 0.973); // Soft Surface White

    // Animated gradient movement
    float noise = hash(uv + u_time * 0.05);
    float dist = distance(uv, mouse);

    vec3 finalColor = mix(color2, color1, 0.05 + 0.02 * sin(u_time * 0.5 + uv.y * 10.0));
    finalColor += 0.01 * noise; // Add subtle grain

    // Very subtle mouse interaction
    finalColor = mix(finalColor, color1, (1.0 - smoothstep(0.0, 0.8, dist)) * 0.03);

    gl_FragColor = vec4(finalColor, 1.0);
}`;

export default function ShaderBackground({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return () => ro.disconnect();

    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    function onMove(e) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        mouse.x = x * canvas.width;
        mouse.y = y * canvas.height;
      }
    }
    window.addEventListener("mousemove", onMove);

    let raf = requestAnimationFrame(function render(t) {
      if (canvas && gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (uTime) gl.uniform1f(uTime, 0.001 * t);
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(render);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
