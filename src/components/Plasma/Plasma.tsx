"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

export type PlasmaDirection = "forward" | "reverse" | "pingpong";

export interface PlasmaProps extends HTMLAttributes<HTMLDivElement> {
  color?: string;
  speed?: number;
  direction?: PlasmaDirection;
  scale?: number;
  twist?: number;
  wave?: number;
  softness?: number;
  shine?: number;
  brightness?: number;
  grain?: number;
  quality?: number;
  mouseInteractive?: boolean;
  intro?: boolean;
  fade?: number;
  opacity?: number;
  lightMode?: boolean;
  paused?: boolean;
  dpr?: number;
}

type Program = {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
};

const VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const PLASMA_SHADER = `#version 300 es
precision highp float;
uniform vec2 uView;
uniform vec2 uScale;
uniform float uZoom;
uniform float uTime;
uniform float uTwist;
uniform float uWave;
uniform float uSharpness;
uniform vec2 uOrbit;
uniform float uDither;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 c = (gl_FragCoord.xy * uScale - 0.5 * uView) / uZoom;
  vec3 rd = normalize(vec3(c, uView.y));
  vec3 ro = vec3(0.0, 0.0, -4.0);
  float cy = cos(uOrbit.x);
  float sy = sin(uOrbit.x);
  float cx = cos(uOrbit.y);
  float sx = sin(uOrbit.y);
  mat3 orbit = mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy)
    * mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
  ro = orbit * ro;
  rd = orbit * rd;
  float z = 0.0;
  float density = 0.0;
  float band = 0.0;
  for (int i = 0; i < 60; i++) {
    vec3 p = ro + rd * z;
    vec3 s = p;
    float d = p.y - uTime;
    p.x += uWave * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
    p.xz *= mat2(cos(p.y * uTwist + vec4(0.0, 11.0, 33.0, 0.0) - uTime));
    vec2 q = p.xz;
    float shell = abs(sqrt(length(q * q)) - 0.25 * (5.0 + s.y)) / 3.0;
    float stepLength = shell + 0.0008;
    z += stepLength;
    float phase = s.y + p.z * 0.5 + s.z - length(s - p);
    float weight = (1.0 + sin(phase + 8.0)) * exp(-shell * uSharpness) * stepLength;
    density += weight;
    band += weight * (0.5 + 0.5 * sin(phase * 0.5 + 1.0));
  }
  vec2 encoded = sqrt(vec2(density, band) / (1.0 + vec2(density, band)));
  encoded += (vec2(hash(gl_FragCoord.xy), hash(gl_FragCoord.yx + 17.0)) - 0.5) * uDither;
  outColor = vec4(encoded, 0.0, 1.0);
}`;

const COMPOSITE_SHADER = `#version 300 es
precision highp float;
uniform sampler2D uVolume;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uHighlight;
uniform vec3 uInk;
uniform float uGain;
uniform float uShine;
uniform float uPresence;
uniform float uGrain;
uniform float uFade;
uniform float uOpacity;
uniform float uTime;
uniform float uLightMode;
uniform vec3 uHeat;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float smootherstep(float edge, float x) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 encoded = clamp(texture(uVolume, uv).rg, 0.0, 0.9995);
  encoded *= encoded;
  vec2 volume = encoded / (1.0 - encoded);
  vec2 offset = (gl_FragCoord.xy - uHeat.xy) / uResolution.y;
  float heat = uHeat.z * exp(-dot(offset, offset) / 0.05);
  float density = volume.r * uGain * uPresence * (1.0 + heat * 0.35);
  float band = clamp(volume.g / max(volume.r, 0.00001), 0.0, 1.0);
  vec3 tint = mix(uColor, uHighlight, band * 0.35);
  vec3 hdr = tint * density + uHighlight * density * density * uShine;
  float peak = max(hdr.r, max(hdr.g, hdr.b));
  float level = 1.0 - exp(-peak);
  float hot = smoothstep(1.0, 3.0, peak);
  float edge = uFade * 0.5;
  float mask = smootherstep(edge, uv.x) * smootherstep(edge, 1.0 - uv.x)
    * smootherstep(edge, uv.y) * smootherstep(edge, 1.0 - uv.y);
  mask *= uOpacity;
  float grain = (hash(gl_FragCoord.xy + fract(uTime * 7.31) * 113.0) - 0.5) * uGrain;
  if (uLightMode > 0.5) {
    vec3 color = mix(uInk, vec3(1.0), hot * 0.75);
    float alpha = clamp(pow(level, 0.8) * 0.9 * (1.0 + grain), 0.0, 1.0) * mask;
    outColor = vec4(color * alpha, alpha);
  } else {
    vec3 hue = hdr / max(peak, 0.0001);
    vec3 color = mix(hue * level, vec3(level), hot * 0.6);
    color = pow(color, vec3(1.0 / 2.2));
    color = clamp(color + grain * level, 0.0, 1.0) * mask;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`;

const INTRO_SECONDS = 1.6;
const MAX_VOLUME_PIXELS = 1_600_000;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function createProgram(
  gl: WebGL2RenderingContext,
  fragmentSource: string,
): Program | null {
  const compileShader = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) {
      console.error("Plasma could not create a WebGL shader.");
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    console.error("Plasma shader compilation failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  };

  const vertex = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    if (program) gl.deleteProgram(program);
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Plasma program linking failed:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  const uniforms: Program["uniforms"] = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i += 1) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
}

export default function Plasma({
  color = "#a6a3b8",
  speed = 1,
  direction = "forward",
  scale = 1,
  twist = 1,
  wave = 1,
  softness = 0.5,
  shine = 1,
  brightness = 1,
  grain = 0.04,
  quality = 0.75,
  mouseInteractive = true,
  intro = true,
  fade = 0,
  opacity = 1,
  lightMode = false,
  paused = false,
  dpr,
  className = "",
  ...rest
}: PlasmaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const settings = {
    color: String(color),
    speed,
    direction,
    scale: Math.max(0.1, scale),
    twist,
    wave: Math.max(0, wave),
    softness: clamp(softness, 0, 1),
    shine: Math.max(0, shine),
    brightness: Math.max(0, brightness),
    grain: Math.max(0, grain),
    quality: clamp(quality, 0.25, 1),
    mouseInteractive,
    intro,
    fade: clamp(fade, 0, 1),
    opacity: clamp(opacity, 0, 1),
    lightMode,
    paused,
    dpr,
  };
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
    wakeRef.current?.();
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!container || !canvas) return;
    if (!gl) {
      console.error("Plasma requires WebGL 2, which is unavailable in this browser.");
      return;
    }

    const floatTargets = Boolean(gl.getExtension("EXT_color_buffer_float"));
    const volumeProgram = createProgram(gl, PLASMA_SHADER);
    const compositeProgram = createProgram(gl, COMPOSITE_SHADER);
    if (!volumeProgram || !compositeProgram) {
      if (volumeProgram) gl.deleteProgram(volumeProgram.program);
      if (compositeProgram) gl.deleteProgram(compositeProgram.program);
      return;
    }

    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    const texture = gl.createTexture();
    const framebuffer = gl.createFramebuffer();
    if (!buffer || !vao || !texture || !framebuffer) {
      console.error("Plasma could not allocate the WebGL rendering resources.");
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteTexture(texture);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteProgram(volumeProgram.program);
      gl.deleteProgram(compositeProgram.program);
      return;
    }

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colorCache = new Map<string, number[]>();
    const toLinear = (value: string) => {
      const cached = colorCache.get(value);
      if (cached) return cached;
      let rgb = [1, 1, 1];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = "#ffffff";
        probe.fillStyle = value;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r, g, b].map((channel) => Math.pow(channel / 255, 2.2));
      }
      colorCache.set(value, rgb);
      return rgb;
    };

    const view = { width: 1, height: 1, volumeWidth: 1, volumeHeight: 1 };
    const target = { width: 0, height: 0 };
    const pointer = { x: 0, y: 0, inside: false };
    const state = {
      clock: 0,
      intro: settingsRef.current.intro && !reduceMotion ? 0 : 1,
      yaw: 0,
      pitch: 0,
      yawVelocity: 0,
      pitchVelocity: 0,
      heat: 0,
      heatX: 0,
      heatY: 0,
    };
    let raf = 0;
    let last = 0;
    let visible = true;

    const sizeTarget = (width: number, height: number) => {
      if (target.width === width && target.height === height) return;
      target.width = width;
      target.height = height;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      if (floatTargets) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    };

    const timeOf = (current: typeof settings) => {
      const time = state.clock * 0.4;
      if (current.direction === "reverse") return -time;
      if (current.direction !== "pingpong") return time;
      const span = 10;
      const segment = (state.clock % span) / span;
      const eased = segment * segment * (3 - 2 * segment);
      return (Math.floor(state.clock / span) % 2 === 0 ? eased : 1 - eased) * span * 0.4;
    };

    const render = () => {
      const current = settingsRef.current;
      const presence = state.intro * state.intro * (3 - 2 * state.intro);
      gl.bindVertexArray(vao);
      sizeTarget(view.volumeWidth, view.volumeHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, view.volumeWidth, view.volumeHeight);
      gl.useProgram(volumeProgram.program);
      const volumeUniforms = volumeProgram.uniforms;
      gl.uniform2f(volumeUniforms.uView, view.width, view.height);
      gl.uniform2f(volumeUniforms.uScale, view.width / view.volumeWidth, view.height / view.volumeHeight);
      gl.uniform1f(volumeUniforms.uZoom, current.scale);
      gl.uniform1f(volumeUniforms.uTime, timeOf(current) + (1 - presence) * 1.4);
      gl.uniform1f(volumeUniforms.uTwist, current.twist);
      gl.uniform1f(volumeUniforms.uWave, 0.4 * current.wave);
      gl.uniform1f(volumeUniforms.uSharpness, 100 - current.softness * 90);
      gl.uniform2f(volumeUniforms.uOrbit, state.yaw, state.pitch);
      gl.uniform1f(volumeUniforms.uDither, floatTargets ? 0 : 1 / 255);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const base = toLinear(current.color);
      const highlight = base.map((channel) => channel + (1 - channel) * 0.85);
      const tone = 0.2126 * base[0] + 0.7152 * base[1] + 0.0722 * base[2];
      const depth = Math.min(1, 0.16 / Math.max(tone, 0.001));
      const ink = base.map((channel) => Math.pow(Math.min(1, channel * depth), 1 / 2.2));
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(compositeProgram.program);
      const compositeUniforms = compositeProgram.uniforms;
      gl.uniform2f(compositeUniforms.uResolution, canvas.width, canvas.height);
      gl.uniform3fv(compositeUniforms.uColor, base);
      gl.uniform3fv(compositeUniforms.uHighlight, highlight);
      gl.uniform3fv(compositeUniforms.uInk, ink);
      gl.uniform1f(compositeUniforms.uGain, 4.8 * current.brightness);
      gl.uniform1f(compositeUniforms.uShine, 0.025 * current.shine);
      gl.uniform1f(compositeUniforms.uPresence, presence);
      gl.uniform1f(compositeUniforms.uGrain, current.grain);
      gl.uniform1f(compositeUniforms.uFade, current.fade);
      gl.uniform1f(compositeUniforms.uOpacity, current.opacity);
      gl.uniform1f(compositeUniforms.uTime, state.clock % 1000);
      gl.uniform1f(compositeUniforms.uLightMode, current.lightMode ? 1 : 0);
      gl.uniform3f(
        compositeUniforms.uHeat,
        (state.heatX * canvas.width) / view.width,
        ((view.height - state.heatY) * canvas.height) / view.height,
        state.heat,
      );
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(compositeUniforms.uVolume, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const current = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const moving = !current.paused && !reduceMotion;
      if (moving) state.clock += dt * current.speed;
      if (!current.intro || reduceMotion) state.intro = 1;
      else if (state.intro < 1) state.intro = Math.min(1, state.intro + dt / INTRO_SECONDS);
      const engaged = current.mouseInteractive && pointer.inside && !reduceMotion;
      const goalYaw = engaged ? (pointer.x / view.width - 0.5) * 0.9 : 0;
      const goalPitch = engaged ? (pointer.y / view.height - 0.5) * 0.18 : 0;
      state.yawVelocity += (40 * (goalYaw - state.yaw) - 11 * state.yawVelocity) * dt;
      state.pitchVelocity += (40 * (goalPitch - state.pitch) - 11 * state.pitchVelocity) * dt;
      state.yaw += state.yawVelocity * dt;
      state.pitch += state.pitchVelocity * dt;
      state.heat += ((engaged ? 1 : 0) - state.heat) * (1 - Math.exp(-dt * (engaged ? 4 : 2)));
      state.heatX += (pointer.x - state.heatX) * (1 - Math.exp(-dt * 8));
      state.heatY += (pointer.y - state.heatY) * (1 - Math.exp(-dt * 8));
      render();
      const settling =
        state.intro < 1 ||
        Math.abs(goalYaw - state.yaw) > 0.0005 ||
        Math.abs(state.yawVelocity) > 0.0005 ||
        Math.abs(goalPitch - state.pitch) > 0.0005 ||
        Math.abs(state.pitchVelocity) > 0.0005 ||
        Math.abs((engaged ? 1 : 0) - state.heat) > 0.002;
      if (moving || settling) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const resize = () => {
      const current = settingsRef.current;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const ratio = Math.min(current.dpr || window.devicePixelRatio || 1, 2);
      view.width = width;
      view.height = height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      let resolutionScale = current.quality;
      if (width * height * resolutionScale * resolutionScale > MAX_VOLUME_PIXELS) {
        resolutionScale = Math.sqrt(MAX_VOLUME_PIXELS / (width * height));
      }
      view.volumeWidth = Math.max(1, Math.round(width * resolutionScale));
      view.volumeHeight = Math.max(1, Math.round(height * resolutionScale));
      wake();
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
      wake();
    };
    const onPointerLeave = () => {
      pointer.inside = false;
      wake();
    };
    const onVisibility = () => {
      last = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    render();

    let lastQuality = settingsRef.current.quality;
    let lastDpr = settingsRef.current.dpr;
    wakeRef.current = () => {
      const current = settingsRef.current;
      if (current.quality !== lastQuality || current.dpr !== lastDpr) {
        lastQuality = current.quality;
        lastDpr = current.dpr;
        resize();
        return;
      }
      if (!raf) render();
      wake();
    };

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(texture);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteProgram(volumeProgram.program);
      gl.deleteProgram(compositeProgram.program);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={["relative h-full w-full overflow-hidden", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden="true" />
    </div>
  );
}
